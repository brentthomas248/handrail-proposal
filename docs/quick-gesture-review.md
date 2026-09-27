# Independent review of prompt gesture commitment

Verdict: **accept this candidate for the revised scroll interaction**. A single small input now commits promptly to one concrete scene while further same-direction input is absorbed. The previous release-only behavior reproduced the user's complaint. No material input-effort, arrival, fold-continuity or reading-composition finding remains in this bounded review.

Reviewed 27 September 2026. This is not a new whole-design score or physical-device certification. The previous magnetic review's timing verdict is superseded by the user's clarified requirement and this direct comparison.

## Initially reviewed candidate and method

The initial local review served the same candidate through its latency and complete-journey captures. The final navigation follow-up below supersedes its source/build identity:

- `src/scripts/motion.ts` SHA-256: `dc17c3cf371e815b271b7be40e7d0688ffbba27f35258f65de39309ae7ed2f7a`
- `src/scripts/tour-path.ts` SHA-256: `04c348e0aa41c96b3c366e533427cb24d33568870501c73e55a3df509ee34817`
- `dist/index.html` SHA-256, before and after the complete journey: `3183dd26f1a73d4945e16ca8ed7e7990dd767080560a136a657fde5f8481af4b`

The independent reviewer read the current design, approved local workflow, previous magnetic review and existing Telescope/Igloo/Exat/Stripe Press and motion research. Application code and regression tests were not edited by this reviewer. Lifecycle routing and runtime-safety validation passed for this bounded review. Stagehand and Browserbase remain omitted with the existing local authorization.

An isolated headless Chromium comparison delivered actual browser wheel events and Chromium CDP native touch events. It distinguished a solitary one-pixel wheel event, twenty one-pixel events in a continuing burst, a 35px touch drag released immediately, and the same drag held for another second. Per-frame native position and camera transforms were recorded. Timing begins before input delivery, not at release. The candidate probe waited for an actually stable camera and native position before each scenario.

A separate headed journey traversed every concrete stop forward and backward at 1440×1000, 390×844 and 320×568, with device scale factor 1. Desktop travel used one-pixel wheel events; phone travel used native 35px touch gestures. Exact chapter-button positions supplied reading-pose references. Text-node Range rectangles were checked against the actual header/control safe area. Original arrival PNGs, recorded video and extracted unfolding/crease frames were inspected separately for composition and physical continuity.

The latency probe ran without the owner's compatibility browsers. The later phone composition capture overlapped the owner's browser suite. No FPS or isolated rendering-performance claim is derived from that overlap.

## Why the published interaction failed the intent

The baseline continuous-wheel desktop probe did not begin meaningful travel greater than 50 native pixels until approximately 1.80 seconds, after its input burst ended at 1.70 seconds. The camera continued changing through 3.18 seconds. The phone wheel burst similarly postponed meaningful travel until 1.76 seconds and camera completion until 2.89 seconds.

A release-only timer treated continued attempts to advance as a reason to postpone commitment. Isolated tiny-gesture tests proved eventual completion after release, but did not prove that ongoing input felt responsive. This explains why the prior passing tests and review did not settle the user's reported problem.

One initial baseline held-touch row started before a long chapter-navigation animation had finished. That row is retained in the raw evidence but excluded from conclusions and comparisons. The candidate harness uses observed stability; all its scenarios start at the exact Cash flow stop.

## Promptness and effort

The table reports observed local timings from first input to meaningful movement and concrete native arrival. Native arrival and the final camera pose coincide in the candidate; no additional spring tail was observed.

| Input                               | Published baseline                                                        | Candidate                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Desktop continuing tiny-wheel burst | Meaningful movement at 1,798ms; last changing camera transform at 3,181ms | Meaningful movement at 64ms; arrival at 597ms, although the burst continues to 1,797ms   |
| Phone continuing tiny-wheel burst   | Meaningful movement at 1,755ms; last changing camera transform at 2,889ms | Meaningful movement at 30ms; arrival at 464ms, although the burst continues to 1,761ms   |
| Desktop solitary one-pixel wheel    | Meaningful movement at 208ms; last changing camera transform at 1,608ms   | Meaningful movement at 31ms; arrival at 564ms                                            |
| Phone solitary one-pixel wheel      | Meaningful movement at 190ms; last changing camera transform at 1,340ms   | Meaningful movement at 30ms; arrival at 463ms                                            |
| Phone short drag, immediate release | Meaningful movement at 606ms; last changing camera transform at 1,723ms   | Meaningful movement at 147ms; arrival at 580ms                                           |
| Phone short drag, held after moving | Invalid baseline row excluded                                             | Meaningful movement at 146ms; arrival at 579ms, before the finger is released at 1,332ms |

The same-direction bursts reached one adjacent scene and remained there while input continued. Every sampled position in all six candidate probes was monotonic toward its destination, with no overshoot or automatic next-scene jump. The difference is visible in behavior: movement is the command to advance, rather than repeated physical effort to traverse a long scroll range.

The measured touch onset includes browser recognition and the five incremental touch moves. These timings are local observations, not physical iPhone or field guarantees.

