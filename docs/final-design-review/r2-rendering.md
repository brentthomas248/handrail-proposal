# Rendering and animation engineering — fresh round 2

Independent assessment: **97/100**. No P0–P2 defect was established in this bounded rendering review. Two P3 refinements remain: a small repeatable raster miss during motion and the silent initial wait on failed or stalled loading. This is a local engineering assessment, not physical-device certification.

## Candidate and scope

- Reviewed 27 September 2026, approximately 10:18–10:28 America/Chicago.
- Frozen candidate: `http://127.0.0.1:4321/handrail-proposal/`, candidate identified as 27Sep10:07 by the coordinator.
- Fetched HTML SHA-256: `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33`, matching `qa-artifacts/final-design/candidate/identity.json`. Motion bundle in that manifest: `index.astro_astro_type_script_index_0_lang.BYCBN0DB.js`.
- Headed Chromium **153.0.8010.12**, isolated Playwright contexts on this ARM64 Mac. All contexts requested DPR 3. Measured full forward/reverse wheel traces at **390×844** and **1440×1000**; separate layer sweeps at **320×740**, **390×664**, and **768×1024** as well. Inspected original opening, closing, resumed and fallback captures.
- Read the assigned neutral instructions/design documents and current rendering source. Did not read prior reviewer reports, scores, remediation records or implementation commentary. Did not edit the app, rebuild, commit or publish.
- Applied Agentic UI lifecycle/QA routing under the expressly approved local workflow. No credentialed service was used or implied.

Evidence is under `qa-artifacts/final-design/r2/rendering/`. Reproduction scripts: `calibrate.mjs`, `assess.mjs`, `layers.mjs`, `resilience.mjs`, `repeat.mjs`, and `summarize.mjs`. Run each with `node` from the repository root against the already running frozen candidate. Scripts write only this evidence directory and close their browser instances.

## Score

| Criterion | Score | Exact basis |
| --- | ---: | --- |
| Actual frame delivery | **19/20** | Stable local display cadence, no measured display gap over 25 ms, and no ongoing idle rendering. **−1** for repeatable missing-raster frames in Chromium's frame tracker, REN-R2-01. |
| Bounded memory/layers | **20/20** | Calibrated drawn-paper estimate stays below 64 MiB and 4096 device px across all five sizes. Only three drawn paper layers are retained through the sweeps. Warm repeated mode changes do not accumulate nodes/listeners. No actionable budget failure observed. |
| Load stability | **18/20** | Clean normal loading; no-JS, blocked script, blocked fonts, delayed fonts, unavailable WebGL and unavailable/throwing property registration all retain or recover a reading path. **−2** for hiding both proposal and reading control during a silent four-second failure/stall window, REN-R2-02. |
| Resize/background/reversal resilience | **20/20** | Forward/reverse input, rapid reversal, height change, breakpoint crossing, canceled touch ownership and lifecycle freeze/resume complete without a stuck scene or lost reading path. No actionable failure observed within these tests. |
| Implementation simplicity and evidence completeness | **20/20** | Semantic HTML, a single camera ticker, pure path math, and native scroll implement the requested effect without a second renderer or scroll library. Ticker termination is measured. Current-source inspection and fresh traces support this assessment; its limits are explicit. No refactor is proposed solely for file length. |
| **Total** | **97/100** | Deductions above are independent of any desired release score. |

## Frame delivery and idle work

Each motion profile applies 100 forward and 100 reverse native wheel inputs over approximately ten seconds. The first run was performed while other independent reviews were permitted on the host. A focused phone repeat followed a request for reviewer browser inactivity; the motion reviewer closed its Chromium instance and the interaction reviewer confirmed inactivity. The root reported no browser work. This was the only repeat, justified by the initial raster flags, rather than an attempt to select a better score.

| Measure | Phone initial | Desktop initial | Phone focused repeat |
| --- | ---: | ---: | ---: |
| Compositor DrawFrame events | 1,199 | 1,195 | See retained trace |
| Viz Display::FrameDisplayed events | 1,199 | 1,195 | 1,199 |
| Unique displayed timestamps | 1,083 | 1,081 | 1,078 |
| Display interval p99 | 16.667 ms | 16.667 ms | 16.667 ms |
| Maximum display interval | 25 ms | 25 ms | 16.667 ms |
| DroppedFrame diagnostic events | 6 | 7 | 5 |
| Completed RAF tracker: missing raster / expected frames | 4 / 601 | 6 / 601 | 6 / 600 |

