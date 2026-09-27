# Round 2 independent editorial review

**Category:** Editorial typography and spacing\
**Assessment:** **89/100. One P2 material finding requires correction or an evidence-backed disposition before release.** No P0 or P1 finding. The page system is coherent, but the tablet notes table is not acceptable in its current state.

## Independence, candidate and method

Reviewed 27 September 2026 against the neutral final-design brief, AGENTS.md, PROJECT.md, DESIGN.md and approved local workflow. No previous reviewer report, score, remediation record or implementation commentary was read. No application source, build, commit or publication was changed. Only this report and `qa-artifacts/final-design/r2/editorial/` were written.

Frozen preview: `http://127.0.0.1:4321/handrail-proposal/`, build supplied as 27 September 10:07. Live response hashes matched `qa-artifacts/final-design/candidate/identity.json`:

| Surface | SHA-256 |
| --- | --- |
| Main HTML | `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33` |
| Notes HTML | `35f19ab76a4936f5ca9aeafaf72e35e75abb86f794a6cf66921d4a014f69bfd3` |
| Resume HTML | `134643a2b55698a4f6230ab596f0cc184da33f1f8c715e41161a11065daef746` |
| Proposal PDF | `f7877c9339e02c0ab48758a4b467381a1d7b304f830451b365b8a0b4c6d692ac` |
| Resume PDF | `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649` |

Used installed `@playwright/test` 1.63.0 with **headed Chromium**, fresh contexts and DPR 1. Captured all tour endpoints, ordinary-reading sections, notes and resume at **1440×1000, 390×844, 390×664, 320×740, 768×1024**. Supplementary notes-table widths: 820 and 1024. The 158 PNG evidence files include full pages, viewport originals, four PDF-page renderings and fallback/spacing samples. I inspected original viewport captures, not a contact-sheet substitute. Evidence inspection concentrated on every desktop and 390 px tour reading group, small/short critical groups, the tablet table/rates, all ordinary-reading sections, notes section progression and both resume sheets. Captures at other matching states support the matrix but are not a claim that every PNG received equal scrutiny.

Both live linked PDFs were downloaded and rendered with Poppler at a 1500 px longest edge. Every page was inspected: proposal notes, two A4 pages; resume, two Letter pages. `pdfinfo` and extracted bounding-box text supplemented visual inspection. The extraction/render process emitted Type 3 glyph bounding-box warnings, but the inspected renders did not show missing or damaged characters. That warning alone is not scored as a visual defect.

Evidence is in [the editorial evidence directory](../../qa-artifacts/final-design/r2/editorial/). Reproduction scripts: `capture.cjs`, `followup.cjs`, `fallbacks.cjs`; measurements: `measurements.json`, `table-metrics.json`, `route-hashes.json`, `fallbacks.json`.

## Reference basis

Read the current primary [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) for effective size, readable measure, hierarchy and related-content spacing; [W3C Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) for override resilience; and [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) for narrow-layout reasoning. These inform judgment; they do not impose a universal font-size minimum on an object tour. Handrail's specified identity, terms and restrained physical-paper direction remain binding.

## Scores

| Criterion | Score | Exact deduction and rationale |
| --- | ---: | --- |
| Type hierarchy | **19/20** | **−1, ED2-02:** phone rate terms become a noticeably smaller reading level than necessary. Otherwise the large proposition, dominant rates, supporting explanation and quiet qualifications are clearly differentiated; the serif introduction is brief and purposeful. |
| Line measure and rhythm | **19/20** | **−1, ED2-02:** the two rate-label columns are only about 85.6 px wide on a 390 px phone, forcing short stacked labels. Ordinary reading, notes and resume paragraphs otherwise maintain coherent rhythm; headings stay with their following content in both PDFs. |
| Microspacing and wrapping | **15/20** | **−5, ED2-01:** neighboring financial figures overlap in the tablet notes table. This is a material typography failure in the central numeric comparison. No separate deduction for ordinary natural paragraph endings or harmless peripheral tour cropping. |
| Macro composition and whitespace | **18/20** | **−2, ED2-02:** phone rate groups underuse the available composition, with a large empty area above a narrow reading column. Elsewhere, paper edges, rules, margins and inter-section spacing establish the document well. The intentionally short window/closing compositions preserve complete ideas. |
| Responsive/document consistency | **18/20** | **−2, ED2-01:** the notes table has a broken intermediate-width state even though phone, desktop and print counterparts separate the same numbers correctly. The documents otherwise preserve a common hierarchy, full proposal qualifications, the resume's 2025 degree date and its two-sheet distinction between experience and potential contribution. |
| **Total** | **89/100** | The score does not waive the P2 correction requirement. |

## Findings

### ED2-01 — P2 material: tablet notes table merges neighboring dollar amounts

**Observed:** `/agreement/` at 768×1024. In section 4, `$1,500` and `$2,000` visually collide; the same happens to `$8,500` and `$8,000`. The sidebar remains 240 px wide with an 80 px gap, leaving a 368 px article/table. Each value column is 112.24 px wide, while each 40 px value's text range is 128.26 px wide. The first amount therefore extends **16.02 px into the next value's text range**. The rightmost value also extends 16.02 px beyond the table's right edge. At 820 px viewport width, the value ranges still have effectively no separation: about 0.16 px overlap. At 1024 px, they have about 62 px separation.

