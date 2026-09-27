import gsap from 'gsap';
import { mountPaper } from './paper-layout';
import {
  createPath,
  damp,
  foldPoint,
  settleAnchor,
  sceneAt,
  hingeTravel,
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
  const header = document.querySelector<HTMLElement>('.site-header');
  const controls = document.querySelector<HTMLElement>('.tour-controls');
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
  let openingAnchors: number[] = [];
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
  let restorePaper: (() => void) | undefined;
  let userDirection = 0;
  let inputScrollY = window.scrollY;
  let writtenScrollY: number | undefined;
  let navigationElement: HTMLElement | null = null;
  let readingResumeElement: HTMLElement | null = null;
  let readingInput = false;

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
    const mobilePrintScale = stop.element?.matches('.flyer-cover')
      ? 0.65
      : 0.43;
    const center = foldPoint(
      { x: box.x + box.width / 2, y: box.y + box.height / 2, z: 1 },
      stop.panel,
      panelWidth,
      fold,
    );
    const pose: Pose = {
      focusX: center.x,
      focusY: center.y,
      focusZ: center.z,
      scale:
        width < 760
          ? Math.min(
              (width * 0.76) / box.width,
              (availableHeight * 0.86) / box.height,
              mobilePrintScale / (panelWidth / 1200),
            )
          : Math.min(
              Math.min(
                (width - 160) / box.width,
                availableHeight / box.height,
              ) * 0.92,
              0.66 / (panelWidth / 1200),
            ),
      left: fold,
      right: fold,
      pitch: 0,
      yaw: stop.panel === 'center' ? 0 : -fold,
      roll: 0,
    };
    if (stop.element?.dataset.cameraAlign === 'start') {
      const drawnHeight = box.height * pose.scale;
      const inset = Math.min(
        width < 760 ? 8 : 24,
        (availableHeight - drawnHeight) / 2,
      );
      const desiredCenter =
        cameraY - availableHeight / 2 + inset + drawnHeight / 2;
      pose.focusY += (cameraY - desiredCenter) / pose.scale;
    }
    return pose;
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
        const radiusX = (maxX - minX) * 0.55;
        const radiusY = (maxY - minY) * 0.52;
        // Edge-on projections should diffuse into the ground, not form thin
        // vertical streaks. Smooth weighting avoids a visible threshold.
        const elongation = Math.max(
          0,
          Math.min(1, (radiusY / Math.max(radiusX, 1) - 3) / 4),
        );
        const diffusion = elongation * elongation * (3 - 2 * elongation);
        pad.setAttribute('cx', String((minX + maxX) / 2));
        pad.setAttribute('cy', String((minY + maxY) / 2 + 12));
        pad.setAttribute('rx', String(radiusX + radiusY * 0.075 * diffusion));
        pad.setAttribute('ry', String(radiusY * (1 - 0.35 * diffusion)));
        pad.setAttribute('opacity', String(1 - 0.45 * diffusion));
      });
      shadow.style.opacity = String(Math.max(0.025, 0.13 - pose.scale * 0.05));
    }
    const { index, caption: label } = sceneAt(
      stops,
      time,
      readingRadius,
      lastIndex,
    );
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
    navigationElement = null;
    clearTimeout(settleTimer);
    scrollTween?.kill();
    scrollTween = undefined;
  }

  function writeScroll(top: number) {
    window.scrollTo({ top, behavior: 'instant' });
    writtenScrollY = window.scrollY;
    inputScrollY = window.scrollY;
  }

  function scrollToPosition(progress: number) {
    if (!path) return;
    cancelAutomaticScroll();
    userDirection = 0;
    const state = { y: window.scrollY };
    const destination = offset + progress * range;
    scrollTween = gsap.to(state, {
      y: destination,
      duration: Math.min(0.8, 0.36 + Math.abs(destination - state.y) / 7000),
      ease: 'power2.inOut',
      onUpdate: () => writeScroll(state.y),
      onComplete: () => {
        scrollTween = undefined;
      },
    });
  }

  function settle() {
    if (!path || scrollTween || touchActive || resizePending) return;
    const time = target * path.duration;
    const anchors = [
      ...openingAnchors,
      ...stops.slice(1).map((stop) => stop.at),
    ];
    const destination = settleAnchor(
      anchors,
      time,
      userDirection,
      readingRadius,
    );
    if (destination !== null) scrollToPosition(destination / path.duration);
  }

  function handleScroll() {
    if (root.dataset.presentation === 'read') {
      if (readingInput) {
        readingResumeElement = readingElement(false);
        releaseReadingInputAfterIdle();
      }
      return;
    }
    if (!path) return;
    lastScrollAt = performance.now();
    const scrollY = window.scrollY;
    const appOwned =
      scrollTween ||
      (writtenScrollY !== undefined && Math.abs(scrollY - writtenScrollY) <= 1);
    if (!appOwned) {
      navigationElement = null;
      const distance = scrollY - inputScrollY;
      // Ignore subpixel/jitter changes; deliberate native travel owns settling.
      if (Math.abs(distance) >= 3) {
        userDirection = Math.sign(distance);
        inputScrollY = scrollY;
      }
    }
    writtenScrollY = undefined;
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

  function buildTour(preserve = false, preserveScroll = false) {
    if (root.dataset.presentation !== 'tour') return;
    const oldTime = path ? target * path.duration : 0;
    const oldStop = stops[Math.max(0, lastIndex)];
    const oldFraction = oldStop ? oldTime - oldStop.at : 0;
    const previousProgress = target;
    const previousScroll = window.scrollY;
    const previousRange = range;
    destroyTour();
    width = stage.clientWidth;
    height = innerHeight;
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
    const top =
      width < 760 ? (header?.getBoundingClientRect().bottom ?? 80) + 24 : 112;
    const bottom =
      width < 760
        ? (controls?.getBoundingClientRect().height ?? 116) + 24
        : 115;
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
    const beginning = readingPose(stops[1]);
    const beginningBox = boxFor(stops[1].element!);
    const coverCenter = {
      x: beginningBox.x + beginningBox.width / 2,
      y: beginningBox.y + beginningBox.height / 2,
      z: 1,
    };
    const unfoldingFocus = foldPoint(coverCenter, 'left', panelWidth, 58);
    const approachingFocus = foldPoint(coverCenter, 'left', panelWidth, 46);
    const frames: Keyframe[] = [
      // An open accordion silhouette establishes all three printed panels and
      // both creases before the camera approaches the first reading group.
      { at: 0, pose: overview(74, -32, 16, -4) },
      {
        at: 0.85,
        pose: {
          ...beginning,
          focusX: unfoldingFocus.x,
          focusY: unfoldingFocus.y,
          focusZ: unfoldingFocus.z,
          scale: beginning.scale * 0.62,
          left: 58,
          right: 58,
          yaw: -64,
          pitch: 14,
          roll: -3,
        },
      },
      {
        at: 1.55,
        pose: {
          ...beginning,
          focusX: approachingFocus.x,
          focusY: approachingFocus.y,
          focusZ: approachingFocus.z,
          scale: beginning.scale * 0.82,
          left: 46,
          right: 46,
          yaw: -46,
          pitch: 5,
          roll: -2,
        },
      },
    ];
    openingAnchors = [0, 0.85];
    let previousPose = frames[2].pose;
    let previousPanel: Panel | null = null;
    let cursor = 2.65;
    for (let i = 1; i < stops.length; i += 1) {
      const stop = stops[i];
      const pose = readingPose(stop);
      const enteringCash =
        stop.element?.closest('.flyer-cash') && previousPanel === 'left';
      if (previousPanel && previousPanel !== stop.panel) {
        const bridges = hingeTravel(
          previousPose,
          pose,
          previousPanel,
          stop.panel,
          panelWidth,
        );
        const departure = stops[i - 1].at + readingRadius;
        const travel = cursor - readingRadius - departure;
        bridges.forEach((bridge, index) => {
          frames.push({
            at: departure + (travel * (index + 1)) / (bridges.length + 1),
            pose: bridge,
          });
        });
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
      cursor +=
        i === 1
          ? width < 760
            ? 2.3
            : 2.95
          : enteringCash && width < 760
            ? 2.2
            : 1.7;
    }
    path = createPath(frames);
    range = preserveScroll
      ? previousRange
      : Math.max(540, height * 0.74) * (stops.length + 1);
    journey.style.height = `${range + innerHeight}px`;
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
      writeScroll(preserveScroll ? previousScroll : offset + range * target);
    } else target = Math.max(0, Math.min(1, (window.scrollY - offset) / range));
    visual = target;
    velocity = 0;
    root.classList.add('camera-ready');
    render();
  }

  function readingElement(preferFocus = true): HTMLElement | null {
    const focused = document.activeElement?.closest<HTMLElement>(
      '[data-camera-mobile], [data-camera-stop]',
    );
    if (preferFocus && focused && sheet.contains(focused)) return focused;
    const elements = [
      ...sheet.querySelectorAll<HTMLElement>('[data-camera-mobile]'),
      ...sheet.querySelectorAll<HTMLElement>('[data-camera-stop]'),
    ];
    // Scroll offsets round to device pixels while layout retains fractions;
    // a section aligned to the reading line must not select the one above it.
    const readingTop =
      Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 25;
    const containing = elements.find((element) => {
      const box = element.getBoundingClientRect();
      return box.top <= readingTop && box.bottom > readingTop;
    });
    if (containing) return containing;
    return elements.reduce<HTMLElement | null>(
      (nearest, element) =>
        !nearest ||
        Math.abs(element.getBoundingClientRect().top - readingTop) <
          Math.abs(nearest.getBoundingClientRect().top - readingTop)
          ? element
          : nearest,
      null,
    );
  }

  function setMode(read: boolean, persist: boolean, preservePosition = false) {
    const wasRead = root.dataset.presentation === 'read';
    const element = wasRead
      ? (readingResumeElement ?? readingElement())
      : (navigationElement ?? stops[Math.max(0, lastIndex)]?.element);
    // Returning to the mode control can scroll the ordinary document. Keep the
    // reading idea until an actual reading gesture selects another position.
    readingInput = false;
    destroyTour();
    userDirection = 0;
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
      readingResumeElement = element ?? null;
      restorePaper?.();
      restorePaper = undefined;
      if (!preservePosition && element)
        element.scrollIntoView({ block: 'start', behavior: 'instant' });
      else if (!preservePosition) writeScroll(0);
    } else {
      restorePaper ??= mountPaper(sheet);
      if (!preservePosition) writeScroll(0);
      buildTour();
      if (!preservePosition && wasRead && element && path) {
        const section = element.closest('[data-camera-stop]');
        const stop =
          stops.find((candidate) => candidate.element === element) ??
          stops.find(
            (candidate) =>
              candidate.element?.closest('[data-camera-stop]') === section,
          );
        if (stop) {
          target = visual = stop.at / path.duration;
          writeScroll(offset + range * target);
          render();
        }
      }
    }
  }

  mode.hidden = false;
  setMode(
    preference.matches || root.dataset.presentation === 'read',
    false,
    true,
  );
  function restoreHistoryPosition() {
    const state: unknown = history.state;
    if (!state || typeof state !== 'object' || !('handrailPosition' in state))
      return;
    const saved = state.handrailPosition;
    if (
      !saved ||
      typeof saved !== 'object' ||
      !('mode' in saved) ||
      !('progress' in saved) ||
      !('scrollY' in saved) ||
      (saved.mode !== 'read' && saved.mode !== 'tour') ||
      typeof saved.progress !== 'number' ||
      !Number.isFinite(saved.progress) ||
      typeof saved.scrollY !== 'number' ||
      !Number.isFinite(saved.scrollY)
    )
      return;
    const forceReading =
      preference.matches ||
      new URLSearchParams(location.search).get('view') === 'read';
    if (forceReading && saved.mode === 'tour') return;
    // The camera's scroll range exists only after mounting. Native history
    // restoration can run earlier and clamp the saved tour position to zero.
    history.scrollRestoration = 'manual';
    setMode(saved.mode === 'read', false, true);
    if (saved.mode === 'tour' && path) {
      target = visual = Math.max(0, Math.min(1, saved.progress));
      velocity = 0;
      writeScroll(offset + range * target);
      render();
    } else writeScroll(Math.max(0, saved.scrollY));
  }
  window.addEventListener('pagehide', () => {
    try {
      history.replaceState(
        {
          ...history.state,
          handrailPosition: {
            mode: root.dataset.presentation,
            progress: Math.max(
              0,
              Math.min(1, (window.scrollY - offset) / range),
            ),
            scrollY: window.scrollY,
          },
        },
        '',
      );
    } catch {
      // Native restoration remains available when history storage is blocked.
    }
  });
  const navigation = performance.getEntriesByType('navigation')[0];
  if (
    navigation instanceof PerformanceNavigationTiming &&
    navigation.type === 'back_forward'
  )
    restoreHistoryPosition();
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
    if (stop && path) {
      scrollToPosition(stop.at / path.duration);
      navigationElement = stop.element;
    }
  });
  window.addEventListener('scroll', handleScroll, { passive: true });
  function releaseReadingInputAfterIdle() {
    clearTimeout(settleTimer);
    // A held finger still owns the gesture. After release, momentum scroll
    // refreshes this timeout until the ordinary document stops moving.
    if (readingInput && !touchActive)
      settleTimer = setTimeout(() => {
        readingInput = false;
      }, 180);
  }
  function handleUserInput() {
    cancelAutomaticScroll();
    readingInput = root.dataset.presentation === 'read';
    releaseReadingInputAfterIdle();
  }
  window.addEventListener('wheel', handleUserInput, { passive: true });
  window.addEventListener(
    'touchstart',
    () => {
      touchActive = true;
      handleUserInput();
    },
    { passive: true },
  );
  const releaseTouch = () => {
    touchActive = false;
    clearTimeout(settleTimer);
    if (root.dataset.presentation === 'read') releaseReadingInputAfterIdle();
    else settleTimer = setTimeout(settle, 650);
  };
  window.addEventListener('touchend', releaseTouch, { passive: true });
  window.addEventListener('touchcancel', releaseTouch, { passive: true });
  window.addEventListener('keydown', (event) => {
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
      handleUserInput();
  });
  window.addEventListener('resize', () => {
    const widthChanged = Math.abs(innerWidth - lastWidth) > 2;
    const heightChanged = Math.abs(innerHeight - lastHeight) > 2;
    if (!widthChanged && !heightChanged) return;
    resizePending = true;
    clearTimeout(resizeTimer);
    const apply = () => {
      if (touchActive || performance.now() - lastScrollAt < 180) {
        resizeTimer = setTimeout(apply, 180);
        return;
      }
      resizePending = false;
      buildTour(true, !widthChanged && innerWidth < 760);
    };
    resizeTimer = setTimeout(apply, 180);
  });
  matchMedia('(min-resolution: 2dppx)').addEventListener('change', () => {
    buildTour(true);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) restoreHistoryPosition();
  });
  document
    .querySelector('.skip-link')
    ?.addEventListener('click', () => setMode(true, false));
  sheet.addEventListener('focusin', (event) => {
    if (
      root.dataset.presentation === 'read' &&
      event.target instanceof HTMLElement
    ) {
      readingResumeElement = event.target.closest<HTMLElement>(
        '[data-camera-mobile], [data-camera-stop]',
      );
    }
    if (
      root.dataset.presentation === 'tour' &&
      event.target instanceof HTMLElement &&
      event.target.matches(':focus-visible')
    ) {
      const target = event.target;
      setMode(true, false);
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  });
}

if (sheet && stage && journey && mode) {
  await document.fonts.ready;
  mountTour(sheet, stage, journey, mode);
}
