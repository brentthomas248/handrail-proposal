# R7 — Inclusive interaction and responsive UX

**Score: 97/100. Two P3 findings; no P0–P2 defect observed in this bounded review.** This is an independent design assessment of the frozen candidate, not accessibility or physical-device certification.

## Candidate and independence

Reviewed `http://127.0.0.1:4321/handrail-proposal/` on 27 September 2026. All 28 served files matched `qa-artifacts/final-design/candidate-v7/identity.json` before and after the review. Main HTML SHA-256: `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4`.

I read the assigned task, neutral brief, AGENTS, PROJECT, DESIGN, local-workflow and reference-basis documents. I did not read prior or peer reviews, scores, remediation/progress records, or IMPLEMENTATION.md. All evidence below was produced and visually inspected during this review. No application files were edited, no build was run, and nothing was committed or published. My isolated browsers and portfolio popup were closed.

Identity receipts: [start](../../qa-artifacts/final-design/r7/interaction/identity-start.json), [end](../../qa-artifacts/final-design/r7/interaction/identity-end.json). Evidence root: `qa-artifacts/final-design/r7/interaction/`.

## Scope and method

Headed Chromium, installed Playwright 1.63.0; original viewport captures, accessibility snapshots, native wheel input, keyboard input, one Chromium touch-scroll emulation, and axe WCAG A/AA checks. Local-only Agentic UI QA is authorized by the repository workflow; no Stagehand/Browserbase or credentialed services were used. The read-only lifecycle router selected `product-proof-or-visual-qa` without blockers; this report covers only the assigned specialty.

| Viewport | Representative coverage |
| --- | --- |
| 1440×1000 | All six tour stops; forward/reverse native wheel segments; 16-step keyboard traversal; visible focus and reading-link handoff |
| 390×844 | Opening, beginning, both rates, window; keyboard; normal reading, return, notes/back, skip link, Home/End, wheel reversal and touch emulation |
| 320×740 | Opening and all six content chapters across the matrix/closeout captures; no-JS, reduced-motion and text-spacing on proposal, notes and resume |
| 390×664 | Opening, beginning, both rates and window; height-only resize from 390×844 preserved Client first |
| 768×1024 | Opening, beginning, two-path comparison and window |

The checks were representative rather than an exhaustive cross-product regression suite. Phone DPR 3 was used for matrix captures; diagnostic rechecks used DPR 1. Core evidence is in [matrix.json](../../qa-artifacts/final-design/r7/interaction/matrix.json), [flows.json](../../qa-artifacts/final-design/r7/interaction/flows.json), [fallback.json](../../qa-artifacts/final-design/r7/interaction/fallback.json), and [recheck.json](../../qa-artifacts/final-design/r7/interaction/recheck.json). The four `.mjs` scripts beside these receipts preserve the actual actions.

## Scores

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Navigation and affordance | 19/20 | Persistent reading control, recognizable document/portfolio links, named chapter buttons, selected-chapter indication and 44px chapter targets make the unusual presentation usable. Narrow chapter navigation scrolls focused controls into view. Deduct 1 for the incomplete heading label in R7-I02. |
| Keyboard/focus | 20/20 | Visible 3px focus treatment, logical header/chapter order, no trap, and working Home/End. Tab through chapter controls preserves the tour; focusing the paper notes link restores reading and exposes the focused link. Skip activation opens normal reading; the next Tab reaches the content link rather than restarting the header. No actionable defect in the tested paths; 0 deducted. |
| Responsive/reflow/spacing resilience | 20/20 | Complete ideas remain readable at the sampled stops, including both rate explanations/common terms at 320px and the short-phone window. All nine 320px fallback/document combinations had document width equal to 320px. Standard spacing overrides retained content and controls, with ordinary reading selected automatically. Height reduction preserved the active chapter. No actionable content loss; 0 deducted. |
| Reduced-motion/no-JS reading | 20/20 | Both paths immediately provide ordinary document reading and the full proposal, collection table, notes and resume. The tour transcript exposes one coherent semantic content sequence independently of away-facing paper. Reduced-motion avoids the 3D journey. No actionable fallback loss in this scope; 0 deducted. |
| Links/history/document usability | 18/20 | Shared `#cash-flow` and `#window` URLs open the corresponding ordinary-reading sections. Notes TOC anchors and Back work. Returning from notes restores a responsive tour. Both PDF downloads match the manifest, and the GitHub link opens the intended public profile. Deduct 2 for the noticeable one-chapter return error in R7-I01. |
| **Total** | **97/100** | **3 points deducted, with no duplicated deduction.** |

## Findings

### R7-I01 — P3: returning from the closing reading section chooses the preceding chapter

**Observed impact:** A reader who has reached the end and switches back to the tour is moved to the 90-day window rather than the closing section they just read. The next chapter remains accessible, so this is a minor place-preservation defect rather than blocked access.