The display events include duplicate timestamps, so their raw count must not be presented as 120 distinct delivered frames per second. DrawFrame, displayed timestamps, and the RAF tracker are reported separately. The RAF tracker's completed window covers about five seconds; the trailing tracker has no completed counters and was not included in its ratio. These are browser presentation diagnostics, not camera-recorded physical display proof.

Initial compositor draw-interval p99 was 10.055 ms phone and 10.230 ms desktop. Phone/desktop paint-event p99 was 0.264/0.382 ms; layout-event p99 0.239/0.275 ms; style-event p99 0.753/1.096 ms. Painting and layout occur during the effect, so this is not a compositor-only animation. Local main-thread task time was approximately 1.08/1.39 seconds across the respective ten-second profiles, including this instrumentation.

After three seconds of settling, each 2.5-second idle trace contained **zero DrawFrame, display, paint, layout, or style events**, zero paper-subtree mutations, and zero measured script-duration increase. This is meaningful termination evidence, rather than an assumption based on ticker code.

Evidence: `phone-motion.trace.json`, `desktop-motion.trace.json`, `phone-repeat.trace.json`, both `*-idle.trace.json`, `trace-summary.json`, `results.json`, and `repeat.json`. The first traced run produced no LayerTree change samples; the empty `*-layers.json` files and null summaries from that run are not budget evidence. The dedicated, untraced layer sweeps below supply it.

## Surface budget and retention

Calibration created a 100×100 CSS-pixel composited element in a 390×844 CSS viewport. CDP reported the element as **200×200**, and the viewport/root layer as **780×1688**, while `devicePixelRatio` was 3. Thus CDP layer units on this Retina host were **2 per CSS pixel**, not one and not the requested DPR. See `calibration.json`.

The estimate is `sum((CDP width / 2) × (CDP height / 2) × 3² × 4 bytes)` over drawn paper face/back layers identified by their DOM backend node IDs. This includes the observed painted edge extent. It is an RGBA surface estimate, not allocated GPU memory.

| Viewport group | Drawn paper layers | CDP extent per paper layer | Estimated DPR-3 paper | Longest DPR-3 paper edge | Max total layer-tree nodes |
| --- | ---: | --- | ---: | ---: | ---: |
| 390×844, 320×740, 390×664 | 3 | 1200×2065 | **63.807 MiB** | **3097.5 px** | 20 |
| 768×1024, 1440×1000 | 3 | 1200×1827 | **56.453 MiB** | **2740.5 px** | 19 |

Each sweep recorded 366–370 layer-change samples. No fourth drawn paper layer appeared. The phone result passes with only approximately **0.193 MiB** of arithmetic headroom; remeasure after any print-height or material change. Header, controls, document tiling, shadows, buffering, raster scale choices and driver overhead are outside this declared paper estimate. Total layer-tree nodes include nondrawing structural layers.

After warming the tour and mode control, twelve further read/tour cycles retained **355 DOM nodes, 43 JS event listeners, two documents and 233 layout objects** before and after forced collection. JS heap changed from 2,629,548 to 2,717,584 bytes (about 86 KiB). The first cold-to-used pass included normal first-use growth, so only the subsequent warm pass supports the no-accumulation observation. This is a short retention check, not a long-duration leak or memory-pressure test.

Evidence: `layer-summary.json`, five `*-layer-sweep.json` files, `calibration.json`, `repeat.json`.

## Resilience and loading observations

- Height-only 390×844 → 390×664 preserved Client first, native scroll **3540.5**, progress **0.70859885**, and range **4996**. Crossing to 768×1024 preserved the containing rates section as The two paths; returning to phone selected Hire first within that section. The latter is the documented containing-section fallback, not exact subchapter persistence.
- A held synthetic touch deferred the stage refit; `touchcancel` released it and restored the correct 664-pixel stage while keeping the beginning chapter and scroll position. This exercises the event ownership contract, not real touch hardware or browser address-bar mechanics.
- A settled lifecycle freeze resumed at the same chapter and then accepted reverse wheel input. A freeze during chapter travel resumed at the requested closing chapter and remained stable. Fast forward input followed by immediate reverse input settled back to The beginning rather than continuing toward the stale forward destination.
- Normal tour requests returned without observed failure; no normal page errors occurred. No-JS and blocked-script recovery leave all five essential section nodes in semantic document flow. Missing typed-property support chooses reading. An injected property-registration exception also falls back to reading. Blocked fonts still allow the tour with fallback type. Fonts delayed beyond the four-second deadline leave reading intact when the module eventually finishes. Disabling canvas contexts does not prevent the CSS3D tour.

