import { describe, expect, it } from 'vitest';
import {
  createPath,
  damp,
  foldPoint,
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
