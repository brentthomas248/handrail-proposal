# Independent art direction and material quality review

Date: 27 September 2026. Category: **Art direction and material quality**. Result: **98/100**. One minor finish finding; no observed P0, P1 or P2 defect in this specialty's reviewed scope. The integration owner retains the release decision.

## Candidate and independence

Reviewed the frozen candidate at `http://127.0.0.1:4321/handrail-proposal/`. Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`. All **28/28** served files in `qa-artifacts/final-design/candidate-v8/identity.json` matched both before and after the review. Receipts: [before](../../qa-artifacts/final-design/r8/art/identity-before.json), [after](../../qa-artifacts/final-design/r8/art/identity-after.json).

Read the assigned task, AGENTS.md, PROJECT.md, DESIGN.md, local-workflow.md, neutral final-review brief, redesign-research.md and brand-sources.md. No earlier reviews, scores, remediation records, peer findings or IMPLEMENTATION.md were read. No app edits, rebuilds, commits or publication occurred. Only this report and the assigned ignored evidence directory were written. Every browser launched by this review was closed.

## Evidence and scope

Used isolated **headed Chromium** with local Playwright. Captured every chapter, including the folded packet, at the five required CSS viewports:

| CSS viewport | DPR | Evidence |
| --- | --- | --- |
| 1440 × 1000 | 1 | [Desktop captures](../../qa-artifacts/final-design/r8/art/1440x1000/) |
| 390 × 844 | 3 | [Phone captures](../../qa-artifacts/final-design/r8/art/390x844/) |
| 320 × 740 | 3 | [Small-phone captures](../../qa-artifacts/final-design/r8/art/320x740/) |
| 390 × 664 | 3 | [Short-phone captures](../../qa-artifacts/final-design/r8/art/390x664/) |
| 768 × 1024 | 1 | [Tablet captures](../../qa-artifacts/final-design/r8/art/768x1024/) |

DPR3 phone files contain three device pixels per CSS pixel. They are not evidence of a physical phone. Inspected original PNGs, including full-resolution phone originals; no contact-sheet judgment or rescaled derivative was used as the sole evidence. Selected originals covered opening back, full spread, normal reading poses, thin edges, crease transitions and reverse travel.

Executed complete native wheel journeys forward and backward at desktop and phone dimensions. Each journey recorded 180 input/state samples and independent video plus selected transition screenshots. Desktop traveled from 0 to 7713 CSS scroll pixels and back to 0; phone traveled from 0 to 6836 and back to 0. The sampled camera transform changed between all successive input samples. This supports actual travel and reversal; it is not an FPS or physical-touch certification. Evidence: [desktop journey](../../qa-artifacts/final-design/r8/art/motion-1440/), [phone journey](../../qa-artifacts/final-design/r8/art/motion-390/).

The [three-panel reveal](../../qa-artifacts/final-design/r8/art/motion-1440/forward-07.png) shows the complete object before the close approach. The [phone spread](../../qa-artifacts/final-design/r8/art/motion-390/forward-07.png) preserves that introductory spatial reading. The [reverse crease view](../../qa-artifacts/final-design/r8/art/motion-390/reverse-64.png) keeps the two visible surfaces joined, with coherent material and no glossy effect.

Performed a fresh desktop session with 2.5-second waits after settling to reproduce the finish concern. Also inspected ordinary reading's rate composition as a sharpness comparison. Evidence and scripts are under [r8/art](../../qa-artifacts/final-design/r8/art/).

## Reference basis

Independently rendered current public [Telescope](https://telescope.fyi/), [Igloo](https://www.igloo.inc/), [Exat](https://exat.hottype.co/), [Stripe Press](https://press.stripe.com/) and [Handrail careers](https://handrail-daas.com/careers). Opening and short-scroll captures are in [references](../../qa-artifacts/final-design/r8/art/references/); these are bounded reference inspections, not audits of those sites. Consulted the primary [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) for readable hierarchy and grouping. Private supplied documents were not accessed; their influence is understood only from the authorized public repository provenance.

The proposal translates the approved ideas appropriately: an overview-to-detail object journey, large editorial type, one continuous spatial composition and tactile printed surfaces. Handrail's wordmark and cream/rust/ink palette remain dominant. The accepted references justify those principles, not imitation of their artwork, glossy books or visual effects.

## Scores

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Identity and distinction | **20/20** | The actual Handrail mark, warm stock, rust collections face and black display type form a coherent, recognizable proposal. The serif introduction creates a deliberate editorial contrast. The object itself supplies distinction without ornamental effects or generic card layouts. **No deduction.** |
| Paper/edge/crease realism | **20/20** | Grain is quiet at reading distance and visible in closer high-density captures. The visible thin warm edge and narrow crease shading establish a folded sheet rather than a thick plastic card. Front/back changes retain plausible paper coloration; both hinges remain attached through observed transitions. This is a restrained stylized sheet, which meets the brief. **No deduction.** |
| Light and shadow coherence | **20/20** | Soft warm ground shadows follow the projected object through folding and reversal. Orientation changes vary face darkness without glossy streaks or moving decorative light. Creases provide localized depth without a dark border around every face. Essential ink retains contrast. **No deduction.** |
| Composition and visual hierarchy | **20/20** | The compact packet establishes one object; the unfolded spread makes its three-panel construction clear. Reading poses make the active idea dominant. The rust cash-flow panel carries the numerical argument, paired rates compare cleanly on desktop, and phone scenes retain the related rationale and shared terms. Window and closing groups use quiet space without exposing unrelated fragments as the principal focus. **No deduction.** |
| Finish across viewport sizes | **18/20** | All five sizes preserve the reviewed reading groups and visual hierarchy. DPR3 phone ink and edges are clean. DPR1 desktop has reproducible softness at several settled reading faces and rougher raster edges on the opening back, reducing the polished printed impression. **−2 for R8-ART-01**, a noticeable but minor finish weakness; no second deduction for the same effect elsewhere. |
| **Total** | **98/100** | **100 − 2 = 98.** |

## Finding

### R8-ART-01 — P3 minor: inconsistent low-density ink sharpness

**Observed impact.** At 1440 × 1000, DPR1, the settled Cash flow and The two paths faces look visibly softer than the fixed header and the ordinary reading text. The opening back's headline has comparatively rough, stair-stepped edges. This makes the physical document look rasterized rather than cleanly printed. Terms remain readable, and I did not observe missing letters, incorrect amounts or a blocked reading group. Accordingly, this is P3, not a material readability failure.

**Evidence.** Original [cash-flow landing](../../qa-artifacts/final-design/r8/art/1440x1000/02-cash-flow.png), [rate landing](../../qa-artifacts/final-design/r8/art/1440x1000/03-the-two-paths.png), and [opening](../../qa-artifacts/final-design/r8/art/1440x1000/00-folded.png). Reproduced in a fresh browser after an additional 2.5 seconds: [cash flow](../../qa-artifacts/final-design/r8/art/recheck/cash-flow-delayed.png), [rates](../../qa-artifacts/final-design/r8/art/recheck/the-two-paths-delayed.png), [opening](../../qa-artifacts/final-design/r8/art/recheck/folded-delayed.png). Compare [ordinary reading](../../qa-artifacts/final-design/r8/art/recheck/reading-mode.png), which has crisper letter edges. The comparison concerns raster finish; the two modes intentionally use different layout and type sizes.

**Reproduction.** In headed Chromium, use a 1440 × 1000 CSS viewport with deviceScaleFactor 1. Load the candidate, inspect Overview, then select Cash flow and The two paths. Let both native scroll and camera transforms settle; wait another 2.5 seconds. Inspect the original 1:1 captures. The effect persisted across two independent browser sessions, so it was not just a screenshot taken during motion.

**Bounded correction.** Investigate raster scale and fractional projection at the DPR1 reading poses, then make the smallest adjustment that improves ink sampling. Keep the current layouts, material paint, high-density surface budget and continuous camera path. Do not solve it by blurring decorative layers, raising all backing resolutions indiscriminately or flattening the whole tour. The rendered evidence identifies the defect; the exact compositor cause is unproven and needs an implementation-side experiment.

**Recheck.** Repeat the three DPR1 poses in headed Chromium and compare original PNGs at 1:1 with the current evidence; verify clean letter edges after settling and in forward/reverse travel. Recheck 768 × 1024 DPR1 and 390 × 844 DPR3 for regressions, retaining the existing surface budget. A native-window capture can further distinguish compositor output from the capture path before choosing a larger rendering change.

## Non-findings and limits

Perspective distortion, tiny type in the introductory full spread and temporary peripheral crops during traversal are intentional object-tour behavior, not defects. The complete ideas are available in face-on reading scenes. The visible softness finding is separate from the documented headless missing-paint anomaly: this review used headed Chromium and reproduced the result, but did not independently certify every native display/compositor combination.

This review does not establish physical iPhone stability, mobile browser-chrome behavior, Safari/WebKit rendering, manual VoiceOver behavior, touch ergonomics, FPS, memory limits or field performance. No claims about those are inferred from screenshots. Notes, resume, PDFs and the GitHub destination were outside this bounded material specialty inspection. Ordinary reading was sampled at the rate section rather than fully audited. Keyboard/no-JS/reduced-motion behavior belongs to the corresponding independent specialties.

Used Agentic UI lifecycle/QA guidance within the repository's explicitly approved local workflow. Credentialed Stagehand, Browserbase, Stitch and Magic remained omitted under that authorization. The generic router classified the task as a narrow UI route; this report follows the explicit frozen-candidate review contract and contains no generation or implementation claim. The next action is integration of this independent result, with any optional P3 refinement assessed against its rendering cost. Candidate remained unchanged: **28/28 ending hashes match**.
