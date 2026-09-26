export type Panel = 'left' | 'center' | 'right';
export type Point = { x: number; y: number; z: number };
export interface Pose {
  focusX: number;
  focusY: number;
  focusZ: number;
  scale: number;
  pitch: number;
  yaw: number;
  roll: number;
  left: number;
  right: number;
}
export interface Keyframe {
  at: number;
  pose: Pose;
}
const radians = Math.PI / 180;

/** Opposite edge origins and matching rotations form an accordion fold. */
export function foldPoint(
  point: Point,
  panel: Panel,
  width: number,
  angle: number,
): Point {
  if (panel === 'center') return point;
  const pivot = panel === 'left' ? width : width * 2;
  const offset = point.x - pivot;
  const theta = angle * radians;
  return {
    x: pivot + offset * Math.cos(theta) + point.z * Math.sin(theta),
    y: point.y,
    z: -offset * Math.sin(theta) + point.z * Math.cos(theta),
  };
}

/** Matches the CSS camera's rotateZ → rotateX → rotateY transform order. */
export function rotatePoint(
  point: Point,
  pose: Pick<Pose, 'yaw' | 'pitch' | 'roll'>,
): Point {
  const yaw = pose.yaw * radians;
  const pitch = pose.pitch * radians;
  const roll = pose.roll * radians;
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const z = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const y = point.y * Math.cos(pitch) - z * Math.sin(pitch);
  const depth = point.y * Math.sin(pitch) + z * Math.cos(pitch);
  return {
    x: x * Math.cos(roll) - y * Math.sin(roll),
    y: x * Math.sin(roll) + y * Math.cos(roll),
    z: depth,
  };
}

export function viewPoint(point: Point, pose: Pose): Point {
  const rotated = rotatePoint(
    {
      x: point.x - pose.focusX,
      y: point.y - pose.focusY,
      z: point.z - pose.focusZ,
    },
    pose,
  );
  return {
    x: rotated.x * pose.scale,
    y: rotated.y * pose.scale,
    z: rotated.z * pose.scale,
  };
}

/** Shape-preserving cubic interpolation keeps velocity continuous without overshoot. */
export function createPath(frames: Keyframe[]): {
  duration: number;
  sample: (time: number) => Pose;
} {
  if (
    frames.length < 2 ||
    frames.some((frame, i) => i > 0 && frame.at <= frames[i - 1].at)
  )
    throw new Error('Camera keyframes must have strictly increasing times.');
  const keys = Object.keys(frames[0].pose) as (keyof Pose)[];
  const tracks = keys.map((key) => {
    const values = frames.map((frame) =>
      key === 'scale' ? Math.log(frame.pose[key]) : frame.pose[key],
    );
    const widths = frames.slice(1).map((frame, i) => frame.at - frames[i].at);
    const slopes = widths.map(
      (width, i) => (values[i + 1] - values[i]) / width,
    );
    const tangents = values.map((_, i) => {
      if (i === 0) return slopes[0];
      if (i === values.length - 1) return slopes[i - 1];
      const before = slopes[i - 1];
      const after = slopes[i];
      if (before * after <= 0) return 0;
      const firstWeight = 2 * widths[i] + widths[i - 1];
      const secondWeight = widths[i] + 2 * widths[i - 1];
      return (
        (firstWeight + secondWeight) /
        (firstWeight / before + secondWeight / after)
      );
    });
    return { key, values, widths, tangents };
  });
  const duration = frames[frames.length - 1].at;
  return {
    duration,
    sample(time) {
      const bounded = Math.max(frames[0].at, Math.min(duration, time));
      let index = 0;
      while (index < frames.length - 2 && bounded > frames[index + 1].at)
        index += 1;
      const result = { ...frames[index].pose };
      for (const track of tracks) {
        const width = track.widths[index];
        const t = (bounded - frames[index].at) / width;
        const t2 = t * t;
        const t3 = t2 * t;
        const value =
          (2 * t3 - 3 * t2 + 1) * track.values[index] +
          (t3 - 2 * t2 + t) * width * track.tangents[index] +
          (-2 * t3 + 3 * t2) * track.values[index + 1] +
          (t3 - t2) * width * track.tangents[index + 1];
        result[track.key] = track.key === 'scale' ? Math.exp(value) : value;
      }
      return result;
    },
  };
}

/** Exact critically damped response, independent of the display refresh rate. */
export function damp(
  current: number,
  target: number,
  velocity: number,
  seconds: number,
): { value: number; velocity: number } {
  const omega = 20;
  const dt = Math.min(0.04, Math.max(0, seconds));
  const offset = current - target;
  const alignedVelocity =
    velocity * (target - current) < 0
      ? 0
      : Math.sign(velocity) *
        Math.min(Math.abs(velocity), omega * Math.abs(offset));
  const coefficient = alignedVelocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  return {
    value: target + (offset + coefficient * dt) * decay,
    velocity: (alignedVelocity - omega * coefficient * dt) * decay,
  };
}
