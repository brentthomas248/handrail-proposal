# Round 3 independent review: art direction and material quality

Reviewed 27 September 2026. **99/100.** No P0, P1 or P2 art-direction defect observed. One P3 finish issue remains. This is an independent assessment against the stated brief, not external certification or a whole-product release decision.

## Candidate and independence

Frozen candidate: `qa-artifacts/final-design/candidate-v3/identity.json`. The actual response from `http://127.0.0.1:4321/handrail-proposal/` was hashed before capture and matched `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`.

I read AGENTS.md, PROJECT.md, DESIGN.md, docs/local-workflow.md, the neutral final-design-review/brief.md, docs/redesign-research.md and docs/brand-sources.md. I did not read earlier reviews, scores, implementation commentary, progress records or remediation reports. No app edits, build, commit or publication occurred.

Fresh evidence is under [r3/art](../../qa-artifacts/final-design/r3/art/). The capture script and [capture.json](../../qa-artifacts/final-design/r3/art/capture.json) record the browser version, candidate hash, viewport, scroll positions, transforms and original screenshot filenames. Chromium **153.0.8010.12**, headed, isolated contexts. Desktop used DPR 1; other sizes used DPR 2. These are desktop-browser viewport tests.

## Scope and evidence

Each size received 72 native wheel steps forward to the end and 72 backward to the opening, followed by chapter-button landings, ordinary reading, notes and resume captures. I inspected original viewport captures from the opening, unfolding, forward travel, reverse travel and reading landings, plus document captures. Full-page document captures are supplementary; they were not substituted for viewport inspection.

| Viewport | Native scroll extent and return | Original captures |
| --- | --- | --- |
| 1440 × 1000 | 0 → 5180 → 0 | 36 |
| 390 × 844 | 0 → 4996 → 0 | 37 |
| 320 × 740 | 0 → 4381 → 0 | 37 |
| 390 × 664 | 0 → 4320 → 0 | 37 |
| 768 × 1024 | 0 → 5304 → 0 | 36 |

Representative material evidence: [desktop folded opening](../../qa-artifacts/final-design/r3/art/desktop-initial.png), [edge-on opening](../../qa-artifacts/final-design/r3/art/desktop-forward-04.png), [three visible panels](../../qa-artifacts/final-design/r3/art/desktop-forward-07.png), [close crease and light](../../qa-artifacts/final-design/r3/art/desktop-forward-30.png), [reverse fold](../../qa-artifacts/final-design/r3/art/desktop-reverse-68.png), [phone full opening](../../qa-artifacts/final-design/r3/art/phone-forward-07.png), [small-phone cash scene](../../qa-artifacts/final-design/r3/art/small-stop-2.png), [short-phone complete window](../../qa-artifacts/final-design/r3/art/short-stop-5.png), [tablet rate composition](../../qa-artifacts/final-design/r3/art/tablet-stop-3.png).

