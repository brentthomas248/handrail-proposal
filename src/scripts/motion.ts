import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type PanelName = 'left' | 'center' | 'right';
interface Frame {
  x: number;
  y: number;
  scale: number;
  rotationX: number;
  rotationY: number;
  rotation: number;
}
interface Stop {
  name: string;
  element: HTMLElement | null;
  panel: PanelName;
  arrival: number;
  position: number;
}
interface Fold {
  left: number;
  right: number;
}
const root = document.documentElement;
const sheet = document.querySelector<HTMLElement>('.proposal-sheet');
const journey = document.querySelector<HTMLElement>('.flyer-journey');
const stage = document.querySelector<HTMLElement>('.flyer-stage');
const mode = document.querySelector<HTMLButtonElement>('#reading-mode');
const nav = document.querySelector<HTMLElement>('.chapter-nav');
const caption = document.querySelector<HTMLElement>('#tour-caption');
const current = document.querySelector<HTMLElement>('#current-stop');
const total = document.querySelector<HTMLElement>('#total-stops');
const left = sheet?.querySelector<HTMLElement>('[data-panel="left"]');
const right = sheet?.querySelector<HTMLElement>('[data-panel="right"]');
const panels = sheet?.querySelectorAll<HTMLElement>('.fold-panel');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const hold = 0.8;
const travel = 1.25;
let camera: Frame | undefined;
let timeline: gsap.core.Timeline | undefined;
let trigger: ScrollTrigger | undefined;
let stops: Stop[] = [];
let resizeTimer: ReturnType<typeof setTimeout>;
let lastIndex = -1;

function panelFor(element: HTMLElement): PanelName {
  const name = element.closest<HTMLElement>('[data-panel]')?.dataset.panel;
  return name === 'left' || name === 'right' ? name : 'center';
}

function bounds(element: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== sheet) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

function frameFor(element: HTMLElement | null, folded = false): Frame {
  if (!sheet || !stage) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotation: 0,
    };
  }
  const mobile = innerWidth < 760;
  const sheetWidth = sheet.offsetWidth;
  const sheetHeight = sheet.offsetHeight;
  const panelWidth = left?.offsetWidth || sheetWidth / 3;
  const rect = element
    ? bounds(element)
    : {
        x: folded ? panelWidth : 0,
        y: 0,
        width: folded ? panelWidth : sheetWidth,
        height: sheetHeight,
      };
  const top = mobile ? 105 : 112;
  const bottom = mobile ? 118 : 115;
  const availableHeight = Math.max(100, stage.clientHeight - top - bottom);
  const scale =
    Math.min(
      (stage.clientWidth - (mobile ? 38 : 160)) / rect.width,
      availableHeight / rect.height,
    ) * (element ? 0.94 : folded ? 0.88 : 0.85);
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  // The root turns around the spread's center. These translations fit a flat
  // target exactly, while the folded cover shares that center naturally.
  return {
    x:
      stage.clientWidth / 2 -
      sheetWidth / 2 +
      scale * (sheetWidth / 2 - centerX),
    y:
      top +
      availableHeight / 2 -
      sheetHeight / 2 +
      scale * (sheetHeight / 2 - centerY),
    scale,
    rotationX: 0,
    rotationY: 0,
    rotation: 0,
  };
}

function collectStops(): Stop[] {
  if (!sheet) return [];
  const result: Stop[] = [
    {
      name: 'Overview',
      element: null,
      panel: 'center',
      arrival: 0,
      position: 0,
    },
  ];
  const elements = Array.from(
    sheet.querySelectorAll<HTMLElement>('[data-camera-stop]'),
  ).sort(
    (a, b) =>
      Number(a.dataset.cameraOrder || 0) - Number(b.dataset.cameraOrder || 0),
  );
  for (const element of elements) {
    const mobileParts = element.querySelectorAll<HTMLElement>(
      '[data-camera-mobile]',
    );
    const targets =
      innerWidth < 760 && mobileParts.length
        ? Array.from(mobileParts)
        : [element];
    for (const target of targets) {
      result.push({
        name: target.dataset.cameraMobile || target.dataset.cameraStop || '',
        element: target,
        panel: panelFor(target),
        arrival: 0,
        position: 0,
      });
    }
  }
  return result;
}

function readingFold(panel: PanelName): Fold {
  return {
    left: panel === 'left' ? 0 : 22,
    right: panel === 'right' ? 0 : -22,
  };
}

function renderCamera() {
  if (!sheet || !camera) return;
  const { x, y, scale, rotationX, rotationY, rotation } = camera;
  // CSSPlugin's scale alias scales X/Y only. The hinge depth must scale with
  // the document too, otherwise a small brochure keeps full-size 3D depth.
  sheet.style.transform = `translate3d(${x}px, ${y}px, 0) rotateZ(${rotation}deg) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale3d(${scale}, ${scale}, ${scale})`;
}

