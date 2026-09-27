# Round 7 independent review — Art direction and material quality

**Score: 97/100.** The frozen candidate has a distinctive, coherent editorial identity and a persuasive restrained paper object. Two minor finish issues remain; no P0, P1 or P2 art-direction defect was established in this review. This is a category assessment, not full release approval.

## Candidate and independence

Reviewed the current served candidate at `http://127.0.0.1:4321/handrail-proposal/` on 27 September 2026. Main HTML SHA-256: `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4`.

All entries in `qa-artifacts/final-design/candidate-v7/identity.json` matched their served bytes before and after review, including both PDFs, document HTML, official logo, script and font assets. Receipts: [before](../../qa-artifacts/final-design/r7/art/identity-before.json), [after](../../qa-artifacts/final-design/r7/art/identity-after.json).

I read the assigned task, neutral brief, AGENTS, PROJECT, DESIGN, approved local workflow, redesign research and brand-source notes. I did not read earlier or peer reports, scores, remediation, progress records or IMPLEMENTATION.md. All candidate images used here were captured in this review. No app files, build output or publication state were changed. All browser instances launched by these scripts were closed in `finally` blocks; all three scripts completed successfully.

## Scope and evidence

Headed isolated Chromium was used for CSS3D captures. Desktop 1440×1000 and tablet 768×1024 used DPR 1. Phone 390×844, small phone 320×740 and short phone 390×664 used DPR 3. Every chapter was captured across the five sizes; original representative captures were opened for the visual judgment, rather than judging from a contact sheet.

The inspected evidence includes:

- Desktop folded packet, full spread during unfolding, all five reading stops, oblique crease travel, and forward/reverse native wheel input. See [opening](../../qa-artifacts/final-design/r7/art/1440x1000/00-opening.png), [unfolding](../../qa-artifacts/final-design/r7/art/1440x1000/motion-forward-5.png), [spread](../../qa-artifacts/final-design/r7/art/1440x1000/motion-forward-8.png), [reverse spread](../../qa-artifacts/final-design/r7/art/1440x1000/motion-reverse-60.png) and [crease travel](../../qa-artifacts/final-design/r7/art/1440x1000/motion-forward-56.png).
- High-density phone opening, beginning, collections, both rate choices, closing, unfolding and forward/reverse travel. Representative originals: [opening](../../qa-artifacts/final-design/r7/art/390x844/00-opening.png), [collections](../../qa-artifacts/final-design/r7/art/390x844/03-cash-flow.png), [hire first](../../qa-artifacts/final-design/r7/art/390x844/04-hire-first.png), [client first](../../qa-artifacts/final-design/r7/art/390x844/05-client-first.png), [closing](../../qa-artifacts/final-design/r7/art/390x844/07-grow-together.png), [unfolding](../../qa-artifacts/final-design/r7/art/390x844/motion-forward-4.png), [reverse crease](../../qa-artifacts/final-design/r7/art/390x844/motion-reverse-40.png).
- Narrow phone [beginning](../../qa-artifacts/final-design/r7/art/320x740/02-the-beginning.png), [collections](../../qa-artifacts/final-design/r7/art/320x740/03-cash-flow.png), [client first](../../qa-artifacts/final-design/r7/art/320x740/05-client-first.png); short phone [beginning](../../qa-artifacts/final-design/r7/art/390x664/02-the-beginning.png), [hire first](../../qa-artifacts/final-design/r7/art/390x664/04-hire-first.png), [window](../../qa-artifacts/final-design/r7/art/390x664/06-the-window.png); tablet [opening](../../qa-artifacts/final-design/r7/art/768x1024/00-opening.png), [collections](../../qa-artifacts/final-design/r7/art/768x1024/03-cash-flow.png), [two paths](../../qa-artifacts/final-design/r7/art/768x1024/04-the-two-paths.png).
- Ordinary-reading opening and notes/resume route openings on desktop and phone. Both downloaded PDFs were rendered with Poppler at 100 dpi and **all four pages** were visually inspected. See [document renders](../../qa-artifacts/final-design/r7/art/documents/). The two-page notes and two-page resume maintain the same restrained type, rules, rust accents and hierarchy without forcing the tour's texture into long-form print.

