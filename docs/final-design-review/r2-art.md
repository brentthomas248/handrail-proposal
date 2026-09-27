# Independent final review — art direction and material quality

Reviewed 27 September 2026. **96/100. No P0–P2 finding in this specialty; three P3 refinements remain.** This is an independent design assessment within the approved Handrail brief, not an external award or a complete release certification.

## Candidate and independence

- Live candidate: `http://127.0.0.1:4321/handrail-proposal/`, frozen build supplied as 27 September 10:07.
- Served `index.html` SHA-256 independently measured: `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33`, matching `qa-artifacts/final-design/candidate/identity.json`.
- The dirty source state is the candidate. No application edits, build, commit, publication, or PR was performed by this reviewer.
- Read AGENTS.md, PROJECT.md, DESIGN.md, docs/local-workflow.md and the neutral review brief. Did not read earlier reviewer reports/scores, remediation/progress documents, or implementation commentary. The reference documents were used for their approved reference principles and brand sources only.
- Applied the Agentic UI lifecycle/QA skills under the repository's explicitly approved local workflow. Stagehand, Browserbase and credentialed generation services remain omitted by that authorization.

## Scope and evidence

All candidate captures were made by this reviewer in isolated **headed Chromium** contexts with DPR 2. Original individual captures were inspected; no contact-sheet judgment was substituted. `capture.mjs`, `capture-index.json`, `supplement.mjs` and `supplement-receipt.json` are in the ignored evidence directory `qa-artifacts/final-design/r2/art/`.

| Viewport | Coverage |
| --- | --- |
| 1440 × 1000 desktop | Folded opening; full native wheel forward/reverse journey; every settled chapter; material/edge/crease detail captures; ordinary-reading closing view; notes and resume opening views |
| 390 × 844 phone | Native touch forward/reverse scenes; all chapter endpoints; supplemental native window-to-closing traversal and reversal; stable Hire-first pose rechecked after four seconds; ordinary-reading closing view; notes/resume opening views |
| 390 × 664 short phone | Native touch forward/reverse scenes and supplemental closing traversal; all chapter endpoints; four-second stable Hire-first recheck; ordinary-reading closing view |
| 320 × 740 small phone | Folded opening and every chapter endpoint; ordinary-reading closing view |
| 768 × 1024 tablet | Folded opening and every chapter endpoint; ordinary-reading closing view |

The first phone touch pass reached the window rather than the final native scroll extent. The supplement explicitly covered that remaining segment, reached the scroll end, and reversed through it. The short-phone supplement likewise reached its exact scroll end. Desktop traveled from `scrollY=0` to `5180` and back. Phone supplement reached about `4996.5` against a measured maximum of `4996`; short phone reached `4320/4320`. These observations establish the input path reviewed, not frame-rate or physical-device certification.

The six reference pages were opened separately and captured under `reference-*.png`. Handrail's [careers page](https://handrail-daas.com/careers) and [sample MOU](https://handrail-daas.com/careers/sample-mou.html) support the warm ink/rust/document relationship. The current [Stripe Press](https://press.stripe.com/) opening reinforces material-specific object presentation; [Telescope](https://telescope.fyi/) reinforces deliberate changes of scale. [Exat](https://exat.hottype.co/) was sampled at its opening. [Igloo](https://www.igloo.inc/) was still showing a loading screen in this review's capture, so no new claim about its rendered camera work is made. The bound brief, rather than an attempted reskin of these references, governs the assessment.

## Scores

| Criterion | Score | Exact reasoning and deductions |
| --- | ---: | --- |
| Identity and distinction | **20/20** | The actual Handrail wordmark, cream/rust/ink palette, brief serif introduction and strong sans-serif print hierarchy form a specific proposal object. The rust face gives collections meaningful visual emphasis. The folded packet and wide open flyer supply distinction without ornamental effects. No actionable identity defect found within the binding brief. Evidence: `desktop-initial.png`, `desktop-forward-06.png`, `phone-chapter-1.png`, `desktop-agreement.png`, `phone-resume.png`. |
| Paper/edge/crease realism | **19/20** | Grain is visible in close views while remaining quiet at reading distance. The crease remains legible, the surfaces look matte, and type remains printed on the faces. **−1 for ART-R2-01:** the oblique lower edge has a fine repeating diagonal fringe that weakens the clean cut-paper illusion. |
| Light and shadow coherence | **20/20** | The opening has soft projected shadow beneath separated leaves; folded orientations change diffuse face shading without a glossy streak or dramatic halo. Crease contrast stays restrained during the wide reveal and close reading. No actionable lighting inconsistency was found in the inspected forward/reverse samples. Evidence: `desktop-forward-03.png`, `desktop-forward-06.png`, `phone-forward-00.png`, `phone-forward-01.png`, `detail-rust-crease.png`, `detail-fold-edge.png`. |
| Composition and visual hierarchy | **19/20** | The complete opening precedes close reading; the cover, collections, rate comparison, window and closing each present a complete idea. Desktop nearby faces preserve spatial context without generally competing with the active idea. **−1 for ART-R2-02:** the desktop window endpoint leaves a thin chopped line of preceding copy under the header. |
| Finish across viewport sizes | **18/20** | The warm identity and material remain consistent on all five sizes. Captured active groups stay complete; the small/short phone checks did not turn an isolated sentence into the whole scene. Ordinary reading, notes and resume samples retain the same document voice. **−2 for ART-R2-03:** the stable phone Hire-first composition is noticeably low/right, with excessive empty ground above and a different placement from Client-first. |
| **Total** | **96/100** | Four points deducted across three specific findings. No unknown-device penalty and no duplicate deductions. |