## Complete journey and visual judgment

All **40 forward/reverse concrete arrivals** reached their intended poses. The 31 named reading arrivals exactly matched independently measured chapter positions. The remaining nine overview/fold arrivals returned to matching opened positions or the exact 0px folded packet, with the expected wing orientation and resting caption. Every arrival retained the same position and transforms during the subsequent idle check.

No measured primary line crossed the header/control or horizontal safe boundary across 479 text-line rectangles, including repeated reverse visits. Visual inspection confirms complete headings, explanations and qualifications at the reading stops. The short phone Cash flow scene remains dense, but keeps the installment premise, dollar comparison, collection rule and before-costs qualification together. Both proposed rates retain their rationale and common terms. The window and closing retain complete ideas.

The quicker unfolding still establishes all three panels before approaching the cover. The video frames show connected wings and the alternating folds; the camera follows the physical crease when crossing to the rate panel. Arrival is firm without a second easing tail or a bounce. Same-panel changes remain quieter. Peripheral print may crop during travel, while primary text is complete at the reading stops. The new timing does not turn the journey into disconnected slide swaps.

A one-pixel reverse input delivered during the Cash flow departure returned to the exact Cash flow pose at all three sizes. Read normally remained operable during flight in all three contexts; a subsequent 35px wheel input produced exactly 35px of native document travel. No page error was recorded.

No further camera-duration or path-distance change is requested by this review. The input model now resolves the repeated-scroll problem without changing the approved reading compositions.

## Evidence and closeout

Commands completed with exit 0:

- `node qa-artifacts/quick-gesture/reviewer/probe.mjs baseline`
- `node qa-artifacts/quick-gesture/reviewer/probe.mjs candidate`
- `node qa-artifacts/quick-gesture/reviewer/journey.mjs candidate`

Generated evidence remains ignored under `qa-artifacts/quick-gesture/reviewer/`:

- `baseline/summary.json` and individual raw timing files preserve the original delayed response and excluded held-touch row.
- `candidate/summary.json`, six scenario timing files, arrival images and WebM files prove prompt commitment and one-stop latching.
- `candidate-journey/results.json` records stable candidate hashes, all exact arrivals, complete-line bounds, reversals, native reading escape and runtime errors.
- Each journey viewport contains original forward/reverse arrival PNGs and recorded video.
- `candidate-journey/phone/unfold-*.png` and `orbit-*.png` are extracted video frames through the initial reveal and crossed crease; `contact.png` indexes the journey.

Publication, full compatibility checks, hosted-byte verification and other engine results remain the integration owner's separate evidence. This bounded pass does not re-certify PDFs, high-DPR resources, keyboard accessibility, physical Safari address-bar behavior, real trackpad inertia, physical iPhone stability, manual VoiceOver or field performance. No whole-site 95/100 score or cloud lifecycle completion is claimed.

## Final navigation follow-up

**Accept the final candidate after the arrival-navigation correction.** The owner's broader compatibility run exposed two canceled-shortcut cases where the camera returned correctly but the selected Cash flow button remained outside the phone strip. The follow-up requests reconciliation after a committed flight completes. It does not change the measured gesture thresholds, flight duration, camera path or reading poses.

A fresh independent headed run reproduced the same sequence at 390×844 and 320×740: land on Cash flow, start the distant Grow together shortcut, give a one-pixel reverse wheel as soon as native travel begins, wait for the returned camera pose and another 600ms. Both returned to the exact Cash flow position, kept the current button fully visible and recorded no page error. The original screenshots were visually inspected; the complete Cash flow composition and controls remain intact.

| Viewport | Exact Cash flow position | Current button bounds | Available strip bounds |
| -------- | ------------------------ | --------------------- | ---------------------- |
| 390×844  | 2,500px                  | 156.75–232.51px       | 18–372px               |
| 320×740  | 2,192px                  | 121.75–197.51px       | 12–308px               |

Final identity:

- `src/scripts/motion.ts` SHA-256: `01d6d72b442ba2e534571f247cf5e06cf05146249dc9cae481d53d0e9c096f77`
- `src/scripts/tour-path.ts` SHA-256: `04c348e0aa41c96b3c366e533427cb24d33568870501c73e55a3df509ee34817`
- `dist/index.html` SHA-256: `f9494650aaf9a794820bd615ed4dcd44a86c25c149566ca7f579dbfa365ca35a`

Command: `node qa-artifacts/quick-gesture/reviewer/nav-delta.mjs` — exit 0. Evidence: `arrival-nav/results.json`, `cancel-390.png`, `cancel-320.png` and both fresh videos under the reviewer artifact directory. The owner separately reports all eight current opening-geometry tests passing at their unchanged thresholds, covering 364 sampled frames without clipping; this reviewer did not rerun or claim authorship of that check.

The initial isolated timing measurements remain tied to the preceding hashes and were not re-profiled after the bounded navigation correction. Current navigation captures ran alongside compatibility checks, so no performance assertion is based on them. No further change is requested by this independent delta review.
