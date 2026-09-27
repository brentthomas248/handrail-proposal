# R8 independent editorial typography and spacing review

**Score: 99/100.** No P0–P2 editorial defect observed within this review. One P3 pagination refinement remains in the proposal-notes PDF. This is an independent specialty assessment, not full release or physical-device certification.

## Candidate and independence

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.
- Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`.
- All **28 files** in `candidate-v8/identity.json` matched before and after review, including notes, resume, both PDFs, script and font assets. Receipts: [before](../../qa-artifacts/final-design/r8/editorial/identity-before.json), [after](../../qa-artifacts/final-design/r8/editorial/identity-after.json).
- Read the assigned neutral task, AGENTS, PROJECT, DESIGN, local workflow, final review brief, redesign research and brand sources. Did not read earlier reviews, grades, peer findings or IMPLEMENTATION. Did not edit the application, rebuild, publish or spawn agents.
- Used the Agentic UI lifecycle/QA and PDF skills within the explicit local workflow. Credentialed services were omitted as authorized. The generic router returned no blockers but classified this bounded review as a tiny change; its output is retained as routing evidence, not evidence of implementation or full lifecycle certification.

## Scope and evidence

Created independent screenshots in isolated **headed Chromium**, using DPR 1 for desktop/tablet and DPR 3 for phones. Editorial scene/detail screenshots use CSS-pixel output so their apparent size can be judged against the specified viewport; the initial desktop screenshot also uses DPR 1. Downloaded the frozen PDFs and rendered every page with Poppler at 110 dpi.

| CSS viewport | Tour reading groups inspected | Document surfaces inspected |
| --- | --- | --- |
| 1440 × 1000 | Beginning, collections, both paths, 90-day window, closing; folded opening | Ordinary reading, notes and resume; full-page composition plus viewport details |
| 390 × 844 | Beginning, collections, each individual path, window, closing | Ordinary reading, notes and resume; full-page composition plus viewport details |
| 320 × 740 | Collections, client first, window | Ordinary reading, notes and resume; full-page composition plus viewport details; spacing override spot check |
| 390 × 664 | Collections, client first, window, closing | Ordinary reading, notes and resume; full-page composition plus viewport details |
| 768 × 1024 | Beginning, collections, both paths, closing | Ordinary reading, notes and resume; full-page composition plus viewport details |

Native forward/reverse wheel input was exercised on desktop and 390 × 844 around the beginning/collections/path transitions. The captured intermediate geometry is distinguished from a stationary reading pose; transient partial words at a crossed crease were not scored as clipping of a reading group. This is representative motion context, not a full motion audit.

Both pages of each PDF were inspected individually:

- [Proposal notes, page 1](../../qa-artifacts/final-design/r8/editorial/notes-pdf-1.png) and [page 2](../../qa-artifacts/final-design/r8/editorial/notes-pdf-2.png).
- [Resume, page 1](../../qa-artifacts/final-design/r8/editorial/resume-pdf-1.png) and [page 2](../../qa-artifacts/final-design/r8/editorial/resume-pdf-2.png).

The five-viewport web captures, raw type/rectangle measurements, wheel observations, scripts and error receipts are in [the evidence directory](../../qa-artifacts/final-design/r8/editorial/). No page or console errors were recorded by these review sessions.

## Scoring

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Type hierarchy | **20/20** | The short Playfair introduction, large Inter headline, economic proposition, rates and supporting scope each have a clear role. Display size earns attention without forcing ordinary paragraph text into giant isolated crops. Notes use numbered headings; resume headings distinguish demonstrated experience from potential contributions. No deduction. |
| Line measure and rhythm | **20/20** | Body copy remains readable at the dense collections stop and in short-phone framing. At 320 pixels, notes and resume retain comfortable margins and coherent sentence blocks. Paired desktop rates use matched measures, and phone reading mode stacks them logically. No deduction. |
| Microspacing and wrapping | **20/20** | Percentage marks, collected-fee labels and recurring rates remain associated. Phone figures align under the correct path labels. Headings do not collide with prose, and no active reading-group line is cut by the fixed controls in the inspected endpoints. Narrow-width wrapping preserves whole ideas. No deduction. |
| Macro composition and whitespace | **20/20** | The broad paper, short serif lead, large title and restrained rules form a deliberate composition. Rules separate rate rationale from the shared benefits qualification without severing their relationship. The window is one coherent three-step group, and closing copy keeps its follow-up together. Empty paper and ground around the shorter scenes support the physical-document direction. No deduction. |
| Responsive/document consistency | **19/20** | Web reading, notes, resume and print retain a consistent editorial voice and hierarchy. Both resume sheets are deliberate, readable compositions. **−1 for E8-01:** the notes PDF leaves the recurring example alone at the start of page two without its section context. This is a small reading-continuity weakness, not missing content. |
| **Total** | **99/100** | One point deducted once, against the document-consistency criterion. |

## Finding

### E8-01 — P3 minor: recurring example loses its section cue across the PDF page break

**Observed impact:** Proposal notes page one ends with the total-build commission example under section 4. Page two starts with the two-line recurring-fee example, immediately followed by section 5. A reader who turns the page or opens page two independently has to reconnect that sentence to the previous illustration section. All figures remain readable and unambiguous; no compensation term is missing. The weakness is local reading continuity.

**Evidence:** [Page-one ending](../../qa-artifacts/final-design/r8/editorial/notes-pdf-1.png), [page-two opening](../../qa-artifacts/final-design/r8/editorial/notes-pdf-2.png), and [independent page-two text extraction](../../qa-artifacts/final-design/r8/editorial/notes-page-2.txt). The live PDF matched its manifest hash again at closeout. The web [section-four detail](../../qa-artifacts/final-design/r8/editorial/1440x1000/detail/notes-example.png) keeps the two supplemental examples together under the illustration heading, confirming this is print pagination rather than a content-order problem.

**Bounded correction:** Refine the print break so the supplemental build-total and recurring examples travel together, with a short continuation cue if they begin the second page. Preserve the current readable type, seven-section order, complete qualifications and two-page budget. Do not reduce all body text to make this single sentence fit.

**Recheck:** Render both notes-PDF pages from the new candidate. The recurring sentence should remain visibly associated with the illustration section, with no new stranded heading, clipped line or extra page. Rerun the canonical PDF text check after any print-only adjustment.

**Disposition:** Minor polish; no editorial release blocker from this finding.

## Measurement and interpretation notes

- Measurements are in **CSS pixels**, not phone screenshot/device pixels. Effective tour text sizes were estimated from transformed element border-box dimensions divided by untransformed `offsetWidth`/`offsetHeight`, checking both axes at face-on chapter poses. Integer layout rounding makes these approximate. Glyph Range height was not used as a scale estimate.
- Representative collections body/qualification text is approximately **17.1 CSS px at 390 × 844**, **16.1–16.2 at 320 × 740**, and **16.0 at 390 × 664**. The figures are larger. These values corroborate the visual inspection; they are not a substitute for it. [Raw measurements](../../qa-artifacts/final-design/r8/editorial/measurements.json).
- The 320-pixel document spot check applied 1.5 line-height, 2em paragraph spacing, .12em tracking and .16em word spacing. Reading, notes and resume each retained `scrollWidth = clientWidth = 320`, with no tested text block extending outside the viewport. The overridden display headline wraps more aggressively, but content remains present; that changed appearance alone is not a failure. This was a bounded reflow check, not a claim of complete accessibility compliance. [Receipt](../../qa-artifacts/final-design/r8/editorial/spacing-checks.json).
- Angled neighboring panels, the glimpse of the next window heading on tablet, large headline scale and the quiet space under the closing are consistent with the approved paper-object direction. No deduction was made for these preferences. No deduction was based on headless missing paint or on off-axis transition screenshots.
- Poppler emitted Type 3 glyph bounding-box warnings while rendering. The inspected pages have no corresponding missing glyph, clipping or black-box defect, so these tool warnings were not treated as product findings.

## Principles and limits

Used [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) for readable size, measure and related-content spacing, and the [W3C text-spacing explanation](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) to distinguish user-override resilience from required authored styling. The approved Exat typographic reference was consulted through its [official specimen](https://exat.hottype.co/); the repository's research/brand records supplied the intended relationship to Handrail and the other references. A fresh web-reader fetch of the official sample MOU failed, so no new rendered MOU comparison is claimed. Private supplied documents were not opened.

Not tested here: physical iPhone/browser-chrome behavior, Safari/WebKit or Firefox rendering, manual VoiceOver or other assistive technology, print on paper, complete keyboard/no-JS/reduced-motion flows, every possible viewport, every tour transition, performance profiling or external portfolio navigation. Full deterministic regression and other specialty reviews remain separate evidence.

All owned browser sessions were closed. Candidate bytes were unchanged at the end of this review. Only this report and the assigned ignored evidence directory were written.
