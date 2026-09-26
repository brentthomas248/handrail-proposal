import { BufferAttribute, BufferGeometry } from 'three';

const LENGTH = 7.4;
const WIDTH = 3.45;
const LENGTH_SEGMENTS = 192;
const WIDTH_SEGMENTS = 12;

export interface PaperPoint {
  x: number;
  y: number;
  angle: number;
}

function smoothstep(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

/** The narrow transition bands give each crease a physical radius. */
export function paperSpine(progress: number): PaperPoint[] {
  const unfolded = smoothstep(progress);
  const angles = [-0.74, 0.87, -0.52].map((angle) => angle * (1 - unfolded));
  const points: PaperPoint[] = [];
  let x = 0;
  let y = 0;

  for (let index = 0; index <= LENGTH_SEGMENTS; index += 1) {
    const u = index / LENGTH_SEGMENTS;
    const firstFold = smoothstep((u - 1 / 3 + 0.016) / 0.032);
    const secondFold = smoothstep((u - 2 / 3 + 0.016) / 0.032);
    const angle =
      angles[0]! +
      (angles[1]! - angles[0]!) * firstFold +
      (angles[2]! - angles[1]!) * secondFold;
    if (index > 0) {
      x += (Math.cos(angle) * LENGTH) / LENGTH_SEGMENTS;
      y += (Math.sin(angle) * LENGTH) / LENGTH_SEGMENTS;
    }
    points.push({ x, y, angle });
  }

  const centerX = x / 2;
  const centerY =
    (Math.min(...points.map((point) => point.y)) +
      Math.max(...points.map((point) => point.y))) /
    2;
  return points.map((point) => ({
    ...point,
    x: point.x - centerX,
    y: point.y - centerY,
  }));
}

export function createPaperGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(
    (LENGTH_SEGMENTS + 1) * (WIDTH_SEGMENTS + 1) * 3,
  );
  const uv = new Float32Array((LENGTH_SEGMENTS + 1) * (WIDTH_SEGMENTS + 1) * 2);
  const indices: number[] = [];

  for (let i = 0; i <= LENGTH_SEGMENTS; i += 1) {
    for (let j = 0; j <= WIDTH_SEGMENTS; j += 1) {
      const vertex = i * (WIDTH_SEGMENTS + 1) + j;
      uv[vertex * 2] = i / LENGTH_SEGMENTS;
      uv[vertex * 2 + 1] = 1 - j / WIDTH_SEGMENTS;
      if (i < LENGTH_SEGMENTS && j < WIDTH_SEGMENTS) {
        const next = vertex + WIDTH_SEGMENTS + 1;
        indices.push(vertex, vertex + 1, next, next, vertex + 1, next + 1);
      }
    }
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  updatePaperGeometry(geometry, 0);
  return geometry;
}

/** Update the existing buffer so scrolling never reallocates GPU geometry. */
export function updatePaperGeometry(
  geometry: BufferGeometry,
  progress: number,
): PaperPoint {
  const spine = paperSpine(progress);
  const positions = geometry.getAttribute('position');
  for (let i = 0; i <= LENGTH_SEGMENTS; i += 1) {
    const point = spine[i]!;
    for (let j = 0; j <= WIDTH_SEGMENTS; j += 1) {
      const v = j / WIDTH_SEGMENTS;
      const bow = Math.sin(v * Math.PI) * 0.045;
      positions.setXYZ(
        i * (WIDTH_SEGMENTS + 1) + j,
        point.x,
        point.y + bow,
        (v - 0.5) * WIDTH,
      );
    }
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return spine[Math.round(LENGTH_SEGMENTS * 0.89)]!;
}