I also independently opened and captured the live [Telescope](https://telescope.fyi/), [Igloo](https://www.igloo.inc/), [Exat](https://exat.hottype.co/), [Stripe Press](https://press.stripe.com/) and [Handrail sample MOU](https://handrail-daas.com/careers/sample-mou.html) sources. All returned HTTP 200 in headed Chromium; `references.json` and `reference-*.png` hold the evidence. This was a focused reference inspection, not a full audit of those sites. Their accepted principles inform the judgment: meaningful overview/detail changes, a continuous spatial setting, assertive typography, credible printed objects and warm editorial restraint. Handrail's identity remains distinct from those reference brands.

Both linked PDFs were downloaded from the frozen local server, matched candidate hashes, and had all pages rendered with Poppler at 120 DPI and visually inspected:

- Proposal notes: two A4 pages, SHA-256 `d9759900f5a67816fe24a4bea3a7118d8700630755befd04ce0e9726bf23c363`.
- Resume: two Letter pages, SHA-256 `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.

## Score

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Identity and distinction | **20/20** | The official wordmark, cream/rust/ink palette, heavy Inter hierarchy and limited serif introduction form one recognizable editorial identity. The folded object carries the experience; no generic decorative effects compete with it. The approved references are interpreted through Handrail's own material and proposition. No deduction. |
| Paper, edge and crease realism | **20/20** | The opening reads as a thin matte folded sheet. The grain stays subordinate at reading distance, becomes visible in close views and does not become a repeated pattern. Front/back treatment, thin edge and two fold seams maintain the object through unfolding and reversal. All three panels are visible together during the reveal. No deduction. |
| Light and shadow coherence | **20/20** | Fold orientation changes the relative light on cream and rust faces; the crease reads as contact depth. Projected shadows remain soft on the surrounding ground and do not form a heavy halo. Reading poses retain ink contrast without glossy glare, drifting light or attention-seeking illumination. No deduction. |
| Composition and visual hierarchy | **20/20** | The headline establishes the proposition, rust gives the collections comparison its own visual weight, and rate numbers remain attached to their labels and explanation. Complete window and closing groups are composed at a restrained scale. Neighboring print provides spatial context without becoming the selected reading content. Normal reading, notes and resume retain the same hierarchy through quieter document layouts. No deduction. |
| Finish across viewport sizes | **19/20** | All five sizes preserve the object and legible target groups; phone rate scenes keep heading, rationale and shared terms together. The notes and resume reflow without observed visual clipping, and both PDFs are legible. **−1 for ART-R3-01:** the three phone-header links do not share a text baseline. |
| **Total** | **99/100** | **One point deducted; one P3 finding.** |

## Findings

### ART-R3-01 — P3 minor: phone header link text is vertically inconsistent

**Observed impact:** “Proposal notes” sits visibly above “My resume” and “My GitHub” in the same navigation row. The links remain understandable and usable, but the mismatch is a small distraction in an otherwise tightly finished header. This is observable misalignment, not a request to change the visual direction.

**Evidence:** [390 × 844 opening](../../qa-artifacts/final-design/r3/art/phone-initial.png), [320 × 740 opening](../../qa-artifacts/final-design/r3/art/small-initial.png), and [390 × 664 opening sequence](../../qa-artifacts/final-design/r3/art/short-forward-07.png). Fresh DOM measurements in [header-baselines.json](../../qa-artifacts/final-design/r3/art/header-baselines.json) confirm the offset. At 390 px width all three anchors start at y=52 and have height 24; the notes text box begins at y=52, while the neighboring text boxes begin at y=56.75. At 320 px width the equivalent values are y=44 and y=48.75. The difference is **4.75 CSS px** in both cases.

**Bounded correction:** In the mobile header rule, give `.portfolio-navigation .mobile-notes` the same flex alignment as its sibling anchors. Its more-specific `display: inline` declaration currently overrides the shared anchor flex rule and computes to a block flex item. Correct that layout rule rather than adding a compensating top offset. Retain the existing minimum anchor height, typography, spacing and desktop visibility behavior.

**Recheck:** Fresh headed screenshots at 320 × 740, 390 × 664 and 390 × 844 should show the three text baselines and underlines aligned within one CSS pixel in tour, reading, notes and resume headers. Confirm the anchor heights are retained and the mobile-only notes link remains hidden at 768 px and desktop widths.

**Score allocation:** −1 from finish across viewport sizes only. No duplicate deduction in composition or identity.

## Accepted design choices

The overview is an object view, so tiny body copy there is not treated as a reading failure. The route subsequently frames complete readable ideas. Peripheral text may crop during movement; that is not a defect when the target landing remains complete and coherent. The short closing/window scenes use top-oriented compositions and surrounding ground rather than inflating a few sentences to fill the screen. These choices support the stated cinematic-paper brief.

The notes PDF's first page has more whitespace than the second, but it keeps the three core compensation sections together and begins the illustration on a clean page. I did not identify a bounded correction with greater reading benefit than that grouping. The resume's second page deliberately distinguishes possible contribution from past experience. Neither document needs more texture, animation or decorative branding.

## Limits and workflow record

- No physical iPhone, Safari/WebKit, Android hardware, manual VoiceOver, print-device or color-calibrated proof. Browser emulation does not establish device stability.
- Actual wheel input and fresh frames were inspected. I did not measure frame delivery, memory, layer budgets or field performance; concurrent root verification owns those concerns.
- No touch-gesture, live viewport-height-change, keyboard, no-JavaScript or reduced-motion certification in this specialty report. Ordinary reading was rendered; the broader semantic/interaction regression suite is separate.
- Public GitHub portfolio content and external destination behavior were not audited. The resume's visible links and hierarchy were inspected.
- Poppler emitted `Bad bounding box in Type 3 glyph` warnings during PDF rendering. Both commands completed and all four resulting pages were visually inspected; no corresponding missing or clipped visible glyph was observed. This does not certify every PDF viewer or tagging behavior.
- Local-only workflow authorization was honored. Stagehand and Browserbase remain omitted; no cloud semantic-service or replay claim is made.
- The lifecycle router selected `product-proof-or-visual-qa` with `mayProceed: true` and `liveQaMayLaunch: true` under `full-product-qa`. `dev-doctor` passed after supplying the terminal type required by the local shell; unrelated contract warnings remain outside this review. This report is specialty review evidence, not a claim that every global lifecycle gate ran here.
- Only this report and the assigned ignored evidence directory were written. The scene, semantic reading implementation and shared build were preserved.
