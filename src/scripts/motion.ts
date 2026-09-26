import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
let cleanup: (() => void) | undefined;
function setupMotion() {
  cleanup?.();
  cleanup = undefined;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.documentElement.dataset.motion === 'off') {
    dispatchEvent(
      new CustomEvent('proposal:progress', { detail: { progress: 0 } }),
    );
    return;
  }
  const desktop = matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const lenis = desktop
    ? new Lenis({ autoRaf: false, duration: 0.85, anchors: true })
    : null;
  const tick = (time: number) => lenis?.raf(time * 1000);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
  }
  const context = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        dispatchEvent(
          new CustomEvent('proposal:progress', {
            detail: { progress: self.progress },
          }),
        );
      },
    });
    if (desktop)
      gsap.to('.sculpture-stage', {
        y: 90,
        rotation: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });
    gsap.fromTo(
      '.timeline-fill',
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-track',
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.5,
        },
      },
    );
    gsap.fromTo(
      '.flow-bridge span',
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.payment-flow',
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.5,
        },
      },
    );
    gsap.fromTo(
      '.agreement-cover',
      { rotateY: -12, rotateZ: -7, y: 45 },
      {
        rotateY: -3,
        rotateZ: -3,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.agreement-invitation',
          start: 'top 95%',
          end: 'center center',
          scrub: 0.6,
        },
      },
    );
  });
  cleanup = () => {
    context.revert();
    if (lenis) {
      gsap.ticker.remove(tick);
      lenis.destroy();
    }
  };
}
setupMotion();
addEventListener('proposal:motion', setupMotion);
addEventListener('pagehide', () => cleanup?.(), { once: true });
