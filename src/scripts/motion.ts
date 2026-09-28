import gsap from 'gsap';
import { mountPaper } from './paper-layout';
import { watchTypography } from './typography-guard';
import {
  createPath,
  damp,
  foldPoint,
  settleAnchor,
  adjacentAnchor,
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
    ...stage.querySelectorAll<HTMLElement>('.paper-shadow > i'),
  ];
  const faces = panels.map((panel) => ({
    front: panel.querySelector<HTMLElement>('.panel-face')!,
    back: panel.querySelector<HTMLElement>('.panel-back')!,
  }));
  const lights = faces.map(({ front, back }) => ({
    front: front.querySelector<HTMLElement>('.paper-light')!,
    back: back.querySelector<HTMLElement>('.paper-light')!,
  }));
  const creases = faces.map(({ front, back }) =>
    [front, back].flatMap((face) =>
      [...face.querySelectorAll<HTMLElement>('.paper-crease')].map(
        (element) => ({
          element,
          back: face === back,
          side: element.dataset.crease,
        }),
      ),
    ),
  );
  const shadow = stage.querySelector<HTMLElement>('.paper-shadow');
  const nav = document.querySelector<HTMLElement>('.chapter-nav');
  const caption = document.querySelector<HTMLElement>('#tour-caption');
  const current = document.querySelector<HTMLElement>('#current-stop');
  const total = document.querySelector<HTMLElement>('#total-stops');
  const progressMark = document.querySelector<HTMLElement>('.scroll-line');
  const header = document.querySelector<HTMLElement>('.site-header');
  const controls = document.querySelector<HTMLElement>('.tour-controls');
  const modeExplanation = document.querySelector<HTMLElement>(
    '#reading-explanation',
  );
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const perspective = 2400;
  const readingRadius = 0.24;
  const magnetDelay = 35;
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
  let magneticFlight = false;
  let wheelDirection = 0;
  let lastWheelAt = -Infinity;
  let nativeWheelUntil = 0;
  let touchGesture:
    { x: number; y: number; lastY: number; direction: number } | undefined;
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
  let chapterNavNeedsReconcile = false;
  let readingResumeElement: HTMLElement | null = null;
  let readingInput = false;
  let typographyBlocked = false;
  const typography = watchTypography(sheet, (compatible) => {
    typographyBlocked = !compatible;
    if (typographyBlocked && root.dataset.presentation === 'tour')
      setMode(true, false);
    else updateModeControl();
  });

  function boxFor(element: HTMLElement): Box {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = element;
    while (node && node !== sheet) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    // Compact display leading can put glyph line boxes outside the section's
    // border box. Fit that ink during layout, never on the animation ticker.
    const rect = element.getBoundingClientRect();
    const measuredScale = rect.width / element.offsetWidth || 1;
    let top = 0;
    let bottom = element.offsetHeight;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let text: Node | null;
    while ((text = walker.nextNode())) {
      if (!text.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const line of range.getClientRects()) {
        if (!line.width || !line.height) continue;
        top = Math.min(top, (line.top - rect.top) / measuredScale);
        bottom = Math.max(bottom, (line.bottom - rect.top) / measuredScale);
      }
    }
    return {
      x,
      y: y + top - 1,
      width: element.offsetWidth,
      height: bottom - top + 2,
    };
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
      ) * (width < height ? 0.92 : 0.8);
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
      : stop.element?.dataset.cameraMobile
        ? 0.5
        : 0.43;
    const center = foldPoint(
      { x: box.x + box.width / 2, y: box.y + box.height / 2, z: 0 },
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
              (availableHeight *
                (stop.element?.id === 'cash-flow'
                  ? 1
                  : stop.element?.dataset.cameraMobile
                    ? 0.94
                    : 0.86)) /
                box.height,
              mobilePrintScale / (panelWidth / 1200),
            )
          : Math.min(
              Math.min(
                (width - (width < 1000 ? 112 : 160)) / box.width,
                (availableHeight *
                  (stop.element?.matches('.flyer-cash') ? 1.02 : 1)) /
                  box.height,
              ) * 0.92,
              (stop.element?.matches('.flyer-cover')
                ? 0.84
                : stop.element?.matches('.flyer-cash')
                  ? 0.8
                  : 0.66) /
                (panelWidth / 1200),
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
        stop.element.id === 'window' ? 60 : width < 760 ? 8 : 24,
        (availableHeight - drawnHeight) / 2,
      );
      const desiredCenter =
        cameraY - availableHeight / 2 + inset + drawnHeight / 2;
      pose.focusY += (cameraY - desiredCenter) / pose.scale;
    }
    if (width < 760 && stop.element?.dataset.cameraMobile) {
      const down = Math.max(
        0,
        Math.min(40, (availableHeight - box.height * pose.scale) / 2 - 24),
      );
      pose.focusY -= down / pose.scale;
      const displacement =
        (width *
          (stop.element.dataset.cameraMobile === 'Hire first' ? 0.06 : -0.06)) /
        pose.scale;
      const angle = (fold * Math.PI) / 180;
      pose.focusX -= displacement * Math.cos(angle);
      pose.focusZ += displacement * Math.sin(angle);
    }
    if (width < 760 && stop.element?.matches('.flyer-cover')) {
      const paperTop = project(
        foldPoint(
          { x: box.x + box.width / 2, y: 0, z: 0 },
          stop.panel,
          panelWidth,
          fold,
        ),
        pose,
      ).y;
      const safePaperTop = cameraY - availableHeight / 2 - 16;
      const roomBelow = (availableHeight - box.height * pose.scale) / 2;
      const down = Math.max(0, Math.min(safePaperTop - paperTop, roomBelow));
      pose.focusY -= down / pose.scale;
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
      // Reuse tiny lighting textures instead of repainting the printed faces.
      // Their intrinsic 16px size stays independent of the paper's dimensions.
      lights[i].front.style.opacity = (
        0.035 +
        0.24 * (1 - Math.max(0, incidence))
      ).toFixed(4);
      lights[i].back.style.opacity = (
        0.035 +
        0.24 * (1 - Math.max(0, -incidence))
      ).toFixed(4);
      for (const { element, side, back } of creases[i]) {
        const leftHinge =
          i === 0 || (i === 1 && (back ? side === 'right' : side === 'left'));
        const hinge = leftHinge ? pose.left : pose.right;
        const concave = hinge >= 0 ? leftHinge !== back : leftHinge === back;
        element.style.opacity = (
          0.06 +
          (concave ? 0.42 : 0.18) *
            Math.sin((Math.min(150, Math.abs(hinge)) * Math.PI) / 360)
        ).toFixed(4);
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
      // Keep printed layout intact when a face turns into view. Hidden faces
      // release their painted backing without rebuilding the text mid-unfold.
      const frontVisibility = facing < 0 ? 'hidden' : '';
      const backVisibility = facing >= 0 ? 'hidden' : '';
      if (faces[i].front.style.visibility !== frontVisibility)
        faces[i].front.style.visibility = frontVisibility;
      if (faces[i].back.style.visibility !== backVisibility)
        faces[i].back.style.visibility = backVisibility;
    }
    if (shadow) {
      const shadowFaces = foldedCorners(pose);
      shadowPads.forEach((pad, i) => {
        // Lighting is fixed in the camera's space. Project the caster first so
        // a folded wing cannot cast a detached footprint as the camera turns.
        const points = shadowFaces[i].map((point) => project(point, pose));
        const xs = points.map((point) => point.x);
        const ys = points.map((point) => point.y);
        const minX = Math.min(...xs),
          maxX = Math.max(...xs);
        const minY = Math.min(...ys),
          maxY = Math.max(...ys);
        const radiusX = (maxX - minX) * 0.72;
        const radiusY = (maxY - minY) * 0.66;
        // Edge-on projections should diffuse into the ground, not form thin
        // vertical streaks. Smooth weighting avoids a visible threshold.
        const elongation = Math.max(
          0,
          Math.min(1, (radiusY / Math.max(radiusX, 1) - 3) / 4),
        );
        const diffusion = elongation * elongation * (3 - 2 * elongation);
        const rx = radiusX + radiusY * 0.075 * diffusion;
        const ry = radiusY * (1 - 0.35 * diffusion);
        pad.style.transform = `translate3d(${(minX + maxX) / 2 + 12 - rx}px,${(minY + maxY) / 2 + 22 - ry}px,0) scale(${rx / 16},${ry / 16})`;
        pad.style.opacity = String(1 - 0.45 * diffusion);
      });
    }
    const { index, caption: sceneLabel } = sceneAt(
      stops,
      time,
      readingRadius,
      lastIndex,
    );
    const label =
      Math.abs(time - openingAnchors[1]) <= path.duration / range
        ? 'The full proposal'
        : sceneLabel;
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
    chapterNavNeedsReconcile = false;
    clearTimeout(settleTimer);
    scrollTween?.kill();
    scrollTween = undefined;
    magneticFlight = false;
  }

  function writeScroll(top: number) {
    window.scrollTo({ top, behavior: 'instant' });
    writtenScrollY = window.scrollY;
    inputScrollY = window.scrollY;
  }

  function scrollToPosition(
    progress: number,
    chapterDistance = 0,
    magnetic = false,
  ) {
    if (!path) return;
    cancelAutomaticScroll();
    if (!magnetic) {
      wheelDirection = 0;
      lastWheelAt = -Infinity;
    }
    const state = { y: magnetic ? offset + visual * range : window.scrollY };
    const destination = Math.round(offset + progress * range);
    const travel = Math.abs(progress - visual) * path.duration;
    const unfolding =
      Math.max(progress, visual) * path.duration <=
      openingAnchors[1] + path.duration / range;
    const closing =
      stops.at(-1)?.element?.dataset.printFace === 'back' &&
      Math.max(progress, visual) * path.duration >
        (stops.at(-2)?.at ?? Infinity) + readingRadius;
    userDirection = Math.sign(destination - state.y);
    magneticFlight = magnetic;
    if (magnetic) {
      gsap.ticker.remove(tick);
      ticking = false;
      velocity = 0;
    }
    scrollTween = gsap.to(state, {
      y: destination,
      duration: closing
        ? Math.min(
            chapterDistance > 1 ? 3.2 : 2.8,
            Math.max(1.1, travel * 0.56),
          )
        : magnetic
          ? Math.min(
              unfolding ? 1.7 : 2,
              Math.max(unfolding ? 0.6 : 1.1, travel * (unfolding ? 1 : 0.65)),
            )
          : Math.min(
              chapterDistance > 1
                ? Math.min(3.2, 0.55 + chapterDistance * 0.55)
                : 1.55,
              Math.max(0.5, Math.abs(progress - visual) * path.duration * 0.44),
            ),
      // Immediate input ownership is separate from camera speed. Ease into
      // the unfold instead of spending most of its travel on the first frames.
      ease: 'sine.inOut',
      onUpdate: () => {
        writeScroll(state.y);
        if (magnetic) {
          // Keep the camera continuous even when native scroll rounds to a
          // device pixel. Native position mirrors the flight for restoration.
          target = visual = Math.max(
            0,
            Math.min(1, (state.y - offset) / range),
          );
          render();
        }
      },
      onComplete: () => {
        scrollTween = undefined;
        magneticFlight = false;
        userDirection = 0;
        reconcileChapterNavigation();
      },
    });
  }

  function concreteAnchors() {
    const duration = path?.duration ?? 1;
    return [...openingAnchors, ...stops.slice(1).map((stop) => stop.at)].map(
      (time) => Math.round(offset + (time / duration) * range),
    );
  }

  function commitGesture(direction: number) {
    if (!path || root.dataset.presentation !== 'tour') return;
    const destination = adjacentAnchor(
      concreteAnchors(),
      offset + visual * range,
      direction,
    );
    if (destination === null) return;
    scrollToPosition((destination - offset) / range, 0, true);
    // The active scene can stay unchanged while an interrupted shortcut has
    // already scrolled the strip to its former destination.
    chapterNavNeedsReconcile = true;
  }

  function scheduleSettle() {
    clearTimeout(settleTimer);
    if (root.dataset.presentation === 'tour' && !scrollTween && !touchActive)
      settleTimer = setTimeout(settle, magnetDelay);
  }

  function reconcileChapterNavigation() {
    if (chapterNavNeedsReconcile && nav) {
      chapterNavNeedsReconcile = false;
      const button = nav.querySelector<HTMLButtonElement>('[aria-current]');
      if (button && !nav.querySelector(':focus-visible')) {
        const current = button.getBoundingClientRect();
        const bounds = nav.getBoundingClientRect();
        if (current.left < bounds.left || current.right > bounds.right)
          nav.scrollTo({
            left:
              nav.scrollLeft +
              current.left -
              bounds.left -
              (nav.clientWidth - button.offsetWidth) / 2,
            behavior: 'smooth',
          });
      }
    }
  }

  function settle() {
    if (!path || scrollTween || touchActive || resizePending) return;
    reconcileChapterNavigation();
    const destination = settleAnchor(
      concreteAnchors(),
      window.scrollY,
      userDirection,
    );
    if (destination !== null)
      scrollToPosition((destination - offset) / range, 0, true);
    else userDirection = 0;
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
      (writtenScrollY !== undefined &&
        Math.abs(scrollY - writtenScrollY) <= 0.5);
    if (!appOwned) {
      navigationElement = null;
      const distance = scrollY - inputScrollY;
      if (Math.abs(distance) >= 0.5) {
        chapterNavNeedsReconcile = true;
        userDirection =
          performance.now() < nativeWheelUntil ? 0 : Math.sign(distance);
        inputScrollY = scrollY;
      }
    }
    writtenScrollY = undefined;
    if (!magneticFlight) {
      target = Math.max(0, Math.min(1, (window.scrollY - offset) / range));
      startTick();
    }
    scheduleSettle();
  }

  function destroyTour() {
    cancelAutomaticScroll();
    wheelDirection = 0;
    lastWheelAt = -Infinity;
    touchGesture = undefined;
    gsap.ticker.remove(tick);
    ticking = false;
    path = undefined;
    velocity = 0;
    sheet.style.removeProperty('transform');
    sheet.style.removeProperty('transform-origin');
    sheet.style.removeProperty('--panel-height');
    stage.style.removeProperty('--stage-height');
    panels.forEach((panel, i) => {
      for (const face of [faces[i].front, faces[i].back])
        face.style.removeProperty('visibility');
      panel.style.removeProperty('transform');
    });
    journey.style.removeProperty('height');
    root.classList.remove('camera-ready');
  }

  function buildTour(preserve = false, preserveScroll = false) {
    if (root.dataset.presentation !== 'tour') return;
    if (!typography.check()) {
      typographyBlocked = true;
      setMode(true, false);
      return;
    }
    const oldTime = path ? target * path.duration : 0;
    const oldStop = stops[Math.max(0, lastIndex)];
    const oldFraction = oldStop ? oldTime - oldStop.at : 0;
    const previousProgress = target;
    const previousScroll = window.scrollY;
    const previousRange = range;
    const previousWheelDirection = wheelDirection;
    const previousWheelAt = lastWheelAt;
    destroyTour();
    wheelDirection = previousWheelDirection;
    lastWheelAt = previousWheelAt;
    width = stage.clientWidth;
    height = innerHeight;
    stage.style.setProperty('--stage-height', `${height}px`);
    lastWidth = innerWidth;
    lastHeight = innerHeight;
    panelWidth = wings.left.offsetWidth;
    const faceHeights = [
      ...sheet.querySelectorAll<HTMLElement>('.panel-face'),
    ].map((face) => {
      const style = getComputedStyle(face);
      const number = (value: string) => Number.parseFloat(value) || 0;
      const children = [...face.children].filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          getComputedStyle(child).display !== 'none' &&
          getComputedStyle(child).position !== 'absolute',
      );
      const contentHeight = children.reduce((sum, child) => {
        const childStyle = getComputedStyle(child);
        return (
          sum +
          child.offsetHeight +
          number(childStyle.marginTop) +
          number(childStyle.marginBottom)
        );
      }, 0);
      // Overflow scrollHeight can omit trailing flex margins and padding.
      return Math.ceil(
        contentHeight +
          number(style.paddingTop) +
          number(style.paddingBottom) +
          number(style.borderTopWidth) +
          number(style.borderBottomWidth),
      );
    });
    paperHeight = Math.max(sheet.offsetHeight, ...faceHeights);
    sheet.style.setProperty('--panel-height', `${paperHeight}px`);
    for (const pair of lights)
      for (const light of [pair.front, pair.back])
        light.style.transform = `scale(${panelWidth / 16},${paperHeight / 16})`;
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
    stops = collectStops();
    // Finish opening the whole object before transferring focus to the cover.
    // Each fit includes both free edges, so expansion never unfolds offscreen.
    const openingViews = [
      [146, 6, 12, -5],
      [128, 0, 15, -5],
      [110, -8, 17, -5],
      [92, -16, 18, -4],
      [74, -14, 20, -4],
      [56, -10, 21, -3],
      [38, -6, 22, -2],
    ];
    const frames: Keyframe[] = openingViews.map(
      ([angle, yaw, pitch, roll], index) => ({
        at: (index / (openingViews.length - 1)) * 1.7,
        pose: overview(
          angle,
          yaw,
          pitch,
          width < height
            ? -12 - (22 * index) / (openingViews.length - 1)
            : roll,
        ),
      }),
    );
    // Fitting each hinge pose independently makes the dolly surge when a
    // different edge becomes widest. Use one pullback that slows toward the
    // full reveal; the fit measurements establish its destination only.
    const openingScale = Math.log(frames[0].pose.scale);
    const revealScale = Math.log(
      Math.min(...frames.map((frame) => frame.pose.scale)),
    );
    for (const frame of frames) {
      const progress = frame.at / 1.7;
      const retreat = 1 - (1 - progress) ** 2;
      frame.pose.scale = Math.exp(
        openingScale + (revealScale - openingScale) * retreat,
      );
    }
    openingAnchors = [0, 1.7];
    let previousPose = frames[frames.length - 1].pose;
    let previousPanel: Panel | null = null;
    let cursor = width < 760 ? 3.95 : width < 1000 ? 3.4 : 3.05;
    let additionalTravel = cursor - 2.65;
    for (let i = 1; i < stops.length; i += 1) {
      const stop = stops[i];
      if (stop.element?.dataset.printFace === 'back') {
        // Close in the opposite accordion direction: the right reverse is
        // then the exposed exterior, with no substituted print or overlay.
        const departure = stops[i - 1].at;
        const closingViews = [
          [0.7, 34, -30, 18, width < height ? -18 : -5],
          [1.5, 4, -46, 22, width < height ? -12 : -5],
          [2.4, -64, -52, 24, width < height ? -7 : -4],
          [3.3, -126, -30, 16, -4],
          [4.1, -162, -12, 8, -2],
          [5, -174, -6, 5, -1.5],
        ].map(([time, hinge, yaw, pitch, roll]) => ({
          at: departure + time,
          pose: overview(hinge, yaw, pitch, roll),
        }));
        // Hold the fitted pullback through the broad sweep, then move closer
        // only as the paper packet actually narrows.
        const sweepScale = Math.min(
          ...closingViews.slice(0, 4).map(({ pose }) => pose.scale),
        );
        closingViews.slice(0, 4).forEach(({ pose }) => {
          pose.scale = sweepScale;
        });
        const finalPose = closingViews.at(-1)!.pose;
        finalPose.scale = Math.min(
          finalPose.scale,
          (availableHeight * 0.82) / paperHeight,
          (width * 0.7) / panelWidth,
        );
        closingViews[4].pose.scale = Math.min(
          closingViews[4].pose.scale,
          Math.exp(
            Math.log(sweepScale) * 0.4 + Math.log(finalPose.scale) * 0.6,
          ),
        );
        frames.push(...closingViews);
        stop.at = closingViews.at(-1)!.at;
        additionalTravel += 3.3;
        continue;
      }
      const pose = readingPose(stop);
      if (i === 1 && width < 760) {
        // Establish the cover's framing before the type reaches reading size.
        frames.push({
          at: 2.45,
          pose: {
            ...pose,
            scale: Math.exp(
              Math.log(previousPose.scale) * 0.68 + Math.log(pose.scale) * 0.32,
            ),
          },
        });
      }
      const enteringCash = stop.element?.matches('.flyer-cash');
      if (previousPanel && previousPanel !== stop.panel) {
        const bridges = hingeTravel(
          previousPose,
          pose,
          previousPanel,
          stop.panel,
          panelWidth,
        );
        const extra =
          (previousPanel !== 'center' && stop.panel !== 'center' ? 1 : 0) *
          (width < 760 ? 3.2 : 3.7);
        cursor += extra;
        additionalTravel += extra;
        if (bridges.length > 2)
          for (const bridge of bridges)
            bridge.focusY = bridge.focusY * 0.15 + paperHeight * 0.5 * 0.85;
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
          : enteringCash
            ? width < 760
              ? 2.3
              : 2.95
            : 1.7;
      if (enteringCash) additionalTravel += width < 760 ? 0.1 : 1.25;
    }
    path = createPath(frames);
    range = preserveScroll
      ? previousRange
      : Math.round(
          Math.max(540, height * 0.74) *
            (stops.length + 1) *
            (path.duration / (path.duration - additionalTravel)),
        );
    // Native scrolling lands on whole pixels; its last anchor must represent
    // the exact path endpoint rather than a fractional unfinished fold.
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
    // Refit releases the previous tween; resume completion after input settles.
    scheduleSettle();
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
    const viewportBottom = window.innerHeight;
    if (
      window.scrollY + viewportBottom >=
      document.documentElement.scrollHeight - 1
    ) {
      const sections = elements.filter((element) =>
        element.hasAttribute('data-camera-stop'),
      );
      const lastSection = sections.at(-1);
      const visibleHeight = (element: HTMLElement) => {
        const box = element.getBoundingClientRect();
        return Math.max(
          0,
          Math.min(viewportBottom, box.bottom) - Math.max(readingTop, box.top),
        );
      };
      const lastBox = lastSection?.getBoundingClientRect();
      // A short final section cannot reach the reading line. At the document
      // end, a fully visible closing group still represents the reader's place.
      if (
        lastSection &&
        visibleHeight(lastSection) > 0 &&
        ((lastBox &&
          lastBox.top >= readingTop &&
          lastBox.bottom <= viewportBottom + 1) ||
          sections.every(
            (section) => visibleHeight(section) <= visibleHeight(lastSection),
          ))
      )
        return lastSection;
    }
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

  function updateModeControl() {
    const unavailable = preference.matches || typographyBlocked;
    mode.disabled = false;
    mode.setAttribute('aria-disabled', String(unavailable));
    if (unavailable)
      mode.setAttribute('aria-describedby', 'reading-explanation');
    else mode.removeAttribute('aria-describedby');
    mode.textContent = preference.matches
      ? 'Reduced motion'
      : typographyBlocked
        ? 'Reading view'
        : root.dataset.presentation === 'read'
          ? 'Take the tour'
          : 'Read normally';
    mode.title = preference.matches
      ? 'Normal reading respects your reduced-motion preference.'
      : typographyBlocked
        ? 'Normal reading preserves your text settings.'
        : '';
    if (modeExplanation) modeExplanation.textContent = mode.title;
  }

  function setMode(read: boolean, persist: boolean, preservePosition = false) {
    const wasRead = root.dataset.presentation === 'read';
    const focusedChapter = nav?.contains(document.activeElement);
    const focused =
      document.activeElement instanceof HTMLElement &&
      sheet.contains(document.activeElement)
        ? document.activeElement
        : null;
    const element = wasRead
      ? (readingResumeElement ?? readingElement())
      : (focused?.closest<HTMLElement>(
          '[data-camera-mobile], [data-camera-stop]',
        ) ??
        navigationElement ??
        stops[Math.max(0, lastIndex)]?.element);
    if (!read && !typography.check()) {
      typographyBlocked = true;
      read = true;
    }
    // Returning to the mode control can scroll the ordinary document. Keep the
    // reading idea until an actual reading gesture selects another position.
    readingInput = false;
    destroyTour();
    userDirection = 0;
    root.dataset.presentation = read ? 'read' : 'tour';
    mode.setAttribute('aria-pressed', String(read));
    updateModeControl();
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
      focused?.focus({ preventScroll: true });
      if (!preservePosition && element)
        element.scrollIntoView({ block: 'start', behavior: 'instant' });
      else if (!preservePosition) writeScroll(0);
      if (focused && !preservePosition)
        focused.scrollIntoView({ block: 'center', behavior: 'instant' });
      else if (focusedChapter && typographyBlocked && element) {
        const heading =
          [...element.querySelectorAll<HTMLElement>('h1, h2')].find(
            (candidate) => candidate.getClientRects().length > 0,
          ) ?? element;
        const hadTabindex = heading.hasAttribute('tabindex');
        if (!hadTabindex) {
          heading.tabIndex = -1;
          heading.addEventListener(
            'blur',
            () => heading.removeAttribute('tabindex'),
            { once: true },
          );
        }
        heading.focus({ preventScroll: true });
      }
    } else {
      if (sheet.contains(document.activeElement))
        mode.focus({ preventScroll: true });
      restorePaper ??= mountPaper(sheet, (original) => {
        setMode(true, false);
        original.focus({ preventScroll: true });
        original.scrollIntoView({ block: 'center', behavior: 'instant' });
      });
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
      typographyBlocked ||
      new URLSearchParams(location.search).get('view') === 'read';
    // The camera's scroll range exists only after mounting. Native history
    // restoration can run earlier and clamp the saved tour position to zero.
    history.scrollRestoration = 'manual';
    setMode(forceReading || saved.mode === 'read', false, true);
    if ('sectionId' in saved && typeof saved.sectionId === 'string') {
      const section = document.getElementById(saved.sectionId);
      if (section && sheet.contains(section)) {
        readingResumeElement =
          'mobileName' in saved && typeof saved.mobileName === 'string'
            ? ([
                ...section.querySelectorAll<HTMLElement>(
                  '[data-camera-mobile]',
                ),
              ].find(
                (element) => element.dataset.cameraMobile === saved.mobileName,
              ) ?? section)
            : section;
      }
    }
    if (root.dataset.presentation === 'tour' && path) {
      target = visual = Math.max(0, Math.min(1, saved.progress));
      velocity = 0;
      writeScroll(offset + range * target);
      render();
    } else if (saved.mode === 'tour' && readingResumeElement)
      readingResumeElement.scrollIntoView({
        block: 'start',
        behavior: 'instant',
      });
    else writeScroll(Math.max(0, saved.scrollY));
  }
  window.addEventListener('pagehide', () => {
    const readingSection =
      root.dataset.presentation === 'read'
        ? (readingResumeElement ?? readingElement())
        : (navigationElement ?? stops[Math.max(0, lastIndex)]?.element);
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
            sectionId:
              readingSection?.closest('[data-camera-stop]')?.id ?? null,
            mobileName: readingSection?.dataset.cameraMobile ?? null,
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
  function followSectionFragment() {
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const section = id ? document.getElementById(id) : null;
    if (
      !section ||
      !sheet.contains(section) ||
      !section.matches('[data-camera-stop]')
    )
      return;
    if (root.dataset.presentation === 'read') {
      section.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    const stop = stops.find(
      (candidate) =>
        candidate.element?.closest('[data-camera-stop]') === section,
    );
    if (!stop || !path) return;
    cancelAutomaticScroll();
    navigationElement = stop.element;
    userDirection = 0;
    target = visual = stop.at / path.duration;
    velocity = 0;
    writeScroll(offset + range * target);
    render();
  }
  if (
    !(navigation instanceof PerformanceNavigationTiming) ||
    navigation.type !== 'back_forward'
  )
    followSectionFragment();
  window.addEventListener('hashchange', followSectionFragment);
  mode.addEventListener('click', () => {
    if (!preference.matches && !typographyBlocked)
      setMode(root.dataset.presentation !== 'read', true);
  });
  preference.addEventListener('change', () => {
    let savedRead = false;
    try {
      savedRead = localStorage.getItem('proposal-presentation') === 'read';
    } catch {
      savedRead = true;
    }
    setMode(preference.matches || savedRead, false);
  });
  nav?.addEventListener('pointerdown', () => {
    chapterNavNeedsReconcile = false;
  });
  nav?.addEventListener('focusin', (event) => {
    chapterNavNeedsReconcile = false;
    const button = event.target;
    if (
      !(button instanceof HTMLButtonElement) ||
      !button.matches(':focus-visible') ||
      !nav ||
      nav.scrollWidth <= nav.clientWidth
    )
      return;
    nav.scrollTo({
      left:
        nav.scrollLeft +
        button.getBoundingClientRect().left -
        nav.getBoundingClientRect().left -
        (nav.clientWidth - button.offsetWidth) / 2,
      behavior: 'instant',
    });
  });
  nav?.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('button[data-go-to]')
        : null;
    const stop = button ? stops[Number(button.dataset.goTo)] : undefined;
    if (stop && path) {
      scrollToPosition(
        stop.at / path.duration,
        Math.abs(stops.indexOf(stop) - Math.max(0, lastIndex)),
      );
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
    wheelDirection = 0;
    nativeWheelUntil = 0;
    writtenScrollY = undefined;
    readingInput = root.dataset.presentation === 'read';
    releaseReadingInputAfterIdle();
    if (!readingInput) scheduleSettle();
  }
  window.addEventListener(
    'wheel',
    (event) => {
      // Horizontal chapter browsing and browser pinch zoom do not own the tour.
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        // Some browsers also move native Y during an otherwise native gesture.
        // Refit the nearest pose instead of treating that as chapter intent.
        nativeWheelUntil = performance.now() + 250;
        return;
      }
      if (!event.ctrlKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        nativeWheelUntil = 0;
        if (root.dataset.presentation !== 'tour') {
          handleUserInput();
          return;
        }
        if (event.cancelable) event.preventDefault();
        const direction = Math.sign(event.deltaY);
        const now = performance.now();
        const ongoing =
          direction === wheelDirection &&
          (now - lastWheelAt < 200 || Boolean(scrollTween));
        lastWheelAt = now;
        wheelDirection = direction;
        if (!ongoing) commitGesture(direction);
      }
    },
    { passive: false },
  );
  window.addEventListener(
    'touchstart',
    (event) => {
      touchActive = true;
      touchGesture = undefined;
      const point = event.touches?.length === 1 ? event.touches[0] : undefined;
      const control =
        event.target instanceof Element &&
        event.target.closest(
          'a, button, input, textarea, select, [contenteditable], .chapter-nav',
        );
      if (root.dataset.presentation === 'tour' && point && !control) {
        touchGesture = {
          x: point.clientX,
          y: point.clientY,
          lastY: point.clientY,
          direction: 0,
        };
      } else handleUserInput();
    },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (event) => {
      if (!touchGesture || root.dataset.presentation !== 'tour') return;
      if (event.touches.length !== 1) {
        touchGesture = undefined;
        return;
      }
      const point = event.touches[0];
      const delta = touchGesture.y - point.clientY;
      if (
        !touchGesture.direction &&
        (Math.abs(delta) < 6 ||
          Math.abs(delta) <= Math.abs(point.clientX - touchGesture.x))
      )
        return;
      if (!event.cancelable) return;
      event.preventDefault();
      const movement = touchGesture.lastY - point.clientY;
      const direction =
        touchGesture.direction === 0 ? Math.sign(delta) : Math.sign(movement);
      if (
        !touchGesture.direction ||
        (direction !== touchGesture.direction && Math.abs(movement) >= 6)
      ) {
        touchGesture.direction = direction;
        commitGesture(direction);
      }
      if (direction === touchGesture.direction)
        touchGesture.lastY = point.clientY;
    },
    { passive: false },
  );
  const releaseTouch = (event: TouchEvent) => {
    touchActive = Boolean(event.touches?.length);
    if (touchActive) return;
    touchGesture = undefined;
    clearTimeout(settleTimer);
    if (root.dataset.presentation === 'read') releaseReadingInputAfterIdle();
    else scheduleSettle();
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
