# Round 4 independent editorial review

Category: **Editorial typography and spacing**. Assessment: **99/100**. One P3 refinement; no P0, P1 or P2 editorial finding. This is a scoped design assessment of the rendered candidate, not release authorization or an accessibility certification.

## Candidate and method

Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/` using fresh **headed Chromium 153.0.8010.12**, isolated browser contexts, DPR 1. The 28 served files listed in `qa-artifacts/final-design/candidate-v4/identity.json` all matched their SHA-256 values. Main HTML: `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82`. Proposal PDF: `d9759900f5a67816fe24a4bea3a7118d8700630755befd04ce0e9726bf23c363`. Resume PDF: `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.

Read AGENTS.md, PROJECT.md, DESIGN.md, docs/local-workflow.md and the neutral review brief. Did not read prior review reports, scores, remediation commentary, implementation/progress records or peer findings. The project-approved local workflow permits the omitted credentialed services; no credential access was attempted. The Agentic UI lifecycle/QA and PDF skills informed method. The generic read-only lifecycle router misclassified the wording as a tiny implementation task; the explicit frozen-candidate review contract governed this review. No app source, shared build, commit or publication was changed.

Evidence directory: `qa-artifacts/final-design/r4/editorial/`. `capture.mjs` produced 75 browser captures and full text/geometry records in `metrics.json`; `edge-checks.mjs` produced 19 additional captures and `edge-checks.json`. `identity-check.json` records the 28 successful comparisons. `measurement-summary.json` contains selected numeric gutters. Both linked PDFs were downloaded from the reviewed server and their four pages rendered with Poppler at a 1500px long edge. All four PDF originals and all 33 tour originals were visually inspected, with targeted ordinary-document originals rather than relying on stitched thumbnails.

| Surface | Rendered coverage |
| --- | --- |
| Tour | Every settled reading group plus overview at 1440×1000, 390×844, 320×740, 390×664 and 768×1024; exact chapter navigation, fonts loaded, 1350ms settling interval |
| Read normally | Each of the five semantic sections at 1440×1000, 390×844 and 320×740 |
| Proposal notes | Desktop and small-phone title/navigation, comparison, section transitions, final discussion list and endnote; targeted 390px samples |
| Resume | Desktop and small-phone title/profile, experience, education/tools, contribution rows and work examples; targeted 390px samples |
| Breakpoints | Notes comparison and resume contribution layout at 759, 760, 761, 768 and 1024px widths |
| User text spacing | All three routes at 1440×1000, 390×844 and 320×740 with 1.5 line height, 2em following paragraphs, .12em tracking and .16em word spacing; targeted rendered comparison/contribution samples and horizontal geometry check |
| PDFs | Both pages of both served PDFs; complete page composition, headings, table, footers and page boundaries |

## Scores

| Criterion | Score | Reason and deduction |
| --- | ---: | --- |
| Type hierarchy | **20/20** | The compact serif invitation has one clear role; heavy Inter headlines establish the proposal, the build percentages and $10,000 collection dominate their explanatory text, and the notes/resume use distinct heading, body and contextual tiers. The 90-day numeral does not obscure its meaning. No deduction. |
| Line measure and rhythm | **20/20** | Paragraphs stay in workable columns; desktop notes use 18px/29.7px body, mobile notes 17px/28.05px, and the resume profile uses 17px/27.2px on desktop. Narrow resume copy becomes stacked, with headings kept with the following content. Short stage scenes keep whole arguments together. No deduction. |
| Microspacing and wrapping | **19/20** | Numerals retain distinct columns and adequate ink separation across every core size. There is one minor inconsistent wrap in the 320px notes comparison header, detailed as ED-R4-01 below. **−1 point, counted here only.** |
| Macro composition and whitespace | **20/20** | The larger opening, denser collection explanation, paired rate structure and quieter closing form a deliberate sequence. The short window and closing scenes keep context and their own paragraphs together without inflating a sentence into a macro crop. Reading mode uses consistent section borders and padding. The PDFs maintain complete groups and useful page boundaries. No deduction. |
| Responsive/document consistency | **20/20** | The tour, ordinary reading, notes and resume preserve the hierarchy while changing layout to match the surface. Tablet notes keep a useful main column alongside the contents list. Spacing overrides switch the tour to flowing reading; all nine tested route/size combinations and all ten breakpoint samples had document width no greater than viewport width and no measured main-text element extending horizontally past the viewport. No deduction. |
| **Total** | **99/100** | **100 − 1 = 99.** |

The scoring anchor is applied within the stated specialty and tested conditions. Twenty does not claim perfection on untested devices.

## Finding

### ED-R4-01 — P3: comparison-header percentages wrap inconsistently at 320px