**Reproduction:** At 390×844, select Client first, choose Read normally, wheel down to the document bottom, then choose Take the tour. Reproduced in two fresh headed contexts, including one mobile-emulated context. Before the switch, the entire closing section occupies y=168.59–696.80; only the trailing fragment of the prior window remains at the top. The returned tour selects The window, 05/06, at scrollY=4780.5 instead of Grow together.

**Evidence:** [reading before](../../qa-artifacts/final-design/r7/interaction/recheck-reading-bottom.png), [tour after](../../qa-artifacts/final-design/r7/interaction/recheck-return-bottom.png), `recheck.json` → `readingBottom` / `returnFromBottom`; first independent reproduction in `flows.json` → `readingAfterWheel` / `tourAfterReadGesture`.

**Bounded correction:** When resolving the ordinary-reading position, account for the last section occupying the dominant visible reading area at the document end. Do not let a small remaining fragment of the preceding section win simply because it crosses the upper reading line. Preserve the existing explicit focused-link precedence where the user has not subsequently scrolled.

**Recheck:** Repeat this route on 390×844 and desktop; the closing reading section should return to Grow together. Recheck a mid-document return and a focused-link return to ensure their place is still retained.

### R7-I02 — P3: the window heading omits “90” from the heading outline

**Observed impact:** Heading-only navigation exposes “days to begin.” while the prominent visual heading reads “90 days to begin.” The number remains in the normal reading sequence immediately before the heading, so no commercial term is missing; the heading outline is simply less informative than the visible hierarchy.

**Evidence:** [tour accessibility snapshot](../../qa-artifacts/final-design/r7/interaction/flows/tour-aria.yml) shows `strong: "90"` followed by `heading "days to begin." [level=2]`. Independently reproduced in all three proposal entries in `fallback.json` (no-JS, reduced-motion, spacing). [Visible counterpart](../../qa-artifacts/final-design/r7/interaction/shared-window.png).

**Bounded correction:** Include the number inside the same semantic heading while retaining its separate visual styling, or otherwise give that heading the complete accessible name without duplicating the number in sequential reading.

**Recheck:** Accessibility snapshots in tour, ordinary reading, no-JS and reduced-motion should expose one level-two heading named “90 days to begin.” Keep the existing appearance and complete text order.

## Supporting evidence and dispositions

- Axe reported zero violations on the 390px tour and notes page, and the 320px reduced-motion resume. These three automated samples support the review; they do not establish universal conformance. The accessible collection table has column/row headers and the complete illustration/cost qualification.
- The keyboard captures include a high-contrast skip link, visible chapter focus and visible footer focus. Native wheel samples change both scroll position and the rendered transform in both directions; touch emulation moved from scrollY 3420.5 to 4098.5. No control became stuck after notes Back.
- Text spacing used line-height 1.5, paragraph spacing 2em, letter-spacing .12em and word-spacing .16em. At 320px the heavily spaced headline wraps within words, but characters, content and controls remain available without horizontal scrolling. This is not counted as clipping or a defect. [Cover viewport](../../qa-artifacts/final-design/r7/interaction/spacing-viewport-cover.png), [collection viewport](../../qa-artifacts/final-design/r7/interaction/spacing-viewport-rates.png), and complete `spacing-*.png` captures retain the evidence. The test follows [WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html); the values test adaptation, not authored typography.
- Focus/target/reflow judgment was informed by the primary [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) explanations, opened during this review.
- Both PDFs downloaded through their visible links, have two pages, report `Tagged: yes`, retain extractable text, and match the frozen PDF hashes. I inspected all four rendered pages (`pdf-notes-1/2.png`, `pdf-resume-1/2.png`): no missing text, clipping or overlaps observed. Poppler emitted Type 3 glyph bounding-box warnings, but the rendered pages and extracted text did not reproduce a visible content defect. This is a tool observation, not a scored product defect or a claim that PDF tag structure is fully validated.
- The visible GitHub action opened `https://github.com/brentthomas248`, title `brentthomas248 (Brent Showalter) · GitHub`, in an isolated popup. No authenticated state or external mutation was used.

## Limits and closeout

No physical iPhone/iPad, Safari/WebKit, Firefox, native browser-chrome occlusion, operating-system zoom, VoiceOver/NVDA or other manual assistive-technology session was tested. Touch and reduced-motion are Chromium emulation. No PDF/UA certification, complete PDF reading-order audit, sustained performance profiling, external portfolio content audit or full lifecycle certification is claimed. The native wheel pass sampled the forward/reverse journey; it is not a frame-by-frame motion review.

The frozen candidate remained unchanged across all 28 manifest entries at closeout. The only durable report written is this file; all scripts, downloads, screenshots and receipts are under the assigned ignored evidence directory. Two P3 corrections remain optional under the neutral release rubric; there is no observed P0–P2 blocker in this category.
