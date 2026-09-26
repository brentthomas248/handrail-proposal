import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Frame {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}
interface Stop {
  name: string;
  element: HTMLElement | null;
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
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let timeline: gsap.core.Timeline | undefined;
let trigger: ScrollTrigger | undefined;
let stops: Stop[] = [];
let frames: Frame[] = [];
let resizeTimer: ReturnType<typeof setTimeout>;
const segment = 1.8;
const hold = 0.65;
let lastIndex = -1;

function bounds(element: HTMLElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  let x = 0,
    y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== sheet) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

function frameFor(element: HTMLElement | null): Frame {
  if (!sheet || !stage) return { x: 0, y: 0, scale: 1, rotation: 0 };
  const mobile = innerWidth < 760;
  const rect = element
    ? bounds(element)
    : {
        x: 0,
        y: 0,
        width: sheet.offsetWidth,
        height: mobile ? 1120 : sheet.offsetHeight,
      };
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const top = mobile ? 105 : 112;
  const bottom = mobile ? 118 : 115;
  const availableHeight = height - top - bottom;
  let scale = Math.min(
    (width - (mobile ? 38 : 180)) / rect.width,
    availableHeight / rect.height,
  );
  let rotation = 0;
  if (!element) {
    scale *= mobile ? 0.96 : 0.91;
    rotation = mobile ? -3 : -4;
  } else scale *= mobile ? 0.96 : 0.93;
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const angle = (rotation * Math.PI) / 180;
  return {
    x:
      width / 2 -
      scale * (centerX * Math.cos(angle) - centerY * Math.sin(angle)),
    y:
      top +
      availableHeight / 2 -
      scale * (centerX * Math.sin(angle) + centerY * Math.cos(angle)),
    scale,
    rotation,
  };
}

function collectStops(): Stop[] {
  if (!sheet) return [];
  const result: Stop[] = [{ name: 'Overview', element: null }];
  sheet
    .querySelectorAll<HTMLElement>('[data-camera-stop]')
    .forEach((element) => {
      const mobileParts = element.querySelectorAll<HTMLElement>(
        '[data-camera-mobile]',
      );
      if (innerWidth < 760 && mobileParts.length) {
        mobileParts.forEach((part) =>
          result.push({ name: part.dataset.cameraMobile || '', element: part }),
        );
      } else result.push({ name: element.dataset.cameraStop || '', element });
    });
  return result;
}

function updateNavigation(index: number) {
  if (index === lastIndex) return;
  lastIndex = index;
  nav?.querySelectorAll<HTMLButtonElement>('[data-go-to]').forEach((button) => {
    if (Number(button.dataset.goTo) === index)
      button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  if (caption)
    caption.textContent =
      index === 0
        ? 'Scroll to step inside'
        : index === stops.length - 1
          ? 'A starting point. Let’s talk.'
          : stops[index]?.name || '';
  if (current) current.textContent = String(index).padStart(2, '0');
}

function rebuildNavigation() {
  if (!nav) return;
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
  if (total) total.textContent = String(stops.length - 1).padStart(2, '0');
  lastIndex = -1;
}

function destroyTour() {
  trigger?.kill();
  timeline?.kill();
  trigger = undefined;
  timeline = undefined;
  if (sheet) gsap.set(sheet, { clearProps: 'all' });
  if (journey) journey.style.removeProperty('height');
  root.classList.remove('camera-ready');
}

function buildTour(progress = 0) {
  if (!sheet || !stage || !journey || root.dataset.presentation !== 'tour')
    return;
  destroyTour();
  stops = collectStops();
  frames = stops.map((stop) => frameFor(stop.element));
  rebuildNavigation();
  journey.style.height = `${Math.max(900, innerHeight * 1.22) * (stops.length - 1) + innerHeight}px`;
  root.classList.add('camera-ready');
  gsap.set(sheet, {
    ...frames[0],
    transformOrigin: '0 0',
    xPercent: 0,
    yPercent: 0,
    force3D: true,
  });
  timeline = gsap.timeline({ paused: true });
  frames.forEach((frame, index) => {
    if (!index) return;
    timeline?.to(
      sheet,
      { ...frame, duration: segment - hold, ease: 'power2.inOut' },
      (index - 1) * segment + hold,
    );
  });
  timeline.to({}, { duration: hold });
  trigger = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    animation: timeline,
    scrub: 0.32,
    onUpdate: (self) => {
      const time = self.progress * (segment * (stops.length - 1) + hold);
      const index = Math.min(
        stops.length - 1,
        Math.max(0, Math.round((time - hold / 2) / segment)),
      );
      updateNavigation(index);
      root.style.setProperty('--tour-progress', String(self.progress));
    },
  });
  trigger.refresh();
  timeline.progress(progress);
  if (progress)
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
      behavior: 'instant',
    });
  updateNavigation(
    Math.min(stops.length - 1, Math.round(progress * (stops.length - 1))),
  );
}

function setMode(read: boolean, persist: boolean) {
  const previousIndex = Math.max(0, lastIndex);
  const element = stops[previousIndex]?.element;
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
      /* Persistence is optional. */
    }
  }
  if (read) {
    if (persist && element)
      element.scrollIntoView({ block: 'start', behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
    buildTour();
  }
}

if (sheet && mode) {
  await document.fonts.ready;
  mode.hidden = false;
  const read = preference.matches || root.dataset.presentation === 'read';
  setMode(read, false);
  mode.addEventListener('click', () =>
    setMode(root.dataset.presentation !== 'read', true),
  );
  preference.addEventListener('change', () => {
    let savedRead = false;
    try {
      savedRead = localStorage.getItem('proposal-presentation') === 'read';
    } catch {
      /* Persistence is optional. */
    }
    setMode(preference.matches || savedRead, false);
  });
  nav?.addEventListener('click', (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('button[data-go-to]')
        : null;
    if (!target || !trigger || !timeline) return;
    const index = Number(target.dataset.goTo);
    const duration = timeline.duration();
    const time = index === 0 ? 0 : index * segment + hold * 0.3;
    const position =
      trigger.start +
      (trigger.end - trigger.start) * Math.min(1, time / duration);
    window.scrollTo({ top: position, behavior: 'smooth' });
  });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => buildTour(trigger?.progress || 0), 180);
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
