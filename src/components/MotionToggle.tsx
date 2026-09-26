import { useEffect, useState } from 'react';

export default function MotionToggle() {
  const [enabled, setEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('proposal-motion');
    } catch {
      /* Storage can be unavailable in private contexts. */
    }
    const initial = !preference.matches && saved !== 'off';
    setEnabled(initial);
    setSystemReduced(preference.matches);
    setInitialized(true);
    document.documentElement.dataset.motion = initial ? 'on' : 'off';
    dispatchEvent(
      new CustomEvent('proposal:motion', { detail: { enabled: initial } }),
    );
    const changed = () => {
      let current: string | null = null;
      try {
        current = localStorage.getItem('proposal-motion');
      } catch {
        /* Storage is optional. */
      }
      const next = !preference.matches && current !== 'off';
      setSystemReduced(preference.matches);
      setEnabled(next);
      document.documentElement.dataset.motion = next ? 'on' : 'off';
      dispatchEvent(
        new CustomEvent('proposal:motion', { detail: { enabled: next } }),
      );
    };
    preference.addEventListener('change', changed);
    return () => preference.removeEventListener('change', changed);
  }, []);
  function toggle() {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem('proposal-motion', next ? 'on' : 'off');
    } catch {
      /* Reading remains available without persistence. */
    }
    document.documentElement.dataset.motion = next ? 'on' : 'off';
    dispatchEvent(
      new CustomEvent('proposal:motion', { detail: { enabled: next } }),
    );
  }
  return (
    <button
      className="motion-toggle"
      type="button"
      aria-label={`Motion ${enabled ? 'on' : 'off'}`}
      aria-pressed={enabled}
      disabled={!initialized || systemReduced}
      title={
        systemReduced
          ? 'Motion is disabled by your system preference'
          : undefined
      }
      onClick={toggle}
    >
      <span className="motion-indicator" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>Motion {enabled ? 'on' : 'off'}</span>
    </button>
  );
}