## Findings

### ART-R2-01 — P3 minor: fine serrated fringe on the folded lower paper edge

**Observed:** The opening packet's diagonal lower edges show a repeated light/dark diagonal fringe, including a thin crossing white line beneath the foreground leaf. It is easiest to see in the original `detail-fold-edge.png`, and is also visible at the bottom of `phone-initial.png`. The face texture itself is controlled; the problem is concentrated on the edge silhouette.

**Impact:** A small raster/edge artifact makes this otherwise credible paper object look slightly like overlapping digital planes when the eye follows the fold. It does not impair reading or the reveal. This is a negligible material refinement, not a claim that the piece needs photorealistic rendering.

**Bounded correction:** Inspect the front/back/edge overlap at that oblique pose. Adjust the edge offset or overlapping strokes so there is one clean, thin cut-paper boundary. The source cause was not investigated; do not assume a particular implementation fault or add heavy geometry/layers to conceal it.

**Recheck:** Capture the same folded lower edge at DPR 1 and 2 in headed Chromium, then traverse the first unfold forward and backward. The fringe should be absent without thickening the paper into card stock or introducing seam gaps.

**Score effect:** Paper/edge/crease realism −1.

### ART-R2-02 — P3 minor: chopped peripheral text at the desktop window endpoint

**Observed:** In `desktop-chapter-4.png`, the previous “Both paths…” line is sliced horizontally by the fixed header at the top of the active paper. The window heading and all three explanations remain complete. The neighboring rust face provides useful color/physical context, but this narrow text remnant reads as an unfinished crop. `tablet-chapter-4.png` shows a more complete preceding line and does not have the same chopped appearance.

**Impact:** The exact reading pose has a small visual distraction at its upper border. A deliberate resting composition should avoid a few pixels of letter bottoms when the active idea already has ample surrounding space. This is not missing essential window copy.

**Bounded correction:** Make a small desktop window framing adjustment so the preceding line is entirely out of the safe stage or intentionally complete. Preserve the window group, neighboring face, edge and existing optical scale; do not flatten the object or broadly redesign the document.

**Recheck:** Revisit The window at 1440 × 1000 through both chapter navigation and native input/settling. Confirm a clean top boundary and complete active group, then inspect 768 × 1024 and short phone for a framing regression.

**Score effect:** Composition and visual hierarchy −1.

### ART-R2-03 — P3 minor: phone rate-path framing is unnecessarily low and asymmetric

**Observed:** At 390 × 844, the Hire-first paper top is around 307 CSS pixels from the viewport top, leaving roughly 220 pixels of bare ground after the header. The measured “Two ways to begin” heading begins at `y=327.4`, `x=128.5`, and the active text column is about `180.6` pixels wide. This is the settled pose, confirmed after four seconds in `phone-hire-stable.png` and visible in the original chapter capture and native reverse sample. Client-first lands higher and farther left in `phone-chapter-4.png`. The same tendency is visible at 320 × 740; 390 × 664 is less extreme but remains distinctly right weighted.

**Impact:** The rate proposition occupies a smaller, lower portion of the available reading stage than its importance warrants, while chopped rust-panel fragments attract attention on the left. Both ideas are fully legible and complete, so this is an optical-composition weakness rather than a content-access failure. Different positions are permissible in a spatial journey; the size of this vacant band is the avoidable part.

**Bounded correction:** Refit the two phone rate poses around their complete reading groups, using a more consistent vertical anchor and less excess lateral ground. Retain a narrow crease/neighbor cue and the heading, both percentages, rationale, future-sales scope and common terms. Prefer modest translation first; only increase scale if every associated line still fits the short-phone safe stage.

**Recheck:** Inspect complete settled Hire-first and Client-first compositions at 390 × 844, 390 × 664 and 320 × 740 after native forward/reverse input and chapter clicks. The active group should use the available stage deliberately, keep its full related copy, and retain enough paper context to explain the spatial transition.

**Score effect:** Finish across viewport sizes −2.

## Limits and closeout

The score is for the captured frozen candidate and this specialty. No P0, P1 or P2 art-direction defect was observed. P3 findings remain recommendations for bounded polish; the integration owner applies the broader release gate.

Physical iPhone/Safari stability, real browser chrome, WebKit, assistive technology, text-spacing overrides, no-JavaScript, reduced-motion behavior, performance/layer budgets and full keyboard/history flows were not independently certified in this pass. The notes/resume inspection was limited to their first viewport, and ordinary-reading inspection to its restored closing region. Both PDFs and the external portfolio were outside this material/composition pass. Captured reference openings do not constitute a new exhaustive reference-site audit. The material review is visual evidence, not a lighting or rendering-physics certification.

Only this report and ignored evidence in `qa-artifacts/final-design/r2/art/` were written. Next action: integration-owner triage of these minor refinements alongside the other independent specialties; no app mutation is authorized or performed by this review report.
