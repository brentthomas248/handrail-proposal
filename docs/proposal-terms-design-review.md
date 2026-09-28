# Proposal terms: independent rendered review

## Verdict

**Accept the revised local candidate.** No unresolved material visual finding remains in this scoped content/layout review. This is a fresh review of the current render, not an extension of an earlier design score or publication receipt.

Reviewed on 2026-09-27 at `http://127.0.0.1:4321/handrail-proposal/` under the [approved local workflow](local-workflow.md). The change preserves the established trifold, paper treatment and camera choreography while correcting the commission explanation. Publication and hosted verification remain separate outcomes.

Final reviewed HTML SHA-256: `539783b6d7f2d4ce69b0c6bcb09a3e04ddbd659b8dda9fcd5eea91c2748219e1`.

Reviewed proposal PDF SHA-256: `d226f65169e7d301b2294ec890780b972ec5a712a4484193bc51090536d700b3`.

## Finding and disposition

**P2 — The first mobile client-first layout weakened the rate transition. Closed.** At 390×844, 320×740 and 390×664, “recurring from service month 13” formed a narrow four-line column beside “then 5%.” The longer scope paragraph added density below it. Every line fit, but the complete idea was harder to scan and the rate transition looked cramped. A passing bounds measurement was insufficient to accept that composition.

The revised mobile layout places the descriptor below “then 5%,” using the full column width. The descriptor now occupies two orderly lines, and the shorter scope paragraph retains both the triggering client and future credited sales. The full block, heading and shared salary/benefits qualification remain together. Desktop preserves its two-column comparison and aligned rate/divider hierarchy.

The first candidate remains under `qa-artifacts/proposal-terms-review/candidate-1/`, including `phone-client-first.png`, `small-phone-client-first.png` and `short-phone-client-first.png`. The corresponding files in `qa-artifacts/proposal-terms-review/` show the accepted correction. First-candidate HTML SHA-256: `0d70d650f892564ad8e08570ba83b021d6636cf866fc7f6f80f51b2353830e7e`.

## Current rendered evidence

Independent Playwright capture drove the actual browser with wheel input through the opened overview, every reading chapter, closing fold and reverse return. Screenshots were taken after `tests/helpers/tour-settled.ts` observed stable native scroll and transforms. Opening/closing intermediate frames, animation-frame transform samples and videos were also retained. Review included the visible composition rather than only selected-element bounds.

| Viewport | Complete reading groups | Visual result |
| --- | ---: | --- |
| 1440×1000 | 6 | Clear two-path comparison; complete window and partnership groups; no primary clipping. |
| 390×844 | 7 | Separate complete rate scenes; clear revised rate transition; persistent résumé/GitHub navigation. |
| 320×740 | 7 | Client-first terms, common qualification and cash illustration remain readable inside the chrome boundaries. |
| 390×664 | 7 | Complete ideas remain visible without turning the short window or partnership copy into isolated macro crops. |

The final capture contains 51 evidence records, 27 measured reading groups and 360 primary text-line rectangles. No primary line crossed the safe area inset 24px from the measured stage/header/control boundaries. There was no horizontal overflow in normal reading or proposal notes at any of the four sizes. The browser recorded no page errors, console errors or HTTP responses at or above 400.

- **Commercial hierarchy:** The cover retains “No base salary” and collections-first language. The cash scene explicitly says build-only, compares $1,500/$2,000 commission and $8,500/$8,000 remaining from a $10,000 collection, and keeps the before-costs/not-profit qualification visible. The rate scenes clearly distinguish the initial 20% build/first-12-subscription-month basis from 5% recurring beginning in service month 13.
- **Context and spacing:** The 90-day scene retains all three steps with their explanations. The partnership heading, two body paragraphs and final-contract/notes invitation remain one coherent group. Peripheral paper fragments are outside the active composition; no active sentence or qualification is clipped by the header or chapter controls.
- **Material and motion smoke:** Independently captured opening frames show both wings unfolding around the rust center and reaching the recognizable Z-fold overview. Closing frames show the pullback and actual fold to the correctly oriented invitation and full-strength Handrail mark. Reverse input returns to the complete partnership scene at each size. The reviewed frames retain matte paper, restrained grain, thin edges and soft shadows. No new face occlusion was observed in these sequences.
- **Portfolio access:** The résumé and GitHub links are prominent in the desktop header and second mobile header row, including 320px. A browser click reached the local résumé and its Brent heading. The GitHub link retains `https://github.com/brentthomas248`, its accessible label and new-tab behavior. This review did not certify the external profile contents.
- **Ordinary reading and notes:** Full-page captures at all four sizes preserve the content in document flow. Targeted phone notes captures show all seven sections with clear headings, readable paragraph measure and aligned comparison columns.
- **PDF:** Both A4 pages were rendered with Poppler and visually inspected. Page 1 keeps the client-first explanation and complete comparison table; page 2 continues the separate build-total/subscription examples and sections 5–7. No clipped text, overlap, broken glyph, stranded heading or footer collision was observed. The PDF remains two pages. Poppler emitted three Type 3 glyph bounding-box warnings, but the visible pages rendered correctly.

## Execution and evidence locations

- `node qa-artifacts/proposal-terms-review/capture.ts` — final four-viewport browser capture passed. `capture.json` records the candidate hash, captures, lines, browser errors and video paths; `summary.json` records aggregate measurements.
- `pdfinfo dist/handrail-proposed-agreement.pdf` — two A4 pages, tagged, no forms or JavaScript.
- `pdftoppm -scale-to 1800 -png dist/handrail-proposed-agreement.pdf qa-artifacts/proposal-terms-review/proposal-pdf` — both pages rendered and inspected. The unchanged PDF renders are retained under `candidate-1/proposal-pdf-1.png` and `candidate-1/proposal-pdf-2.png`.
- `links-and-notes.json` and `short-notes-section-1.png` through `short-notes-section-7.png` record the link destination and targeted notes inspection. An initial auxiliary link probe used the visible mobile text instead of the actual accessible name and timed out; the corrected `My Handrail resume` probe passed without product changes.
- `TERM=xterm-256color dev-doctor` — no failures. The first invocation under `TERM=dumb` failed only the shell prompt check; the supported terminal declaration resolved it. Unrelated project-contract warnings remain workspace debt.

Stagehand and Browserbase remain omitted under the explicit local-workflow authorization. This review establishes the stated local Chromium render and interaction scope. It does not certify a physical iPhone, manual VoiceOver, field performance, actual GPU memory or hosted deployment. No product files were changed by the independent reviewer.