Native scrolling was real `mouse.wheel` input: 65 increments of +120 followed by 65 of −120 at each of desktop and phone, with 70 ms intervals and bounded intermediate screenshots. This was not a series of `scrollTo` endpoint substitutions. [Desktop metadata](../../qa-artifacts/final-design/r7/art/1440x1000/motion-meta.json) and [phone metadata](../../qa-artifacts/final-design/r7/art/390x844/motion-meta.json) record scroll positions and video paths. Videos are retained for replay; the judgment here used the inspected original frames from those live sequences, not a claim of frame-by-frame performance analysis.

## Scores

| Criterion | Score | Exact rationale and deductions |
| --- | ---: | --- |
| Identity and distinction | **20/20** | The official logo, warm paper/ground, rust collections face, compressed bold sans-serif hierarchy and short italic introduction form one recognizable Handrail document. The visual interest comes from the actual folding proposal. It follows the approved overview-to-detail, large-type and physical-document principles without borrowing another reference's artwork. No actionable identity defect found; no deduction. |
| Paper/edge/crease realism | **20/20** | The closed packet has a legible front/back relationship and thin edge; opening establishes three connected panels. Fine grain is quiet at reading distance, detectable in original DPR 1 close reading, and does not become coarse decoration on DPR 3 phones. Hinges remain visually joined and crease shading is restrained. No glossy-card or metallic treatment observed. No actionable material-geometry defect found; no deduction. |
| Light and shadow coherence | **20/20** | Diffuse face tone and restrained crease darkening keep orientation legible. Soft shadows move with the unfolding footprint and retain visual separation from the ground. The sampled folds, near-flat spread and reverse travel show no conflicting bright streak, drifting decorative illumination or dark outline halo. No actionable light/shadow defect found; no deduction. |
| Composition and visual hierarchy | **19/20** | The headline, collections example, rate figures and window retain distinct priority; phone rate scenes include rationale and common terms. Document pages continue the system. **−1 for ART-R7-02:** the desktop rate stop leaves an accidental sliver of the next heading directly above the bottom controls. |
| Finish across viewport sizes | **18/20** | All inspected primary reading groups remain legible and complete at the core sizes; high-density phone print is notably clean and the matte surface stays quiet. **−2 for ART-R7-01:** desktop DPR 1 reading-stop ink has a noticeable soft raster edge, reproduced after settling and 1.5 seconds of further inactivity. This is a localized finish weakness, not lost content. |
| **Total** | **97/100** | Two P3 findings; deductions are not repeated across criteria. |

The accepted-reference assessment follows the explicitly approved roles in [redesign research](../redesign-research.md): Telescope's overview-to-detail structure, Igloo's continuous object space, Exat's purposeful scale hierarchy, and Stripe Press's physical document/reading relationship. I did not perform a new comprehensive audit of those external sites. The [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) was checked live for readable effective size, grouping and whitespace; it informs the judgment rather than imposing a single body size on every cinematic pose. The Handrail careers web-reader request failed; this review therefore relies on the authorized local logo, verified logo hash and supplied public brand-source record for that provenance, not a claim of fresh careers-page visual inspection.

## Findings

### ART-R7-01 — Slightly soft essential print at desktop reading stops

**P3 minor. Confidence: high for observed appearance; cause not established.**

At 1440×1000, DPR 1, “The two paths” body text and headings have visibly softened contours compared with the stable header UI and the ordinary reading document. White collections text also has a softened edge. All terms remain legible; the impact is a less crisp printed-object finish precisely where the tour asks the reader to stop and inspect the proposal.

