# First-opening motion refinement

Status: independently reviewed, published and verified. The previously published whole-site design review remains historical evidence.

## Finding OPEN-01

The user reports a choppy first opening and approves the rest of the page. Scope is the initial folded packet through the full three-panel reveal. Copy, materials, later camera travel, reading poses, resume and public profile are unchanged.

The opening independently fits seven equally spaced fold poses. On a 390 × 844 phone, camera scales are .416, .390, .374, .254, .194, .173 and .166. One segment contracts 32% after two mild contractions. Desktop scales reverse direction twice. Continuous cubic interpolation prevents a positional discontinuity but preserves this uneven zoom pacing. This is a confirmed choreography defect; it is not proof of the user's physical-device frame rate.

Cold headed Chromium and desktop WebKit were measured separately from the warmed tour. On this Mac, first-traversal rAF maxima were 16.7 ms Chromium, 25.3 ms with sixfold CPU throttling, and 39 ms WebKit; warm traversal maxima were 10.3, 18.3 and 19 ms respectively. No first-traversal long task appeared. These results do not reproduce persistent device frame dropping. Raw traces and samples are ignored under `qa-artifacts/opening-smoothness/before/`.

## Remediation batch

- Owner: root; independent source investigation: opening_investigation.
- Proposed change: one deliberately paced, monotonic camera pullback during the opening, independent of each pose's instantaneous fitting extrema. Keep the original hinge rotations and verify the entire physical object fits continuously.
- Expected files: `src/scripts/motion.ts`, `tests/e2e/fold-opening.spec.ts`, this record and current handoff receipts.
- Non-goals: new renderer, more resident paper textures, changed commercial content, revised reading scenes or whole-site redesign.
- Regression: a fresh-context first traversal with no chapter-navigation warmup must maintain all-panel framing, never reverse the dolly, and keep local logarithmic scale change proportionate to hinge travel rather than surging in the middle.
- Verification: `pnpm check`, `pnpm test`, `pnpm build`, focused Playwright opening/motion and mobile-budget tests; cold headed first/reverse/warm profiling; independent current rendered review; deployed asset and browser verification.
- Acceptance: visible compact fold opening into three complete panels; smooth continuous pullback; immediate reversal; approved later reading positions preserved; 64 MiB/4096-device-pixel bounds retained. No physical-iPhone claim without physical evidence.

## Result

The opening now uses one logarithmic pullback that eases toward its final spread. The fold angles, camera orbit, input ownership and later reading poses remain unchanged. Twenty-six of 28 output files remain byte-identical; only the scene module and its reference in the main HTML change.

All four new cold-opening tests failed against the published app for zoom reversals or a concentrated zoom surge. After the change, all eight opening checks pass across 1440 × 1000, 390 × 844, 390 × 664 and 320 × 740. Another 26 focused interaction, crease rhythm, reversal, viewport and high-density budget checks pass. Typecheck covers 45 files with no issues; all 29 unit checks, formatting and the production build pass.

On an isolated repeat of the same headed cold/reverse/warm probe, the phone's peak zoom change per hinge degree dropped from 3.24 times its opening average to 1.89. First-traversal rAF maxima were 17.1 ms Chromium, 25.0 ms at sixfold CPU throttling and 18 ms WebKit, with no first-traversal long tasks. The throttled loading phase still contains initialization tasks before the camera is ready. These small laboratory samples establish the pacing change and observed playback, not a guaranteed physical-device frame rate or a general renderer speedup.

Two additional Chromium fast-flick/native-touch checks and all eight WebKit opening checks pass, for 36 targeted Chromium checks and eight WebKit checks. The [independent rendered review](opening-smoothness-review.md) accepts the current opening after five viewport captures, original/candidate comparison and 1,182 unclipped opening samples. Published source `9cb065782302c80027bb8a2bb0d54de3b76f9426` as static `d4eb34c32a371574426b914ace5681aad82ad2d4`. [Pages run 36351226460](https://github.com/brentthomas248/handrail-proposal/actions/runs/36351226460) succeeded. All 28 hosted assets match the frozen candidate, and all 11 scoped hosted checks pass without retries in 36.4 seconds.