Evidence: `results.json`, `resilience.json`, `resumed.png`, `active-suspension-recovered.png`, fallback captures, and the three smaller/tablet closing captures. The regular no-JS/failure states were inspected separately from decorative face visibility in the opening tour; hidden fronts at the folded opening are expected.

## Findings

### REN-R2-01 — P3: brief missing-raster frames during unfolding

**Observed:** Chromium's completed RAF frame tracker recorded 4/601 missing-raster frames on the first phone profile, 6/601 on desktop, and **6/600** in the focused phone repeat. The repeat had zero `dropped_v4` in that tracker and no displayed gap over 16.667 ms, so successful frame scheduling alone does not establish that every frame had its paper raster ready.

**User impact:** a small risk of momentary incomplete paper paint while the first unfolding exposes content. This is a browser diagnostic finding; I did not establish a sustained visible blank or identify the exact affected text pixels. Its observed magnitude is minor and does not justify claiming a generally janky tour.

**Evidence:** `phone-repeat.trace.json`, `repeat.json`, and the initial motion traces. Current `src/scripts/motion.ts` culls the opposite face with `display:none` and updates quantized face lighting; `src/styles/global.css` paints material into faces. Those are inspection targets, not proven sole causes.

**Bounded correction:** profile the specific first-exposure raster invalidations and reduce avoidable repaint cost or schedule necessary preparation. Preserve the three-face/64 MiB budget; do not indiscriminately retain all six faces or add `will-change` layers.

**Recheck:** repeat the same cold forward/reverse trace with other reviewer browsers idle. Seek zero missing-raster flags, or provide frame-level visual evidence that any remaining bounded flags do not visibly damage the paper. Preserve the surface-budget and idle-work measurements. **Deduction: −1 actual frame delivery.**

### REN-R2-02 — P3: failed/stalled initialization leaves a silent blank area

**Observed:** with the script request aborted, at **0.519 s** and **3.257 s** the proposal sheet was hidden, the mode button remained hidden, and the body exposed only header links. There was no loading explanation. The fallback restored readable content by **4.309 s**. A deliberately delayed font load takes the same timeout path. The timeout succeeds; the unresolved issue is what the visitor sees before it succeeds.

**User impact:** a visitor on a stalled request can reasonably read the empty cream area as a broken proposal, with no immediate ordinary-reading control on this page.

**Evidence:** `resilience.json`, `blocked-script-at-three-seconds.png`, `blocked-script-after-fallback.png`; startup timeout in `src/layouts/Page.astro` and pre-ready visibility rule in `src/styles/global.css`.

**Bounded correction:** keep a small visible loading explanation and a semantic normal-reading/recovery link available before the tour module initializes, or expose the ordinary document until enhancement is ready. Preserve no-JS behavior and do not switch an already-reading visitor into the tour unexpectedly.

**Recheck:** block the module and delay fonts past five seconds. Capture the first half-second, three seconds, and recovery. The visitor should have visible status and an immediately usable reading path throughout. **Deduction: −2 load stability.**

## Limits and reference basis

No physical iPhone/Safari crash certification, actual GPU-allocation measurement, sustained thermal test, low-memory kill/recovery, field INP, manual VoiceOver, native address-bar or real finger-input proof is claimed. No WebKit performance run, network profile representative of a particular carrier, CPU-throttled device simulation or multi-hour retention run was performed. PDF/resume content, typography and commercial correctness belong to the other specialties and were not rescored here. Synthetic lifecycle freeze is narrower than operating-system app suspension and BFCache navigation.

The source inspection found one GSAP camera ticker that removes itself at convergence; the measured idle traces confirm that result. The code remains substantial (1,095 lines in `motion.ts`, plus separately scoped path, mounting and typography modules), but size alone did not establish an actionable complexity defect. The appropriate principle is to measure rendering stages and avoid gratuitous layer promotion, as described in the primary [web.dev animation performance guide](https://web.dev/articles/animations-guide) and [CDP LayerTree reference](https://chromedevtools.github.io/devtools-protocol/tot/LayerTree/). The measured calibration takes precedence over assumptions about protocol units.