Evidence: [first two-path capture](../../qa-artifacts/final-design/r7/art/1440x1000/04-the-two-paths.png), independent new-browser [paths after settling plus 1.5 seconds](../../qa-artifacts/final-design/r7/art/recheck/paths-idle.png), [cash after settling plus 1.5 seconds](../../qa-artifacts/final-design/r7/art/recheck/cash-idle.png), and [ordinary reading comparison](../../qa-artifacts/final-design/r7/art/1440x1000/normal-reading.png). High-density [phone rate ink](../../qa-artifacts/final-design/r7/art/390x844/05-client-first.png) is cleaner. This is headed Chromium evidence; it is not the known headless missing-paint anomaly. It remains engine/DPR-specific evidence, not proof that every browser has the same weakness.

**Bounded correction:** inspect the composed raster scale and pixel alignment at the exact DPR 1 reading poses. Preserve the authored text and high-density surface budget; seek a final face/camera transform or raster allocation that avoids resampling the essential ink at rest. Do not add sharpening effects, thicken every font or broadly enlarge composited surfaces to mask it.

**Recheck:** repeat headed Chromium DPR 1 desktop reading stops after full settlement and 1.5 seconds idle, inspect originals against same-size document text, then verify that phone DPR 3 print and the existing surface budget have not regressed. If native-window/cross-engine evidence establishes that this is only a capture artifact, record that evidence and dismiss the defect.

### ART-R7-02 — Partial next heading peeks into the desktop rate composition

**P3 minor. Confidence: high.**

At 1440×1000, “The two paths” leaves only the top of the following “90” figure visible at the very bottom of the paper before the fixed control strip cuts it off. The two rate choices themselves are complete. The impact is a small, unexplained black fragment at the focal composition's lower edge, making that otherwise finished stop look accidentally cropped.

Evidence: [initial stop](../../qa-artifacts/final-design/r7/art/1440x1000/04-the-two-paths.png) and independently reproduced [idle recheck](../../qa-artifacts/final-design/r7/art/recheck/paths-idle.png). At [tablet width](../../qa-artifacts/final-design/r7/art/768x1024/04-the-two-paths.png), the next title is much more complete, so the desktop fragment is the specific issue rather than a blanket objection to peripheral context.

**Bounded correction:** adjust the exact desktop rate-stop framing by the small amount needed to put the next heading wholly beyond the control boundary, or deliberately include its complete heading while retaining all rate copy. Prefer a narrow camera-framing correction over changing all paper spacing or hiding content.

**Recheck:** capture the 1440×1000 exact rate stop and approach/reversal; require complete rate content and either no next-heading fragment or a deliberate complete title. Confirm tablet and short-phone compositions stay intact.

## Exclusions and limits

A suspected phone transition-counter collision was **not confirmed**: the original-resolution independent [recheck](../../qa-artifacts/final-design/r7/art/recheck/phone-transition-counter.png) shows the entire “05 / 06” counter and long transition label with separation. It is excluded from findings and scoring. Downscaled previews are insufficient evidence for that claim.

Compressed text on an oblique or distant overview is not itself a defect: those are transient object views with readable chapter destinations. The closing/window's deliberate upper placement and remaining quiet stage space are acceptable composition choices. I have not deducted points merely for preferring a more centered object or more visible grain.

This pass does not establish physical iPhone stability, native touch behavior, mobile browser-chrome behavior, WebKit parity, manual VoiceOver, accessibility conformance, frame-time budgets or field performance. It does not comprehensively recheck every document section at every viewport, no-JavaScript/reduced-motion behavior, or the external GitHub portfolio page. PDF visual inspection is complete for the four rendered pages, but no independent canonical-copy audit or physical print proof is claimed. Poppler emitted Type 3 glyph bounding-box warnings; the inspected pages did not show resulting visible corruption.

The candidate remained unchanged at closeout. Scripts and evidence are confined to [qa-artifacts/final-design/r7/art/](../../qa-artifacts/final-design/r7/art/); this report is the only non-ignored file written by this reviewer.
