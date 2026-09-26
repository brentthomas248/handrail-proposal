import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ACESFilmicToneMapping,
  BackSide,
  CanvasTexture,
  CatmullRomCurve3,
  FrontSide,
  Group,
  OrthographicCamera,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from 'three';
import {
  createPaperGeometry,
  updatePaperGeometry,
} from '../lib/paper-geometry';

export interface PaperSceneProps {
  /** Omit to follow proposal:progress CustomEvents from the page timeline. */
  progress?: number;
  reducedMotion?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
}

const clampProgress = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

function printedPaperTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 480;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Paper texture canvas unavailable');
  const designWidth = 2048;
  const designHeight = 960;
  context.scale(canvas.width / designWidth, canvas.height / designHeight);
  const panelWidth = designWidth / 3;

  context.fillStyle = '#f9fbfc';
  context.fillRect(0, 0, designWidth, designHeight);
  context.fillStyle = '#f0f3f5';
  context.fillRect(panelWidth, 0, panelWidth, designHeight);
  context.fillStyle = '#21364b';
  context.fillRect(panelWidth * 2, 0, panelWidth, designHeight);

  // These are abstract printed marks; the complete agreement lives in HTML.
  for (let panel = 0; panel < 3; panel += 1) {
    const left = panel * panelWidth + 82;
    const ink = panel === 2 ? '#c7d2dc' : '#34495a';
    context.fillStyle = ink;
    context.fillRect(left, 92, 12, 62);
    context.fillRect(left + 33, 92, 12, 62);
    context.fillRect(left, 114, 45, 8);
    context.globalAlpha = 0.5;
    context.fillRect(left + 74, 108, 102, 4);
    context.fillRect(left + 74, 125, 68, 4);
    context.globalAlpha = 1;

    if (panel === 0) {
      context.fillRect(left, 326, 402, 24);
      context.fillRect(left, 368, 318, 24);
      context.fillRect(left, 410, 365, 24);
      context.globalAlpha = 0.35;
      for (let line = 0; line < 5; line += 1) {
        context.fillRect(left, 518 + line * 20, line === 4 ? 268 : 395, 4);
      }
      context.globalAlpha = 1;
    } else if (panel === 1) {
      for (let paragraph = 0; paragraph < 3; paragraph += 1) {
        context.fillRect(left, 277 + paragraph * 157, 170 + paragraph * 26, 8);
        context.globalAlpha = 0.35;
        for (let line = 0; line < 4; line += 1) {
          context.fillRect(
            left,
            310 + paragraph * 157 + line * 17,
            line === 3 ? 275 : 412,
            4,
          );
        }
        context.globalAlpha = 1;
      }
    } else {
      context.strokeStyle = '#a2b4c3';
      context.lineWidth = 3;
      context.strokeRect(left + 18, 291, 148, 264);
      context.strokeRect(left + 188, 291, 148, 264);
      context.beginPath();
      context.moveTo(left + 166, 346);
      context.lineTo(left + 188, 346);
      context.moveTo(left + 166, 502);
      context.lineTo(left + 188, 502);
      context.stroke();
      context.globalAlpha = 0.65;
      context.fillRect(left + 18, 612, 310, 4);
      context.fillRect(left + 18, 633, 232, 4);
      context.globalAlpha = 1;
    }

    context.globalAlpha = 0.35;
    context.fillRect(left, 822, 424, 2);
    context.fillRect(left, 848, 85, 3);
    context.fillRect(left + 386, 848, 38, 3);
    context.globalAlpha = 1;
  }

  // Deterministic, low-contrast fiber grain avoids a perfectly plastic surface.
  let seed = 7419;
  for (let i = 0; i < 4000; i += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % designWidth;
    seed = (seed * 16807) % 2147483647;
    const y = seed % designHeight;
    context.fillStyle =
      i % 2 ? 'rgba(32,45,56,0.025)' : 'rgba(255,255,255,0.035)';
    context.fillRect(x, y, 1, 2);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function usePaperclip(): TubeGeometry {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(
      [
        new Vector3(0.03, 0.035, 0.38),
        new Vector3(-0.16, 0.035, 0.38),
        new Vector3(-0.23, 0.035, 0.25),
        new Vector3(-0.23, 0.035, -0.48),
        new Vector3(-0.09, 0.025, -0.64),
        new Vector3(0.12, 0.025, -0.6),
        new Vector3(0.21, 0.035, -0.43),
        new Vector3(0.21, 0.035, 0.43),
        new Vector3(0.09, 0.04, 0.6),
        new Vector3(-0.06, 0.04, 0.55),
        new Vector3(-0.13, 0.04, 0.4),
        new Vector3(-0.13, 0.04, -0.34),
        new Vector3(-0.02, 0.045, -0.45),
        new Vector3(0.085, 0.045, -0.35),
        new Vector3(0.085, 0.045, 0.27),
      ],
      false,
      'centripetal',
    );
    return new TubeGeometry(curve, 80, 0.016, 8, false);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function FoldingPaper({ progress }: { progress: number }) {
  const geometry = useMemo(createPaperGeometry, []);
  const texture = useMemo(printedPaperTexture, []);
  const paperclip = usePaperclip();
  const clip = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const attachment = updatePaperGeometry(geometry, progress);
    if (clip.current) {
      clip.current.position.set(attachment.x, attachment.y + 0.025, -1.38);
      clip.current.rotation.z = attachment.angle;
    }
    invalidate();
  }, [geometry, progress, invalidate]);

  useEffect(
    () => () => {
      geometry.dispose();
      texture.dispose();
    },
    [geometry, texture],
  );

  return (
    <group
      rotation={[
        0.8 - progress * 0.5,
        -0.37 + progress * 0.16,
        -0.12 + progress * 0.09,
      ]}
      position={[0, 0.3, 0]}
    >
      <mesh geometry={geometry}>
        <meshLambertMaterial map={texture} side={FrontSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshLambertMaterial color="#344858" side={BackSide} />
      </mesh>
      <group ref={clip}>
        <mesh geometry={paperclip}>
          <meshStandardMaterial
            color="#bdc5cb"
            metalness={0.82}
            roughness={0.29}
          />
        </mesh>
      </group>
    </group>
  );
}

function ResponsiveCamera() {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(width, height) * 0.128;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, width, height, invalidate]);
  return null;
}

