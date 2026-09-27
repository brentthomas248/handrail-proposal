import { describe, expect, it } from 'vitest';
import {
  createPath,
  damp,
  foldPoint,
  settleAnchor,
  sceneAt,
  hingeTravel,
  rotatePoint,
  type Pose,
} from '../src/scripts/tour-path';

const pose: Pose = {
  focusX: 0,
  focusY: 0,
  focusZ: 0,
  scale: 1,
  pitch: 0,
  yaw: 0,
  roll: 0,
  left: 0,
  right: 0,
};

describe('physical accordion geometry', () => {
  it('puts the two free edges on opposite sides of the center plane', () => {
    for (const angle of [38, 70, 88, 174]) {
      const left = foldPoint({ x: 0, y: 0, z: 0 }, 'left', 900, angle);
      const right = foldPoint({ x: 2700, y: 0, z: 0 }, 'right', 900, angle);
      expect(left.z).toBeGreaterThan(0);
      expect(right.z).toBeLessThan(0);
      expect(left.z).toBeCloseTo(-right.z);
    }
  });

  it('keeps a folded reading face perpendicular to the camera', () => {
    const theta = (38 * Math.PI) / 180;
    const normal = rotatePoint(
      { x: Math.sin(theta), y: 0, z: Math.cos(theta) },
      { yaw: -38, pitch: 0, roll: 0 },
    );
    expect(normal.x).toBeCloseTo(0);
    expect(normal.z).toBeCloseTo(1);
  });
});

describe('continuous camera path', () => {
  const path = createPath(
    [0, 1, 2, 4].map((at, i) => ({
      at,
      pose: {
        ...pose,
        focusY: [0, 40, 70, 120][i],
        scale: [0.2, 0.8, 0.4, 1.3][i],
      },
    })),
  );

  it('moves throughout a reading interval instead of spending scroll on a hold', () => {
    for (let t = 0; t < 3.99; t += 0.01)
      expect(path.sample(t + 0.01).focusY).toBeGreaterThan(
        path.sample(t).focusY,
      );
  });

  it('preserves velocity across chapter keyframes and bounds scale', () => {
    for (const t of [1, 2]) {
      const epsilon = 0.0001;
      const before =
        (path.sample(t).focusY - path.sample(t - epsilon).focusY) / epsilon;
      const after =
        (path.sample(t + epsilon).focusY - path.sample(t).focusY) / epsilon;
      expect(Math.abs(before - after)).toBeLessThan(0.02);
    }
    for (let t = 0; t <= 4; t += 0.01) {
      expect(path.sample(t).scale).toBeGreaterThanOrEqual(0.2);
      expect(path.sample(t).scale).toBeLessThanOrEqual(1.3);
    }
  });
});

describe('scroll response', () => {
  it('gives the same response at 60Hz and 120Hz', () => {
    const run = (hz: number) => {
      let state = { value: 0, velocity: 0 };
      for (let i = 0; i < hz / 2; i += 1)
        state = damp(state.value, 1, state.velocity, 1 / hz);
      return state.value;
    };
    expect(run(60)).toBeCloseTo(run(120), 8);
  });

  it('smooths the very first flick and immediately follows a reversal', () => {
    const first = damp(0, 1, 0, 1 / 60);
    expect(first.value).toBeGreaterThan(0);
    expect(first.value).toBeLessThan(0.05);
    const reversed = damp(first.value, 0, first.velocity, 1 / 60);
    expect(reversed.value).toBeLessThan(first.value);
    expect(reversed.value).toBeGreaterThanOrEqual(0);
  });

  it('does not overshoot when the input target moves closer during a flick', () => {
    let state = { value: 0.49, velocity: 15 };
    for (let i = 0; i < 120; i += 1) {
      state = damp(state.value, 0.5, state.velocity, 1 / 60);
      expect(state.value).toBeLessThanOrEqual(0.5);
    }
    expect(state.value).toBeCloseTo(0.5, 5);
  });
});

describe('direction-owned idle settling', () => {
  const anchors = [0, 2, 4, 6];

  it.each([0.15, 0.4, 0.6])(
    'does not undo forward or reverse movement across %s of an interval',
    (fraction) => {
      const forward = 2 + fraction * 2;
      const reverse = 4 - fraction * 2;
      expect(settleAnchor(anchors, forward, 1, 0.24)).toBe(4);
      expect(settleAnchor(anchors, reverse, -1, 0.24)).toBe(2);
    },
  );

  it('leaves readable positions and directionless jitter alone', () => {
    expect(settleAnchor(anchors, 2.1, 1, 0.24)).toBeNull();
    expect(settleAnchor(anchors, 3, 0, 0.24)).toBeNull();
    expect(settleAnchor(anchors, 6.4, 1, 0.24)).toBeNull();
  });
});

describe('honest scene ownership', () => {
  const stops = [
    { name: 'Overview', at: 0 },
    { name: 'Cash flow', at: 2 },
    { name: 'Hire first', at: 4 },
    { name: 'Client first', at: 6 },
  ];

  it('names the reading idea only inside its reading region', () => {
    expect(sceneAt(stops, 4, 0.24, 1)).toEqual({
      index: 2,
      caption: 'Hire first',
    });
    expect(sceneAt(stops, 3.5, 0.24, 1).caption).toBe(
      'Between Cash flow and Hire first',
    );
    expect(sceneAt(stops, 3.5, 0.24, 2).caption).toBe(
      'Between Cash flow and Hire first',
    );
  });

  it('does not flicker current-step ownership on tiny midpoint reversals', () => {
    expect(sceneAt(stops, 3.02, 0.24, 1).index).toBe(1);
    expect(sceneAt(stops, 2.98, 0.24, 2).index).toBe(2);
    expect(sceneAt(stops, 3.1, 0.24, 1).index).toBe(2);
    expect(sceneAt(stops, 2.9, 0.24, 2).index).toBe(1);
  });
});

describe('local paper travel', () => {
  it('crosses an adjacent hinge at reading scale', () => {
    const from = { ...pose, focusX: 1800, focusY: 400, scale: 0.4 };
    const to = { ...pose, focusX: 3000, focusY: 800, scale: 0.5 };
    const bridge = hingeTravel(from, to, 'center', 'right', 1200);
    expect(bridge).toHaveLength(1);
    expect(bridge[0].focusX).toBe(2400);
    expect(bridge[0].focusY).toBe(600);
    expect(bridge[0].scale).toBeCloseTo(0.36);
  });

  it('returns across both hinges without an overview zoom-out', () => {
    const from = { ...pose, focusX: 3000, focusY: 600, scale: 0.5 };
    const to = { ...pose, focusX: 600, focusY: 1400, scale: 0.4 };
    const bridges = hingeTravel(from, to, 'right', 'left', 1200);
    expect(bridges.map((bridge) => bridge.focusX)).toEqual([2400, 1200]);
    for (const bridge of bridges) {
      expect(bridge.scale).toBeGreaterThanOrEqual(0.36);
      expect(Math.abs(bridge.pitch)).toBeLessThanOrEqual(4);
    }
    expect(hingeTravel(from, to, 'right', 'right', 1200)).toEqual([]);
  });
});