**Observed defect, high confidence.** In proposal notes at 320×740, “Hire first · 15%” stays on one line while “Client first · 20%” places only 20% on the next line. The percentage ink positions differ by about **24.3px** vertically. The column headings share their top edge, and the monetary rows remain correctly aligned; nothing is missing or colliding.

**User impact:** A small-phone reader scanning the two commission rates has to move down a line for the second rate. It is a minor comparison-rhythm defect in an otherwise aligned table, rather than ambiguity in the underlying terms.

**Evidence:** `320x740-agreement-sample-0.png` and `320x740-agreement-sample-1.png`; `metrics.json`, record `320x740-agreement-sample-0`. Hire-first rate text starts at y=316.55px in that capture; client-first “20%” starts at y=340.85px. The 390px comparison, `390x844-agreement-sample-0.png`, keeps both headers on one line. Both rates occupy the same second line at the normal desktop/tablet layout.

**Bounded correction:** At the narrow notes-table breakpoint, put both `.collection-rate` values on their own line and keep the separator with the rate, or otherwise establish a shared two-line header composition. Scope the adjustment to the notes comparison; preserve the existing tour and PDF arrangements and the monetary column gutter.

**Recheck:** Capture the notes table at 320, 359, 360 and 390px plus the text-spacing override. Verify the two rate values share a baseline, each stays associated with its path, monetary values remain aligned, and the document stays within the viewport. Rerender the proposal PDF only if the change affects print styles.

**Deduction:** −1 microspacing and wrapping. No further responsive or hierarchy deduction for the same root cause.

## Positive evidence and editorial judgment

- Every settled primary tour reading group was visibly complete between the header and bottom controls at the five core sizes. This includes the before-costs qualifier, both rate rationales/common terms, the three 90-day steps and the full closing invitation. Neighboring paper can appear as peripheral, cropped context; that was not mistaken for primary reading content.
- The collection amounts are visibly separated. Measured horizontal ink gaps from the end of `$1,500` to the start of `$2,000` were 60.24px at desktop, 49.73px at tablet, 67.85px at 390×844, 55.67px at 320×740 and 57.13px at 390×664. Ordinary reading at 320px retained 53.63px; the 320px notes comparison retained 48.80px. These measurements support the visual judgment and do not substitute for it.
- Native artboard font sizes are not effective on-screen sizes. The cash-flow copy's rendered line step is about 23.17px at 390×844, 19.01px at 320×740 and 19.51px at 390×664; with its 1.35 line-height ratio, the latter two are approximately 14.1–14.5px effective type. That is compact but legible in these originals, and ordinary reading provides the larger flowing version. This review does not infer physical-device legibility from a DPR-1 capture.
- Spacing-override captures show the content expands rather than being squeezed into a fixed camera composition. At 320px, the money figures remain in separate columns, the notes table remains in flow, and the contribution paragraphs grow vertically. The rendered appearance of user-requested tracking is not judged against the authored aesthetic.
- The proposal PDF divides after the two proposed paths. Its first page has substantial lower whitespace; page two carries the illustrative collections and discussion points. I regard the complete thematic grouping as a defensible print choice, not a pagination defect. The resume fills two sheets with clear experience/contribution separation, aligned job dates, restrained rules and unobscured text. No visible clipped paragraph, orphaned heading, lost numeric cell or footer collision was found in the four PDF pages. Poppler emitted Type-3 glyph bounding-box warnings during rendering; the inspected images showed no corresponding visible glyph defect.

Aesthetic preferences are not deductions: tighter lower whitespace on proposal PDF page one, a different resume proof-column breakpoint, or a different balance of blank stage around the closing could also be designed well. The current choices do not create enough observed reader harm to require a correction within this brief.

## Reference basis

[USWDS typography](https://designsystem.digital.gov/components/typography/) informed effective-size, line-measure and grouping judgment. Its principles were used as guidance, not rigid size requirements for a cinematic object tour. [WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) informed the override values and the no-content-loss check; it does not prescribe those values as authored styling. Both primary sources were opened during this review. Handrail identity and the approved design document remain the visual constraints.

## Limits

This review assesses settled editorial compositions and document presentation. It does not grade motion continuity, rapid reversal, frame delivery, memory/layer budgets, public portfolio content, network reliability or live link history; those belong to the other assigned reviews. Supporting long documents were sampled at meaningful positions rather than recaptured in full at every height. No physical iPhone/iPad, real browser-chrome changes, high-DPR screenshot matrix, manual VoiceOver, screen-reader reading order, broad zoom/font substitution matrix, print hardware or field performance was tested. Spacing checks are bounded visual/geometry evidence, not full WCAG conformance. No build or automated app test suite was run by this reviewer, and no app fix was made.