function SceneLifecycle({
  onReady,
  onUnavailable,
}: {
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const canvas = gl.domElement;
    const unavailable = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener('webglcontextlost', unavailable);
    invalidate();
    const frame = window.requestAnimationFrame(onReady);
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', unavailable);
    };
  }, [gl, invalidate, onReady, onUnavailable]);
  return null;
}

class SceneBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    console.warn('Paper scene could not be rendered:', error.message);
    this.props.onUnavailable();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export default function PaperScene({
  progress,
  reducedMotion = false,
  onReady,
  onUnavailable,
}: PaperSceneProps) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onUnavailable });
  callbacks.current = { onReady, onUnavailable };
  const latestProgress = useRef(progress ?? 0);
  const active = useRef(true);
  const inViewport = useRef(true);
  const notifiedReady = useRef(false);
  const [ready, setReady] = useState(false);
  const [renderProgress, setRenderProgress] = useState(
    clampProgress(progress ?? 0),
  );
  const [unavailable, setUnavailable] = useState(false);

  const reportReady = useCallback(() => {
    if (notifiedReady.current) return;
    notifiedReady.current = true;
    setReady(true);
    callbacks.current.onReady?.();
  }, []);
  const reportUnavailable = useCallback(() => {
    setUnavailable(true);
    callbacks.current.onUnavailable?.();
  }, []);

  useEffect(() => {
    const element = container.current;
    const synchronize = () => {
      active.current =
        inViewport.current && document.visibilityState !== 'hidden';
      if (active.current)
        setRenderProgress(clampProgress(latestProgress.current));
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inViewport.current = entry?.isIntersecting ?? false;
              synchronize();
            },
            { rootMargin: '100px' },
          );
    if (element) observer?.observe(element);
    document.addEventListener('visibilitychange', synchronize);
    synchronize();
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', synchronize);
    };
  }, []);

  useEffect(() => {
    if (progress !== undefined) {
      latestProgress.current = clampProgress(progress);
      if (active.current) setRenderProgress(latestProgress.current);
      return;
    }
    const update = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (
        typeof detail !== 'object' ||
        detail === null ||
        !('progress' in detail) ||
        typeof detail.progress !== 'number'
      )
        return;
      latestProgress.current = clampProgress(detail.progress);
      if (active.current && !reducedMotion)
        setRenderProgress(latestProgress.current);
    };
    window.addEventListener('proposal:progress', update);
    return () => window.removeEventListener('proposal:progress', update);
  }, [progress, reducedMotion]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      data-paper-scene={
        unavailable ? 'unavailable' : ready ? 'ready' : 'loading'
      }
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {!unavailable && (
        <SceneBoundary onUnavailable={reportUnavailable}>
          <div
            style={{
              position: 'absolute',
              left: '24%',
              bottom: '13%',
              width: '65%',
              height: '16%',
              background:
                'radial-gradient(ellipse, rgba(41,60,76,0.12) 0%, rgba(41,60,76,0.04) 40%, transparent 72%)',
              transform: 'rotate(-12deg)',
            }}
          />
          <Canvas
            orthographic
            camera={{ position: [6, 8, 10], near: 0.1, far: 40, zoom: 65 }}
            frameloop="demand"
            dpr={[1, 1.5]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'low-power',
              toneMapping: ACESFilmicToneMapping,
            }}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <ResponsiveCamera />
            <SceneLifecycle
              onReady={reportReady}
              onUnavailable={reportUnavailable}
            />
            <ambientLight intensity={0.35} color="#e8eff7" />
            <hemisphereLight args={['#ffffff', '#627b8d', 0.7]} />
            <directionalLight
              position={[-4, 8, 5]}
              intensity={3}
              color="#ffffff"
            />
            <directionalLight
              position={[5, 3, -4]}
              intensity={1}
              color="#c6d5e3"
            />
            <FoldingPaper progress={reducedMotion ? 0.06 : renderProgress} />
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  );
}