function updateNavigation() {
  if (!timeline) return;
  const time = timeline.time();
  let index = 0;
  for (let i = 1; i < stops.length; i += 1) {
    if (time >= stops[i].arrival - 0.16) index = i;
  }
  if (index !== lastIndex) {
    lastIndex = index;
    nav
      ?.querySelectorAll<HTMLButtonElement>('[data-go-to]')
      .forEach((button) => {
        if (Number(button.dataset.goTo) === index)
          button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    if (current) current.textContent = String(index).padStart(2, '0');
  }
  if (caption) {
    caption.textContent =
      index === 0
        ? time < 0.5
          ? 'Scroll to unfold'
          : 'One proposal. Three connected pages.'
        : stops[index].name;
  }
  root.style.setProperty('--tour-progress', String(timeline.progress()));
}

function rebuildNavigation() {
  if (!nav) return;
  const focusedName = nav.contains(document.activeElement)
    ? document.activeElement?.getAttribute('aria-label')
    : null;
  nav.replaceChildren(
    ...stops.map((stop, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.goTo = String(index);
      button.setAttribute('aria-label', stop.name);
      const label = document.createElement('span');
      label.textContent = stop.name;
      button.append(label);
      return button;
    }),
  );
  if (focusedName) {
    Array.from(nav.querySelectorAll('button'))
      .find((button) => button.getAttribute('aria-label') === focusedName)
      ?.focus({ preventScroll: true });
  }
  if (total) total.textContent = String(stops.length - 1).padStart(2, '0');
  lastIndex = -1;
}

function destroyTour() {
  trigger?.kill();
  timeline?.kill();
  trigger = undefined;
  timeline = undefined;
  camera = undefined;
  if (sheet) {
    gsap.set(sheet, { clearProps: 'transform,transformOrigin' });
    sheet.style.removeProperty('--panel-height');
  }
  panels?.forEach((panel) =>
    gsap.set(panel, { clearProps: 'transform,transformOrigin' }),
  );
  journey?.style.removeProperty('height');
  root.style.removeProperty('--tour-progress');
  root.classList.remove('camera-ready');
}

function buildTour(progress?: number) {
  if (
    !sheet ||
    !stage ||
    !journey ||
    !left ||
    !right ||
    root.dataset.presentation !== 'tour'
  )
    return;
  destroyTour();
  const faceHeights = Array.from(
    sheet.querySelectorAll<HTMLElement>('.panel-face'),
  ).map((face) => face.scrollHeight);
  sheet.style.setProperty(
    '--panel-height',
    `${Math.max(sheet.offsetHeight, ...faceHeights)}px`,
  );
  stops = collectStops();
  rebuildNavigation();
  const closed = {
    ...frameFor(null, true),
    rotationX: 12,
    rotationY: -15,
    rotation: -6,
  };
  const open = frameFor(null);
  root.classList.add('camera-ready');
  camera = { ...closed };
  sheet.style.transformOrigin = '50% 50%';
  renderCamera();
  gsap.set(left, {
    rotationY: 168,
    z: 40,
    transformOrigin: '100% 50%',
    force3D: true,
  });
  gsap.set(right, {
    rotationY: -178,
    z: 1,
    transformOrigin: '0% 50%',
    force3D: true,
  });
  timeline = gsap.timeline({
    paused: true,
    onUpdate: () => {
      renderCamera();
      updateNavigation();
    },
  });
  timeline.addLabel('stop-0', 0);
  // Pull back before opening the wings, so their full movement is visible.
  timeline.to(
    camera,
    {
      ...open,
      scale: open.scale * 0.94,
      rotationX: 9,
      rotationY: -11,
      rotation: -4,
      duration: 0.9,
      ease: 'power2.inOut',
    },
    0.25,
  );
  timeline.to(
    left,
    { rotationY: 78, z: 15, duration: 0.85, ease: 'power2.inOut' },
    0.45,
  );
  timeline.to(
    left,
    { rotationY: 0, z: 0.6, duration: 0.85, ease: 'power2.inOut' },
    1.3,
  );
  timeline.to(
    right,
    { rotationY: -72, z: 0.4, duration: 0.8, ease: 'power2.inOut' },
    1.15,
  );
  timeline.to(
    right,
    { rotationY: 0, duration: 0.75, ease: 'power2.inOut' },
    1.95,
  );
  timeline.to(camera, { ...open, duration: 0.9, ease: 'power2.inOut' }, 1.8);
  let cursor = 3.05;
  let previous = open;
  let previousPanel: PanelName = 'center';
  for (let index = 1; index < stops.length; index += 1) {
    const stop = stops[index];
    const target = frameFor(stop.element);
    const crossing = previousPanel !== stop.panel;
    const direction = target.x >= previous.x ? 1 : -1;
    const transit = {
      x: (previous.x + target.x) / 2,
      y: (previous.y + target.y) / 2,
      scale: Math.min(previous.scale, target.scale) * (crossing ? 0.83 : 0.92),
      rotationX: crossing ? 9 : 4,
      rotationY: direction * (crossing ? 11 : 5),
      rotation: direction * (crossing ? 2.5 : 1),
    };
    const folds = readingFold(stop.panel);
    timeline.to(
      camera,
      { ...transit, duration: travel * 0.43, ease: 'power2.inOut' },
      cursor,
    );
    timeline.to(
      camera,
      { ...target, duration: travel * 0.57, ease: 'power2.inOut' },
      cursor + travel * 0.43,
    );
    timeline.to(
      left,
      {
        rotationY: crossing ? 58 : 34,
        z: 0.6,
        duration: travel * 0.43,
        ease: 'power2.inOut',
      },
      cursor,
    );
    timeline.to(
      right,
      {
        rotationY: crossing ? -52 : -32,
        z: 0.4,
        duration: travel * 0.43,
        ease: 'power2.inOut',
      },
      cursor,
    );
    timeline.to(
      left,
      { rotationY: folds.left, duration: travel * 0.57, ease: 'power2.inOut' },
      cursor + travel * 0.43,
    );
    timeline.to(
      right,
      { rotationY: folds.right, duration: travel * 0.57, ease: 'power2.inOut' },
      cursor + travel * 0.43,
    );
    stop.arrival = cursor + travel;
    stop.position = stop.arrival + hold / 2;
    timeline.addLabel(`stop-${index}`, stop.position);
    cursor = stop.arrival + hold;
    previous = target;
    previousPanel = stop.panel;
  }
  timeline.to({}, { duration: hold }, cursor - hold);
  const scrollDistance = Math.max(620, innerHeight * 0.84) * (stops.length + 2);
  journey.style.height = `${scrollDistance + innerHeight}px`;
  trigger = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    animation: timeline,
    scrub: 0.28,
  });
  trigger.refresh();
  if (progress !== undefined) {
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
      behavior: 'instant',
    });
    trigger.update();
  }
  timeline.progress(progress ?? trigger.progress);
  updateNavigation();
}