**Evidence:** [768 px original](../../qa-artifacts/final-design/r2/editorial/notes-table-768.png), [820 px original](../../qa-artifacts/final-design/r2/editorial/notes-table-820.png), [1024 px control](../../qa-artifacts/final-design/r2/editorial/notes-table-1024.png), and `table-metrics.json`. The initial independent discovery is also visible in `tablet-agreement-2.png`.

**Impact:** The reader has to disentangle the two compensation comparisons. These are the important cash figures, so merely keeping the page inside the viewport is insufficient. This is an observed collision, not a preference for a different visual style.

**Narrow correction:** Give the notes article/table a responsive layout based on its available content width. The smallest robust change is to apply the already legible narrow table arrangement before the value columns become too small, or collapse the notes sidebar to a preceding contents list at that intermediate width. Keep a real gutter between the numeric columns. Do not change the amounts, terms, source content or print layout. Do not solve this by shrinking these values until they merely touch.

**Recheck:** Capture the table at 320, 390, 700, 768, 820, 900, 1024 and 1440 px widths, including the breakpoint's adjacent widths. Both rows must have visibly separate figures and text ranges contained in their cells, with a deliberate gutter (roughly 12–16 px or more is a useful target here). Recheck the ordinary-reading comparison and both proposal PDF pages so a shared rule does not regress them. This finding needs correction or a documented evidence-backed disposition before release.

### ED2-02 — P3 minor: phone rate scenes have a thumbnail-like reading column

**Observed:** At 390×844, the Hire first group starts around **x=128.5, y=327.4**, and the Client first group around **x=81.7, y=317.3**. Both have an approximately **180.6 px text measure**. The rate-label subcolumns are **85.6 px** wide. Main rationale is about **15.4 effective px**; scope/common terms and labels are about **14.6 effective px**. These estimates use computed font size and the rendered/local height ratio of the camera-facing elements, so they are approximate display sizes rather than raster-glyph measurements. The related content remains complete and readable.

The header ends at 84 px; the first active rate heading sits over 230 px below it. The active group occupies only about 46% of the viewport width despite considerable unused space. The same 180.6 px rate measure persists at 320×740 and the short 390×664 viewport. At 390×844, the collection group uses a 296.4 px measure and approximately 17.1 px supporting copy. Moving into rates therefore creates a perceptible reduction in editorial presence.

**Evidence:** [Hire first, 390×844](../../qa-artifacts/final-design/r2/editorial/phone-tour-3.png), [Client first, 390×844](../../qa-artifacts/final-design/r2/editorial/phone-tour-4.png), [small phone](../../qa-artifacts/final-design/r2/editorial/small-tour-3.png), [short phone](../../qa-artifacts/final-design/r2/editorial/short-tour-4.png), and corresponding named records in `measurements.json`.

**Impact:** The reader works harder on scope and benefits precisely when comparing the proposed compensation. Visually, the terms resemble a narrow excerpt floating in the sheet. This is a polish weakness, not missing content or a claim that 14.6 px automatically fails WCAG.

**Bounded correction:** Modestly widen the phone rate reading group and use the spare vertical area to raise effective supporting type toward 16–17 px. Preserve each complete group, the two-column rate/recurring relationship, visible paper context and the short-viewport safe area. This is not a recommendation to turn each sentence into a large isolated shot. If keeping the existing restrained scale is deliberate, record that tradeoff; the full ordinary-reading path already supplies a larger presentation.

**Recheck:** Compare both rates with collection/window/closing at all three phone sizes. All labels, explanations, scope and common benefits text must remain visible together with breathing room above the controls. Inspect the original full viewport and physical paper edges, not only the target rectangle.

## Other observations and limits

- Ordinary reading is substantially more comfortable than the narrow rate tour treatment. The desktop hierarchy remains strong, and phone content flows without accidental section clipping. The ordinary-reading tables inspected at desktop and phone widths separate labels and numbers clearly.
- Notes body copy is 18 px with approximately 29.7 px leading at desktop, with a 750 px measure. Desktop resume profile copy is about 17 px and bullet copy 15 px; phone resume preserves readable paragraphs, distinct dates/organizations and quiet separators. No additional material wrap or grouping defect was observed in these surfaces.
- The two-page PDFs preserve complete ideas and intentional sheet boundaries. The notes' first page has generous lower whitespace while page two is denser; keeping the collections example intact on page two makes that tradeoff understandable. I am not assigning a deduction simply to equalize page density. Resume page one remains conventional experience/education/tools; page two clearly introduces potential contribution and proof.
- No-JavaScript and reduced-motion phone samples render the ordinary-reading opening. Supplemental 320 px text-spacing overrides produced no document-wide horizontal overflow in reading, notes or resume. Those spot checks are not a comprehensive accessibility conformance claim; the long override captures were not treated as a replacement for all viewport-level inspection.
- Public GitHub typography was omitted: it is an external platform surface and not needed to judge this site's editorial system. No independent fact audit of linked contributions was performed.
- This editorial pass did not certify continuous motion, touch inertia, browser performance, field INP, physical iPhone stability, manual VoiceOver, every browser engine or every assistive-technology setting. Physical iPhone and manual VoiceOver remain **untested**. Credentialed Stagehand/Browserbase were omitted under the approved local workflow.
