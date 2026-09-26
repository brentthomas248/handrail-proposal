import gsap from 'gsap';
import {
  createPath,
  damp,
  foldPoint,
  rotatePoint,
  viewPoint,
  type Keyframe,
  type Panel,
  type Point,
  type Pose,
} from './tour-path';

const root = document.documentElement;
const sheet = document.querySelector<HTMLElement>('.proposal-sheet');
const stage = document.querySelector<HTMLElement>('.flyer-stage');
const journey = document.querySelector<HTMLElement>('.flyer-journey');
const mode = document.querySelector<HTMLButtonElement>('#reading-mode');

interface Stop {
  name: string;
  element: HTMLElement | null;
  panel: Panel;
  at: number;
}
interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function mountTour(
  sheet: HTMLElement,
  stage: HTMLElement,
  journey: HTMLElement,
  mode: HTMLButtonElement,
) {
  const left = sheet.querySelector<HTMLElement>('[data-panel="left"]');
  const right = sheet.querySelector<HTMLElement>('[data-panel="right"]');
  if (!left || !right) return;
  const wings = { left, right };
  const panels = [...sheet.querySelectorAll<HTMLElement>('.fold-panel')];
  const shadowPads = [
    ...stage.querySelectorAll<SVGEllipseElement>('.paper-shadow ellipse'),
  ];
  const faces = panels.map((panel) => ({
    front: panel.querySelector<HTMLElement>('.panel-face')!,
    back: panel.querySelector<HTMLElement>('.panel-back')!,
  }));
  const lighting = panels.map(() => new Map<string, string>());
  const shadow = stage.querySelector<SVGSVGElement>('.paper-shadow');
  const nav = document.querySelector<HTMLElement>('.chapter-nav');
  const caption = document.querySelector<HTMLElement>('#tour-caption');
  const current = document.querySelector<HTMLElement>('#current-stop');
  const total = document.querySelector<HTMLElement>('#total-stops');
  const progressMark = document.querySelector<HTMLElement>('.scroll-line');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const perspective = 2400;
  const readingRadius = 0.24;
  let stops: Stop[] = [];
  let path: ReturnType<typeof createPath> | undefined;
  let width = 0;
  let height = 0;
  let panelWidth = 0;
  let paperHeight = 0;
  let cameraY = 0;
  let availableHeight = 0;
  let range = 1;
  let offset = 0;
  let target = 0;
  let visual = 0;
  let velocity = 0;
  let lastIndex = -1;
  let lastCaption = '';
  let lastWidth = 0;
  let lastHeight = 0;
  let ticking = false;
  let previousTick = 0;
  let scrollTween: gsap.core.Tween | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let lastScrollAt = 0;
  let touchActive = false;
  let resizePending = false;
  let corners: Point[][] = [];

  function boxFor(element: HTMLElement): Box {
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

  function panelFor(element: HTMLElement): Panel {
    const panel = element.closest<HTMLElement>('.fold-panel')?.dataset.panel;
    return panel === 'left' || panel === 'right' ? panel : 'center';
  }

  function project(point: Point, pose: Pose) {
    const viewed = viewPoint(point, pose);
    const depth = perspective / (perspective - viewed.z);
    return {
      x: width / 2 + viewed.x * depth,
      y: height / 2 + (cameraY - height / 2 + viewed.y) * depth,
    };
  }

  function foldedCorners(pose: Pose): Point[][] {
    return corners.map((face, index) => {
      const panel: Panel =
        index === 0 ? 'left' : index === 2 ? 'right' : 'center';
      return face.map((point) =>
        foldPoint(
          point,
          panel,
          panelWidth,
          panel === 'center' ? 0 : pose[panel],
        ),
      );
    });
  }

  function overview(
    angle: number,
    yaw: number,
    pitch: number,
    roll: number,
  ): Pose {
    const pose: Pose = {
      focusX: panelWidth * 1.5,
      focusY: paperHeight / 2,
      focusZ: 0,
      scale: 1,
      left: angle,
      right: angle,
      yaw,
      pitch,
      roll,
    };
    const points = foldedCorners(pose).flat();
    const rotated = points.map((point) => viewPoint(point, pose));
    const extentX =
      Math.max(...rotated.map((p) => p.x)) -
      Math.min(...rotated.map((p) => p.x));
    const extentY =
      Math.max(...rotated.map((p) => p.y)) -
      Math.min(...rotated.map((p) => p.y));
    pose.scale =
      Math.min(
        (width - (width < 760 ? 38 : 120)) / extentX,
        availableHeight / extentY,
      ) * 0.8;
    // Account for perspective expansion as well as the orthographic fit.
    for (let i = 0; i < 4; i += 1) {
      const screen = points.map((point) => project(point, pose));
      const safeTop = cameraY - availableHeight / 2;
      const safeBottom = cameraY + availableHeight / 2;
      if (
        screen.every(
          (point) =>
            point.x > 16 &&
            point.x < width - 16 &&
            point.y > safeTop &&
            point.y < safeBottom,
        )
      )
        break;
      pose.scale *= 0.9;
    }
    return pose;
  }

  function readingPose(stop: Stop): Pose {
    const box = boxFor(stop.element!);
    const fold = 38;
    const center = foldPoint(
      { x: box.x + box.width / 2, y: box.y + box.height / 2, z: 1 },
      stop.panel,
      panelWidth,
      fold,
    );
    return {
      focusX: center.x,
      focusY: center.y,
      focusZ: center.z,
      scale:
        Math.min(
          (width - (width < 760 ? 38 : 160)) / box.width,
          availableHeight / box.height,
        ) * 0.92,
      left: fold,
      right: fold,
      pitch: 0,
      yaw: stop.panel === 'center' ? 0 : -fold,
      roll: 0,
    };
  }

  function collectStops(): Stop[] {
    const result: Stop[] = [
      { name: 'Overview', element: null, panel: 'center', at: 0 },
    ];
    const sections = [
      ...sheet.querySelectorAll<HTMLElement>('[data-camera-stop]'),
    ].sort(
      (a, b) => Number(a.dataset.cameraOrder) - Number(b.dataset.cameraOrder),
    );
    for (const section of sections) {
      const parts = [
        ...section.querySelectorAll<HTMLElement>('[data-camera-mobile]'),
      ];
      for (const element of width < 760 && parts.length ? parts : [section])
        result.push({
          name:
            element.dataset.cameraMobile || element.dataset.cameraStop || '',
          element,
          panel: panelFor(element),
          at: 0,
        });
    }
    return result;
  }

  function rebuildNavigation() {
    if (!nav) return;
    const names = stops.map((stop) => stop.name);
    const existing = [
      ...nav.querySelectorAll<HTMLButtonElement>('[data-go-to]'),
    ];
    if (
      existing.length !== names.length ||
      existing.some(
        (button, i) => button.getAttribute('aria-label') !== names[i],
      )
    ) {
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
      if (focusedName)
        [...nav.querySelectorAll('button')]
          .find((button) => button.getAttribute('aria-label') === focusedName)
          ?.focus({ preventScroll: true });
    }
    if (total) total.textContent = String(stops.length - 1).padStart(2, '0');
    lastIndex = -1;
  }

  function render() {
    if (!path) return;
    const time = visual * path.duration;
    const pose = path.sample(time);
    sheet.style.transform = `translate3d(${width / 2}px,${cameraY}px,0) rotateZ(${pose.roll}deg) rotateX(${pose.pitch}deg) rotateY(${pose.yaw}deg) scale3d(${pose.scale},${pose.scale},${pose.scale}) translate3d(${-pose.focusX}px,${-pose.focusY}px,${-pose.focusZ}px)`;
    wings.left.style.transform = `rotateY(${pose.left}deg)`;
    wings.right.style.transform = `rotateY(${pose.right}deg)`;
    for (let i = 0; i < panels.length; i += 1) {
      const angle = i === 0 ? pose.left : i === 2 ? pose.right : 0;
      const theta = (angle * Math.PI) / 180;
      const normal = rotatePoint(
        { x: Math.sin(theta), y: 0, z: Math.cos(theta) },
        pose,
      );
      const incidence = normal.x * -0.38 + normal.y * -0.48 + normal.z * 0.79;
      // Lighting is baked into the paper paint, so avoid invalidating it for
      // imperceptible changes or stationary camera frames.
      const shades: Record<string, number> = {
        '--front-shade': 0.035 + 0.2 * (1 - Math.max(0, incidence)),
        '--back-shade': 0.035 + 0.2 * (1 - Math.max(0, -incidence)),
        '--crease-opacity':
          0.06 +
          0.15 * Math.sin((Math.min(90, Math.abs(angle)) * Math.PI) / 180),
      };
      for (const [property, value] of Object.entries(shades)) {
        const paintedValue = value.toFixed(2);
        if (lighting[i].get(property) !== paintedValue) {
          panels[i].style.setProperty(property, paintedValue);
          lighting[i].set(property, paintedValue);
        }
      }
      // Release the opposite backing texture. Use the actual perspective
      // viewpoint, since a screen-space normal alone can cull too early.
      const panel = i === 0 ? 'left' : i === 2 ? 'right' : 'center';
      const center = viewPoint(
        foldPoint(
          {
            x: (i + 0.5) * panelWidth,
            y: paperHeight / 2,
            z: 0,
          },
          panel,
          panelWidth,
          angle,
        ),
        pose,
      );
      const facing =
        normal.x * -center.x +
        normal.y * (height / 2 - cameraY - center.y) +
        normal.z * (perspective - center.z);
      const frontDisplay = facing < -1 ? 'none' : '';
      const backDisplay = facing > 1 ? 'none' : '';
      if (faces[i].front.style.display !== frontDisplay)
        faces[i].front.style.display = frontDisplay;
      if (faces[i].back.style.display !== backDisplay)
        faces[i].back.style.display = backDisplay;
    }
    if (shadow) {
      const shadowFaces = foldedCorners(pose);
      const backingDepth =
        Math.min(...shadowFaces.flat().map((point) => point.z)) - 60;
      shadowPads.forEach((pad, i) => {
        const points = shadowFaces[i].map((point) => {
          const distance = point.z - backingDepth;
          return project(
            {
              x: point.x + distance * 0.22,
              y: point.y + distance * 0.28,
              z: backingDepth,
            },
            pose,
          );
        });
        const xs = points.map((point) => point.x);
        const ys = points.map((point) => point.y);
        const minX = Math.min(...xs),
          maxX = Math.max(...xs);
        const minY = Math.min(...ys),
          maxY = Math.max(...ys);
        pad.setAttribute('cx', String((minX + maxX) / 2));
        pad.setAttribute('cy', String((minY + maxY) / 2 + 12));
        pad.setAttribute('rx', String((maxX - minX) * 0.67));
        pad.setAttribute('ry', String((maxY - minY) * 0.62));
      });
      shadow.style.opacity = String(Math.max(0.025, 0.2 - pose.scale * 0.08));
    }
    let index = 0;
    for (let i = 1; i < stops.length; i += 1)
      if (time >= stops[i].at - readingRadius - 0.04) index = i;
    if (index !== lastIndex) {
      lastIndex = index;
      nav
        ?.querySelectorAll<HTMLButtonElement>('[data-go-to]')
        .forEach((button) => {
          if (Number(button.dataset.goTo) === index) {
            button.setAttribute('aria-current', 'step');
            if (nav && nav.scrollWidth > nav.clientWidth)
              nav.scrollTo({
                left:
                  nav.scrollLeft +
                  button.getBoundingClientRect().left -
                  nav.getBoundingClientRect().left -
                  (nav.clientWidth - button.offsetWidth) / 2,
                behavior: 'smooth',
              });
          } else button.removeAttribute('aria-current');
        });
      if (current) current.textContent = String(index).padStart(2, '0');
    }
    const label =
      index === 0
        ? time < 0.2
          ? 'Scroll to unfold'
          : 'One proposal. Room to grow.'
        : stops[index].name;
    if (caption && label !== lastCaption) {
      caption.textContent = label;
      lastCaption = label;
    }
    progressMark?.style.setProperty('--tour-progress', String(visual));
  }

  function tick() {
    const now = performance.now();
    const result = damp(visual, target, velocity, (now - previousTick) / 1000);
    previousTick = now;
    visual = result.value;
    velocity = result.velocity;
    if (Math.abs(visual - target) < 0.000015 && Math.abs(velocity) < 0.0003) {
      visual = target;
      velocity = 0;
      gsap.ticker.remove(tick);
      ticking = false;
    }
    render();
  }

  function startTick() {
    if (ticking || !path) return;
    previousTick = performance.now();
    ticking = true;
    gsap.ticker.add(tick);
  }

  function cancelAutomaticScroll() {
    clearTimeout(settleTimer);
    scrollTween?.kill();
    scrollTween = undefined;
  }

  function scrollToPosition(progress: number) {
    if (!path) return;
    cancelAutomaticScroll();
    const state = { y: window.scrollY };
    const destination = offset + progress * range;
    scrollTween = gsap.to(state, {
      y: destination,
      duration: Math.min(0.8, 0.36 + Math.abs(destination - state.y) / 7000),
      ease: 'power2.inOut',
      onUpdate: () => window.scrollTo({ top: state.y, behavior: 'instant' }),
      onComplete: () => {
        scrollTween = undefined;
      },
    });
  }

  function settle() {
    if (!path || scrollTween || touchActive || resizePending) return;
    const time = target * path.duration;
    if (
      stops.some(
        (stop, i) => i > 0 && Math.abs(stop.at - time) <= readingRadius,
      )
    )
      return;
    const anchors = [0, 0.9, 1.8, ...stops.slice(1).map((stop) => stop.at)];
    const nearest = anchors.reduce((best, value) =>
      Math.abs(value - time) < Math.abs(best - time) ? value : best,
    );
    if (Math.abs(nearest - time) > 0.015)
      scrollToPosition(nearest / path.duration);
  }

  function handleScroll() {
    if (!path || root.dataset.presentation !== 'tour') return;
    lastScrollAt = performance.now();
    target = Math.max(0, Math.min(1, (window.scrollY - offset) / range));
    startTick();
    clearTimeout(settleTimer);
    if (!scrollTween) settleTimer = setTimeout(settle, 650);
  }

  function destroyTour() {
    cancelAutomaticScroll();
    gsap.ticker.remove(tick);
    ticking = false;
    path = undefined;
    velocity = 0;
    sheet.style.removeProperty('transform');
    sheet.style.removeProperty('transform-origin');
    sheet.style.removeProperty('--panel-height');
    stage.style.removeProperty('--stage-height');
    panels.forEach((panel, i) => {
      faces[i].front.style.removeProperty('display');
      faces[i].back.style.removeProperty('display');
      lighting[i].clear();
      panel.style.removeProperty('transform');
      for (const property of [
        '--front-shade',
        '--back-shade',
        '--crease-opacity',
      ])
        panel.style.removeProperty(property);
    });
    journey.style.removeProperty('height');
    root.classList.remove('camera-ready');
  }

  function buildTour(preserve = false) {
    if (root.dataset.presentation !== 'tour') return;
    const oldTime = path ? target * path.duration : 0;
    const oldStop = stops[Math.max(0, lastIndex)];
    const oldFraction = oldStop ? oldTime - oldStop.at : 0;
    const previousProgress = target;
    destroyTour();
    width = stage.clientWidth;
    height = Math.min(stage.clientHeight, innerHeight);
    stage.style.setProperty('--stage-height', `${height}px`);
    lastWidth = innerWidth;
    lastHeight = innerHeight;
    panelWidth = wings.left.offsetWidth;
    const faceHeights = [
      ...sheet.querySelectorAll<HTMLElement>('.panel-face'),
    ].map((face) => face.scrollHeight);
    paperHeight = Math.max(sheet.offsetHeight, ...faceHeights);
    sheet.style.setProperty('--panel-height', `${paperHeight}px`);
    sheet.style.transformOrigin = '0 0';
    const top = width < 760 ? 105 : 112;
    const bottom = width < 760 ? 128 : 115;
    availableHeight = Math.max(100, height - top - bottom);
    cameraY = top + availableHeight / 2;
    corners = [0, 1, 2].map((i) => [
      { x: i * panelWidth, y: 0, z: 0 },
      { x: (i + 1) * panelWidth, y: 0, z: 0 },
      { x: (i + 1) * panelWidth, y: paperHeight, z: 0 },
      { x: i * panelWidth, y: paperHeight, z: 0 },
    ]);
    shadow?.setAttribute('viewBox', `0 0 ${width} ${height}`);
    stops = collectStops();
    const frames: Keyframe[] = [
      { at: 0, pose: overview(174, -22, 10, -4) },
      { at: 0.9, pose: overview(88, -42, 18, -3) },
      { at: 1.8, pose: overview(42, -23, 12, -2) },
    ];
    let previousPose = frames[2].pose;
    let previousPanel: Panel | null = null;
    let cursor = 3;
    for (let i = 1; i < stops.length; i += 1) {
      const stop = stops[i];
      const pose = readingPose(stop);
      if (previousPanel && previousPanel !== stop.panel) {
        const orbit = overview(
          70,
          stop.panel === 'center' ? 8 : -44,
          16,
          stop.panel === 'left' ? -3 : 3,
        );
        orbit.focusY = (previousPose.focusY + pose.focusY) / 2;
        frames.push({ at: cursor - 0.8, pose: orbit });
      }
      const drift = Math.min(9, availableHeight * 0.016) / pose.scale;
      frames.push({
        at: cursor - readingRadius,
        pose: { ...pose, focusY: pose.focusY - drift },
      });
      frames.push({ at: cursor, pose });
      frames.push({
        at: cursor + readingRadius,
        pose: { ...pose, focusY: pose.focusY + drift },
      });
      stop.at = cursor;
      previousPose = pose;
      previousPanel = stop.panel;
      cursor += 1.7;
    }
    path = createPath(frames);
    range = Math.max(540, height * 0.74) * (stops.length + 1);
    journey.style.height = `${range + height}px`;
    offset = journey.getBoundingClientRect().top + window.scrollY;
    rebuildNavigation();
    if (preserve) {
      const oldSection = oldStop?.element?.closest('[data-camera-stop]');
      const matching =
        stops.find((stop) => stop.element === oldStop?.element) ??
        stops.find(
          (stop) =>
            oldSection &&
            stop.element?.closest('[data-camera-stop]') === oldSection,
        );
      target = Math.max(
        0,
        Math.min(
          1,
          matching
            ? (matching.at + oldFraction) / path.duration
            : previousProgress,
        ),
      );
      window.scrollTo({ top: offset + range * target, behavior: 'instant' });
    } else target = Math.max(0, Math.min(1, (window.scrollY - offset) / range));
    visual = target;
    velocity = 0;
    root.classList.add('camera-ready');
    render();
  }

  function setMode(read: boolean, persist: boolean, preservePosition = false) {
    const element = stops[Math.max(0, lastIndex)]?.element;
    destroyTour();
    root.dataset.presentation = read ? 'read' : 'tour';
    mode.textContent = read ? 'Take the tour' : 'Read normally';
    mode.setAttribute('aria-pressed', String(read));
    mode.disabled = preference.matches;
    if (persist)
      try {
        localStorage.setItem('proposal-presentation', read ? 'read' : 'tour');
      } catch {
        /* Preference storage is optional. */
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

  mode.hidden = false;
  setMode(
    preference.matches || root.dataset.presentation === 'read',
    false,
    true,
  );
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
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('button[data-go-to]')
        : null;
    const stop = button ? stops[Number(button.dataset.goTo)] : undefined;
    if (stop && path) scrollToPosition(stop.at / path.duration);
  });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('wheel', cancelAutomaticScroll, { passive: true });
  window.addEventListener(
    'touchstart',
    () => {
      touchActive = true;
      cancelAutomaticScroll();
    },
    { passive: true },
  );
  const releaseTouch = () => {
    touchActive = false;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 650);
  };
  window.addEventListener('touchend', releaseTouch, { passive: true });
  window.addEventListener('touchcancel', releaseTouch, { passive: true });
  window.addEventListener('keydown', (event) => {
    // Restore culled paper content before native tab traversal enters it.
    if (
      event.key === 'Tab' &&
      root.dataset.presentation === 'tour' &&
      ((!event.shiftKey && document.activeElement === mode) ||
        (event.shiftKey && document.activeElement === nav?.firstElementChild))
    )
      setMode(true, false);
    if (
      [
        'ArrowDown',
        'ArrowUp',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
      ].includes(event.key)
    )
      cancelAutomaticScroll();
  });
  window.addEventListener('resize', () => {
    const widthChanged = Math.abs(innerWidth - lastWidth) > 2;
    const heightChanged = Math.abs(innerHeight - lastHeight) > 2;
    if (!widthChanged && (!heightChanged || innerWidth < 760)) return;
    resizePending = true;
    clearTimeout(resizeTimer);
    const apply = () => {
      if (touchActive || performance.now() - lastScrollAt < 180) {
        resizeTimer = setTimeout(apply, 180);
        return;
      }
      resizePending = false;
      buildTour(true);
    };
    resizeTimer = setTimeout(apply, 180);
  });
  matchMedia('(min-resolution: 2dppx)').addEventListener('change', () => {
    buildTour(true);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && root.dataset.presentation === 'tour')
      buildTour(true);
  });
  document
    .querySelector('.skip-link')
    ?.addEventListener('click', () => setMode(true, false));
  sheet.addEventListener('focusin', (event) => {
    if (
      root.dataset.presentation === 'tour' &&
      event.target instanceof HTMLElement &&
      event.target.matches(':focus-visible')
    ) {
      const target = event.target;
      setMode(true, false);
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  });
}

if (sheet && stage && journey && mode) {
  await document.fonts.ready;
  mountTour(sheet, stage, journey, mode);
}
