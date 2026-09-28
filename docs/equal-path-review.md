# Equal-path rendered review

## Decision

Accepted locally for the narrow correction: both compensation paths now use the same initial commission basis and the same later phase. The initial percentage is 15% for hire first and 20% for client first; each becomes 5% recurring from service month 13. No material finding remains in the reviewed rate groups, ordinary-reading layout, notes or PDF. This is a fresh independent review of the candidate, not a reuse of historical design scores.

## Candidate and method

Reviewed September 27, 2026 (capture completed September 28 at 03:41 UTC), from the current production build at `http://127.0.0.1:4321/handrail-proposal/`.

- HTML SHA-256: `6ddb5e3b3c0fdbf4a116b06b8ad46097be1d51f1c0e445bf21f3304ebb36e3e0`.
- Canonical content SHA-256: `874b6e91714125edd4b8909fb517fb1cacb40dffdd6b480ea2bc00cceed5aa89`.
- CSS SHA-256: `70b2cdefb8cd56dad659dd5f83b922ee1ead4cc9636f851f399eb9c6b60ed5b6`.
- Proposal PDF SHA-256: `25d6a4e8f2f31b5f292f1a0b480cf2b316a4e74e18bc860030828790754221e6`.

The review followed [the approved local workflow](local-workflow.md), the Agentic UI lifecycle `product-proof-or-visual-qa` route, its QA spoke, and the PDF visual-review skill. Runtime-safety validation passed. Local Playwright captured the rendered app; the independent reviewer inspected the resulting images. Stagehand and Browserbase remain omitted under the existing project authorization. No app code was edited by this reviewer.

Evidence is ignored under `qa-artifacts/equal-path-review/`: `capture.ts`, `capture.json`, per-size rate/reading/notes PNGs, videos, both rendered PDF pages and `notes-viewport-check.json`. Reproduce the scoped browser capture with `node qa-artifacts/equal-path-review/capture.ts` after rebuilding the candidate.

## Rendered findings

| Viewport              | Rate composition                       | Result                                                                                                              |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Desktop 1440 × 1000   | Both paths together                    | Matching hierarchy, aligned economic phases, complete scope and common benefits text.                               |
| Phone 390 × 844       | Hire first and client first separately | Each scene retains its heading, initial basis, 5% transition, explanation, credited-sales scope and benefits.       |
| Small phone 320 × 740 | Hire first and client first separately | The complete ideas fit; neither the first-year subscription label nor the month-13 label is clipped.                |
| Short phone 390 × 664 | Hire first and client first separately | Both full compositions remain above controls and below the header; no isolated giant sentence or primary-copy crop. |

All seven selected compositions passed the measured safe area: 137 text-line rectangles, zero clipping. The economic labels match exactly across both paths, and computed font family, size, weight, line height, tracking and color match for the path heading, percentage, initial basis, recurring phase and explanation. Visual inspection confirms comparable hierarchy and the preserved paper presentation. The paths appropriately retain different explanations of when the hire happens.

Ordinary-reading rate sections and proposal notes have no horizontal overflow at all four sizes. The rate hierarchy remains parallel in desktop columns and the stacked phone layout. No page errors, console errors or HTTP failures were captured.

Some tall element-only notes captures included the normally offscreen skip link. A fresh viewport check at both constrained phone sizes showed the unfocused link entirely outside the viewport (`top: -100`, `bottom: -48`) and no visible overlay. This was an element-capture artifact, not a reproduced product defect; the original capture and viewport evidence remain available.

## Economic and PDF verification

The notes and rendered two-page PDF consistently state 15% or 20% of collected build fees and collected subscription fees for each credited customer's first 12 service months, then 5% from service month 13. The first path covers credited sales under the relationship; client first also explicitly includes the triggering client. Collection-first payment, requested benefits and the proposal-for-discussion status remain intact.

The subscription example correctly shows $300 versus $400 on a $2,000 collection for service months 1–12, then $100 under either path from month 13. The 5% replaces the initial rate. The build illustration retains $1,500/$2,000 commission per $10,000 collection and $18,000/$24,000 conditional build totals, with before-costs and build-only qualifications.

Both PDF pages were rendered with Poppler and visually inspected: no missing text, overlap, cropped copy, malformed table or stray page appears. Poppler emitted `Bad bounding box in Type 3 glyph`; the inspected output showed no corresponding visible defect. `node scripts/verify-pdf.ts` passed the introduction, seven ordered sections, comparison labels and amounts, 13 complete paragraphs, six discussion items and discussion status.

The app diff in this correction is canonical terms plus the same full-width mobile recurring descriptor rule for both paths. No camera or gesture implementation changed. This review exercised arrival at the affected reading groups and ordinary-reading access; it does not recertify the complete motion journey, physical iPhone stability or publication. Publication remains a separate release-owner step.
