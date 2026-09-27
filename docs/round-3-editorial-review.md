# Round-three editorial and document review

Independent rendered review, 27 September 2026. Scope: typography, hierarchy, measure, spacing, Handrail identity and resume PDF. This reviewer did not implement the new resume or navigation. Motion and interaction acceptance belong to the other independent specialties.

## Research and applicable criteria

The current [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) treats readable measure, line spacing, heading proximity and surrounding space as related choices. Its 45–90 character guidance is a reading heuristic, not a WCAG compliance threshold. The current [NN/g visual hierarchy guidance](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) supports using restrained differences in scale, contrast and grouping to establish an intended reading order. These primary pages were opened for this review.

The accepted local Stripe Press and Telescope captures were inspected directly. Their relevant lesson here is disciplined scale and quiet space around an identifiable subject, not copying a font or adding effects to every surface. The Handrail palette, unchanged wordmark, heavy sans-serif headings and restrained warm rules remain coherent with the approved direction.

## Evidence actually inspected

Fresh Chromium captures of the resume, proposal notes and ordinary proposal reading at 1440 × 1000, 390 × 664 and 320 × 740. Additional resume/header captures at 760, 768, 900 and 1024 pixels wide tested the transition between phone and desktop composition. All requested routes returned HTTP 200 with no measured horizontal page overflow at those widths.

The generated resume PDF was rasterized with Poppler and both complete Letter pages were inspected at 1400px. It contains two pages. The first page establishes identity, experience, education and tools; the second separates proposed Handrail contributions from public work. Neither page has split contribution rows, cropped text, stray blank pages or an intrusive watermark. The faint official watermark is decorative, clear of the main content, and does not compete with the explicit “Prepared for Handrail” label.

Evidence is ignored under `qa-artifacts/round-3/editorial/`: viewport/full-page PNGs, every PDF page, `measurements.json`, `tablet.json`, `line-measure.json`, and reproducible local capture scripts. Full-page browser PNGs supplement viewport inspections; downscaled long screenshots alone are not accepted as proof of readable type.

## Findings requiring correction

### ED-01 — P2: unnecessary phone top space delays the candidate's identity

At 390 × 664, the 84px header ends at y84 while the resume actions begin at y178, leaving a 94px empty band. At 320 × 740, action wrapping pushes the name to y357 and the introductory profile to y554. This consumes scarce initial-view space before conveying the candidate's background. The resume's mobile padding is substantially larger than the notes page's appropriate header clearance.

Bounded correction: reduce the phone resume top padding from 178px to approximately 112px, retaining a deliberate 28px gap beneath the header, existing action tap sizing and the 24px actions-to-sheet separation. Preserve the desktop composition. This is a spacing/hierarchy defect for the requested short-phone experience, not an argument for removing all breathing room.

Verification: fresh 320 × 740 and 390 × 664 opening captures show the full name/role and useful introductory content sooner, with no header or control collision. Initial evidence: `resume-320-initial.png`, `resume-390-initial.png`.

Status: resolved and independently rechecked. Phone top padding is now 112px. Fresh 320px and 390px captures show the name 66px earlier with clean spacing; the 390 × 664 opening includes the complete introductory profile. No header collision or horizontal overflow.

### ED-02 — P2: desktop experience prose has an excessively wide measure

Actual glyph-position line grouping at 1440 × 1000 finds experience bullet lines of 110–125 characters at 15px, and the earlier-experience paragraph at 124/124/95 characters. The forecasting-dashboard bullet leaves “reporting.” alone on its second line. This is readable in the literal sense, but the long eye travel and uneven final lines weaken an otherwise composed editorial sheet. The contribution prose also approaches 100 characters per line. The introduction's roughly 80–92 characters is materially better.

Bounded correction: constrain screen-only experience lists and earlier-experience prose to approximately 70–72ch, and use a similar practical maximum for contribution body/supporting paragraphs. Tune against actual rendered lines rather than trusting the CSS `ch` token to equal a character count. Keep headings/dates on the existing clear grid. Explicitly restore unconstrained print measure in print styles so the reviewed two-page PDF does not accidentally repaginate.

Verification: fresh desktop inspection and glyph-line measurements show shorter, balanced lines (roughly 70–95 characters for these passages); the short orphan “reporting.” is gone; page two remains visually balanced. Recheck both PDF pages after any regeneration. Evidence: `resume-1440-initial.png`, `line-measure.json`.

Status: resolved and independently rechecked. Fresh desktop glyph measurements place the primary experience lines at 78–93 characters and the earlier-experience paragraph at 89/90/90/74. The isolated “reporting.” line is gone. Short contribution rows remain coherent at up to 98 characters, an acceptable contextual exception rather than a rigid numerical failure. The page-two screenshot retains aligned labels, body and restrained evidence columns. Both regenerated PDF pages were rasterized and inspected again; the two-page composition remains intact.

## Nonblocking judgments and test diagnosis

- The 760–900px desktop header wraps its four labels into two lines but keeps aligned rows, separation and no overlap. A compact tablet header could be a later refinement; this review does not classify deliberate two-line labels as a functional defect.
- The resume PDF's 9.3pt primary body and smaller supporting labels are readable in the inspected Letter output. Increasing all print type without reducing copy would risk breaking the deliberate two-page split; no blanket enlargement is requested.
- The subtle watermark should remain subtle. Making it darker would diminish the document's professional hierarchy.
- A PDF consistency check failure on “Engineering and implementation” is caused by `pdftotext -layout` interleaving the left heading and right body. The complete two-line heading is visibly present. The implementation changed to the extractor’s normal reading-order mode and the full canonical check now passes. No required text was removed from verification and the designed grid was preserved.

## Acceptance boundary

Accepted for the bounded editorial/document scope after both corrections and fresh independent browser captures. Both final PDF pages were rendered and inspected following the content/spacing revision. Initial rejected screenshots and glyph measurements remain in `qa-artifacts/round-3/editorial/before/`; current evidence stays at the parent artifact path. No remaining blocking editorial finding was found. No broad redesign or additional animation library is indicated by this review. Browser screenshots are not physical-iPhone or manual assistive-technology certification.