function setMode(read: boolean, persist: boolean, preservePosition = false) {
  const element = stops[Math.max(0, lastIndex)]?.element;
  destroyTour();
  root.dataset.presentation = read ? 'read' : 'tour';
  if (mode) {
    mode.textContent = read ? 'Take the tour' : 'Read normally';
    mode.setAttribute('aria-pressed', String(read));
    mode.disabled = preference.matches;
  }
  if (persist) {
    try {
      localStorage.setItem('proposal-presentation', read ? 'read' : 'tour');
    } catch {
      // Reading and animation remain usable when preference storage is unavailable.
    }
  }
  if (read) {
    if (persist && element)
      element.scrollIntoView({ block: 'start', behavior: 'instant' });
    else if (!preservePosition)
      window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    if (!preservePosition) window.scrollTo({ top: 0, behavior: 'instant' });
    buildTour();
  }
}

if (sheet && mode) {
  await document.fonts.ready;
  mode.hidden = false;
  const read =
    preference.matches ||
    root.dataset.presentation === 'read' ||
    !left ||
    !right;
  setMode(read, false, true);
  mode.addEventListener('click', () =>
    setMode(root.dataset.presentation !== 'read', true),
  );
  preference.addEventListener('change', () => {
    let savedRead = false;
    try {
      savedRead = localStorage.getItem('proposal-presentation') === 'read';
    } catch {
      savedRead = true;
    }
    setMode(preference.matches || savedRead, false);
  });
  nav?.addEventListener('click', (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('button[data-go-to]')
        : null;
    if (!target || !trigger || !timeline) return;
    const stop = stops[Number(target.dataset.goTo)];
    if (!stop) return;
    const position =
      trigger.start +
      (trigger.end - trigger.start) * (stop.position / timeline.duration());
    window.scrollTo({ top: position, behavior: 'smooth' });
  });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => buildTour(trigger?.progress), 180);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && root.dataset.presentation === 'tour')
      buildTour(trigger?.progress);
  });
  document
    .querySelector('.skip-link')
    ?.addEventListener('click', () => setMode(true, false));
  sheet.addEventListener('focusin', (event) => {
    const target = event.target;
    if (
      root.dataset.presentation === 'tour' &&
      target instanceof HTMLElement &&
      target.matches(':focus-visible')
    ) {
      setMode(true, false);
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  });
}
