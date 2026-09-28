# Deliberate motion with immediate input

Status: locally verified; publication pending.

## Findings and scope

MOTION-01: the user reports that the first opening is still choppy. MOTION-02: the latest transitions are too fast. This supersedes the previous review's timing acceptance. The single-gesture commitment and concrete stops remain the intended interaction; reducing input effort does not require fast camera travel.

The current opening traverses 108 degrees of hinge rotation in 0.48 seconds. Its cubic ease-out covers approximately half the opening in the first 100ms. Rendering also feeds rounded native scroll coordinates back into the camera and updates painted paper lighting during motion. Isolated profiling will distinguish abrupt path velocity from measured rendering stalls.

Scope: controlled travel timing and opening rendering in `src/scripts/motion.ts`, focused behavior regressions and release evidence. Preserve approved content, paper proportions, complete three-panel opening, crease orbits, readable stops, materials, input latching, reversal, reduced motion and ordinary reading. No new dependency or PDF changes are planned.

## Acceptance and workflow

The approved local workflow applies. Root owns implementation; a separate rendering investigator profiles baseline/candidate; an independent motion critic reviews current desktop and phone video/compositions. Browser performance captures run in isolation. Device emulation is not physical iPhone certification.

Capture a failing timing baseline before changing code. Verify prompt movement separately from a longer, smoothly accelerating transition. Opening, short same-panel travel and cross-fold travel must be paced appropriately. Retain exact stops and no same-gesture chaining. Compare cold opening frame cadence and camera derivatives at phone DPR3, with throttled CPU diagnostics separately identified. If profiling exposes a paint bottleneck, address it within existing texture budgets rather than adding unbounded compositor surfaces.

Run typecheck, unit tests, formatting, build, focused wheel/touch/navigation tests, opening geometry and supplementary WebKit checks. Keep original failures and distinguish changed timing requirements from defects. Publish only after independent rendered acceptance, then verify exact deployed assets and live interaction. Update current receipts and `IMPLEMENTATION.md` at closeout.

## Results

All five new timing regressions fail against the published baseline for the reported pacing defect. The phone/desktop reveals covered 56.0%/61.8% of the fold in 120ms. Same-panel, single-crease and double-crease travel arrived in 432/435/733ms. Prompt onset already passed; it was excessive velocity rather than late gesture ownership.

The candidate keeps immediate gesture selection and the existing latch. Its first reveal takes about 1.7 seconds; complete reading transfers take about 1.1–2 seconds. Sine acceleration/deceleration replaces the steep cubic ease-out. The camera samples continuous tween position, while native scroll mirrors it for restoration and navigation. Native scroll events no longer quantize the controlled camera's target. Path geometry and all materials remain unchanged.

Isolated untraced cold captures compare phone DPR3, desktop and phone DPR3 with 4× CPU throttling. The phone's largest sampled hinge step fell from 30.01° to 1.89°, with 26 versus 100 changed frames; desktop fell from 21.33° to 2.07°, with 25 versus 102 frames. The throttled phone showed the same bounded movement. The candidate reveal lasted about 1.68–1.70 seconds.

Actual callback time and animation timestamps are recorded separately. A roughly 60ms cold phone scheduling gap remains, but the candidate moves only about half a degree during it instead of tens of degrees. No animation long task was observed in these captures. Warm-opening callback gaps peaked near 19ms. These are local Chromium observations, not evidence of physical iPhone behavior or a general rendering-throughput improvement. Paint/raster work exists; it does not justify changing the approved material or increasing compositor memory without further evidence.

Typecheck (48 files), all 34 unit tests, formatting and build pass. All eight existing opening geometry checks pass with unchanged thresholds; the cold captures contain 96–101 frames. All five new timing cases pass: measured onset is 32–84ms, with arrivals near 1.68 seconds for the opening and 1.13/1.48/1.98 seconds for same-panel/single-crease/double-crease travel.

The isolated timing/gesture/geometry run initially passed 18/20. Sparse default assertion polling missed a valid two-second arrival, and a fixed 350ms zoom check observed a legitimate nearest-pose settle before completion. Instrumented native-scroll capture proved exact endpoints at 2.5 and six seconds. Both corrected observation fixtures pass, retaining exact-stop requirements.

The wider compatibility run passed 42/44, including rendering budgets, complete forward/reverse tours, ink, framing, native touch, resize, accessibility and reading fallbacks. Its remaining tests assumed fixed distances exceeding the actual outward excursion under the slower launch. Both now measure prompt proportional reversal, retain exact destinations and speed limits, and additionally prohibit overshoot or verify exact camera/hinge restoration. Both rechecks pass. All 23 supplementary WebKit checks pass without retries. These are bounded runs plus explicit rechecks, not a claim of clean initial suites or a newly executed whole-site suite.

Independent current motion review accepts 42 correct held arrivals and 487 primary text-line rectangles across four sizes, with no clipping. Original video resolves two contradictory header screenshots as capture anomalies; those originals remain retained. No remaining material visual-motion finding was identified within the local inspected scope. Raw failures, before/after captures and traces remain ignored under `qa-artifacts/measured-motion/`.
