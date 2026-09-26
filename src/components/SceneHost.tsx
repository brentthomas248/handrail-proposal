import { useEffect, useState, type ComponentType } from 'react';
import PaperFallback from './PaperFallback';
type SceneProps = {
  progress?: number;
  reducedMotion?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};
export default function SceneHost() {
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const update = () => {
      const next =
        document.documentElement.dataset.motion !== 'off' &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnabled(next);
      if (!next) setReady(false);
    };
    update();
    addEventListener('proposal:motion', update);
    return () => removeEventListener('proposal:motion', update);
  }, []);
  useEffect(() => {
    if (!enabled || Scene || failed) return;
    let cancelled = false;
    import('./PaperScene')
      .then((module) => {
        if (!cancelled) setScene(() => module.default);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, Scene, failed]);
  return (
    <div
      className="scene-host"
      data-scene-state={
        failed ? 'fallback' : ready && enabled ? 'ready' : 'static'
      }
    >
      <div className="scene-static" aria-hidden="true">
        <PaperFallback />
      </div>
      {Scene && enabled && !failed && (
        <div className="scene-live" aria-hidden="true">
          <Scene
            onReady={() => setReady(true)}
            onUnavailable={() => {
              setFailed(true);
              setReady(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
