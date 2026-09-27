# Immediate gesture completion

Status: locally verified; publication pending.

Finding QUICK-01: the user still experiences excessive effort and delayed magnetism. The previous release waits for native input and momentum to stop, cancels the pull on every wheel delta and blocks it while a finger is held. Tests established eventual completion but did not prove prompt commitment during ongoing input.

The revised contract is one short vertical gesture per adjacent concrete scene. Wheel intent commits immediately; a short vertical finger movement commits while held. Same-direction inertia cannot restart the flight or chain to another scene. Reverse intent may redirect. A controlled magnetic flight uses one easing owner and completes in roughly half to eight-tenths of a second. Existing fold geometry, reading compositions and bounded paper surfaces remain. Normal reading, horizontal chapter navigation, taps and pinch zoom keep their native behavior. Programmatic, keyboard and scrollbar movement retain a quick settling fallback.

Scope: motion input and timing in `src/scripts/motion.ts`, adjacent anchor selection in `src/scripts/tour-path.ts`, behavior tests and current release records. No business copy, material, dependency or PDF changes.

Acceptance: failing baseline for prompt movement during sustained wheel input and held touch, then passing new gesture tests; focused existing interaction/accessibility/framing checks; typecheck, unit tests, formatting and build; independent current rendered comparison at desktop and two phone sizes; exact hosted bytes and live gesture checks before final completion. The approved local workflow applies. Physical iPhone playback is not established by emulation.

Browser input references: [MDN event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) documents explicit non-passive listeners for cancelable input; [MDN touch action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) describes native pan/zoom ownership. Prevent native defaults only for claimed vertical tour gestures, without blanket disabling browser zoom or ordinary reading.

## Verification

Three promptness/held-touch regressions failed against the previous release. The continuing-wheel comparison reproduced approximately 1.8 seconds before meaningful movement; the revised candidate began moving in 64ms and arrived in 597ms while that input continued. Native short-touch arrival completed before release. These are isolated browser observations, not physical iPhone guarantees.

The first full Chromium run passed 203 of 206 checks. One cold-opening capture supplied 20 moving frames against the unchanged requirement of more than 20 under concurrent browser load. The isolated final geometry run passes all eight checks, with 25/26/25/25 cold frames across four viewports and zero clipped panels in 364 complete opening/reversal frames. No fit, frame-count or zoom threshold was reduced.

The other two failures exposed a chapter-strip reconciliation defect: interrupting a chapter shortcut could leave the actual selected phone chapter offscreen. Completing a gesture now reconciles the active button's visibility without overriding deliberate horizontal navigation or keyboard focus. Both original assertions remain. All 25 final focused Chromium checks and all 18 supplementary WebKit checks pass without retries. Fresh independent captures at both affected phone sizes accept the corrected navigation and complete composition.

The independent comparison and complete journey in [the rendered review](quick-gesture-review.md) accept the prompt gesture model: all 40 forward/reverse arrivals reached their intended stops, and all 479 primary text-line rectangles stayed in the measured safe area. Same-direction momentum cannot cause another transition. The camera path, fold geometry, approved text and paper materials are unchanged.

Typecheck covers 47 files with zero issues; all 34 unit tests, formatting, diff checks and the production build pass. The final 28-file identity is recorded in `agentic-ui/local-verification.json`. The complete 206-case run and its original failures remain separate from the passing final scoped runs. Physical iPhone playback remains unverified.
