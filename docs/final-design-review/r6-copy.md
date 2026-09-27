# Round 6 independent review — Commercial copy and information grouping

Reviewer: fresh independent design specialist (commercial copy). No earlier reviews, scores, remediation notes or IMPLEMENTATION.md were read. Inputs: AGENTS.md, PROJECT.md, DESIGN.md, docs/local-workflow.md, docs/final-design-review/brief.md, docs/redesign-research.md, docs/brand-sources.md, the canonical content sources (`src/content/proposal.ts`, `src/content/resume.ts`), the page/component sources for the flyer, notes and comparison, and my own rendered evidence.

## Candidate identity

- Base: `http://127.0.0.1:4321/handrail-proposal/`
- Main HTML SHA256 at start and end of review: `4bbf53ca026403ff3fdfec570aa056f91990c4840558d842611a4a85fb53197c` (matches `qa-artifacts/final-design/candidate-v6/identity.json`).
- All 28 entries in `identity.json` (HTML routes, both PDFs, fonts, logo, grain, social assets, licenses) re-fetched and hash-verified: 28/28 match. Receipt: `qa-artifacts/final-design/r6/copy/evidence/identity-check-start.json`.
- Candidate unchanged at the end of the review (hash re-fetched after all captures).

## Scope and evidence

Headed Chromium (isolated contexts, `@playwright/test`), device scale 3 under 760px, 1 above. Every screenshot was inspected as an original file, not a contact sheet.

| Surface | Coverage |
| --- | --- |
| Tour, 1440×1000 | Overview + all 5 chapters; 8 forward native-wheel frames and 3 reverse frames; reading mode full page |
| Tour, 390×844 | Overview + all 6 chapters; 8 forward + 3 reverse wheel frames; reading mode full page |
| Tour, 320×740 | Cash flow, Hire first, Client first, The window, Grow together |
| Tour, 390×664 | The beginning, Cash flow, Client first, The window, Grow together |
| Tour, 768×1024 | Cash flow, The two paths, The window |
| No-JavaScript | 390×844 and 1440×1000 full pages |
| `/agreement/` and `/resume/` | 1440 and 390 full pages; visible text extracted |
| PDFs | Both rasterized (Poppler) and text-extracted; compared sentence-by-sentence with the routes |
| Measurements | Per chapter: every painted text line of the active group vs. the measured header/control safe area; painted-in-view occurrences of the deliberately duplicated rate copy; neighbouring groups inside the safe area. `measurements.json` |

Console/page errors across all tour runs: none.

Protocol artifacts identified and excluded from findings:

- Full-page screenshots of reading mode show the fixed header and skip link painted mid-page. That is how fixed elements land in a stitched capture, not a layout defect; the viewport captures and no-JS pages show correct placement.
- Computed font sizes on the paper (e.g. 14.4px cover eyebrow at 390) are pre-transform CSS values; the camera scales the paper, and the screenshots show large readable text.
- The rect probe reported two `rate-common` paragraphs "in view" during the phone window chapter. The screenshot shows only the window group; the boxes sit under the opaque header or are projected out of the visible stage. Screenshot governs.

## Scores (each 0–20)

### 1. Immediate proposition — 19

The folded packet shows the closing headline and the economic sentence; the first opened scene delivers eyebrow → "Let's grow Handrail." → "No base salary. Commission follows collected revenue." → "Begin with new business. Build the relationship from there." That is the whole offer in four lines and it survives every viewport, no-JS and reading mode. The masthead's "For discussion" sits on the same face. Deduction (−1): the packet's closed face leads with "New business. Room to grow." and the opened cover leads with "Let's grow Handrail."; two headlines inside the first five seconds is a brochure convention and not wrong, but the second is the stronger and could be the only one. Negligible; no finding.

### 2. Compensation precision — 19

Rates, qualifiers and arithmetic are exact and consistent everywhere: $120,000 / 12 = $10,000; 15% → $1,500 / $8,500; 20% → $2,000 / $8,000; $500 per installment; $18,000 vs $24,000 (−$6,000 difference stated correctly); 5% of $2,000 = $100. "Handrail keeps, before costs" plus "Before all company costs. Illustration only; not Handrail pricing." keeps the retained cash from reading as profit. Benefits are consistently "requested" and named as a separate company cost. Client-first scope ("on this client and all my future credited sales") matches the notes ("the triggering client and all future credited sales under our relationship"). Deduction (−1): the flyer's "+ 5% of collected recurring fees" carries no duration or "to be agreed" signal, while the notes list "Recurring commission duration" as open (F3). Disclosed in the notes, so minor.

### 3. Concise persuasive language — 18

Short declaratives ("Collect first. Pay commission second."), no legal boilerplate, no invented deadlines or tails, no signature language. Deductions: (−1) the client-first premium is described but not argued on the flyer or in the notes. "That start earns 20%…" and "The additional 5 percentage points are proposed for bringing in the qualifying client before the hire" state the trigger, not the reason Handrail should accept paying more (the client funds the hire and the originator carried the risk) — the research brief's rationale was stronger than what shipped (F4). (−1) Notes section 2 repeats "There is still no base salary in this proposal." after section 1 already made the point; small redundancy in an otherwise tight document.

### 4. Hierarchy and related-copy spacing — 18

Phone reading groups are exemplary: each rate scene owns "Two ways to begin" → path label → rate → recurring → description → scope → shared terms, with a rule before the shared line. The 90-day sequence and the contribution group each stay whole on every phone viewport, including 320×740 and 390×664. The comparison table keeps its row label above the two values on narrow widths and the difference/rule/qualifier lines stay attached beneath it. Deductions: (−1) at 320×740 the table's column headings break unequally — "Hire first 15%" on one line, "Client first" with "20%" dropped to a second line — so the two paths no longer read as a matched pair (F1). (−1) at 768×1024 the "Two ways to begin" scene exposes the first line of the next group ("No client and no hire by") clipped behind the control bar, a stray fragment of a different idea inside the active frame (F2).

### 5. Proposal / resume / notes consistency — 19

The notes route and the PDF contain an identical sentence set (introduction, seven numbered sections, comparison, endnote). The resume route and its PDF match word for word; only column reflow differs in extraction. Flyer terms, notes and PDF agree on every number and qualifier. Resume facts respect the stated boundary: 2025 bachelor's, graduate coursework not represented as a degree, Handrail contributions phrased as proposed. Deduction (−1): the download is named `handrail-proposed-agreement.pdf` under the `/agreement/` route while the document, header link and page title all say "Proposal notes"; the saved file therefore carries a different status label than the artifact (F5). Minor, "proposed" still hedges.

**Total: 93 / 100.** No P0–P2 defects found; nothing in this category makes release ineligible.

## Findings

| ID | Severity | Observation and user impact | Evidence | Bounded fix | Recheck |
| --- | --- | --- | --- | --- | --- |
| F1 | P3 | At 320px the comparison headings wrap unequally: "Hire first 15%" stays on one line, "Client first" pushes "20%" to a second line. The paired comparison momentarily reads as two differently shaped labels. | `evidence/small-320x740/02-cash-flow.png` | Under ~340px in the tour, make `.collection-rate` break consistently for both headings (block display, as the notes route already does under 760px) or tighten the inline gap so both fit. | 320×740 Cash flow: both headings share the same line structure. |
| F2 | P3 | At 768×1024, "The two paths" scene shows the start of the 90-day group under the shared-terms rule, with "No client and no hire by" cut by the control bar. A fragment of the next idea sits inside the active frame. | `evidence/tablet-768x1024/03-the-two-paths.png` | Nudge the tablet paths pose upward or increase the window group's top margin at the tablet width so the 90-day heading is either fully outside the safe area or fully readable. | 768×1024 The two paths: no text line of the window group intersects the control-bar boundary. |
| F3 | P3 | The flyer's recurring line has no duration signal; the notes list duration as open. A flyer-only reader could assume an indefinite tail. | `evidence/desktop-1440/03-the-two-paths.png`; `documents/agreement-text.txt` §7 | Accept as disclosed in notes, or add "duration to agree" to the shared-terms line if the added length still fits the phone rate scenes. | If changed: phone rate scenes still complete inside the safe area; notes/PDF regenerate from the same source. |
| F4 | P3 | The premium's reason is stated as a trigger, not an argument. Handrail leadership is asked to pay 5 more points without the one-sentence "why" (the client funds the hire; the originator carried the risk). | `evidence/phone-390x844/04-client-first.png`; notes §3 | One sentence in notes §3 (and optionally the flyer client-first reason) stating the rationale; no new terms. | Notes §3 contains the rationale; PDF check passes; flyer scene still fits. |
| F5 | P3 | Downloaded file is named "proposed-agreement" while the artifact is titled "Proposal notes". | `documents/agreement.html` (download link), `pdfinfo` title | Optional: set a `download` filename matching the title. Stable filename is an accepted product decision; disposition may be "accept". | Saved file name matches the visible title, or disposition recorded. |

No preference-only items were counted as defects. Items I considered and rejected as defects: the two-headline packet/cover sequence (convention), the desktop window scene's empty paper below the group (composition, outside this category and the group itself is complete), repeated "Both paths" copy in the DOM (only one instance is painted in any scene, mode or viewport — verified).

## Untested limits

- No physical iPhone, Android or tablet hardware; no manual VoiceOver/TalkBack reading of the transcript. Device emulation is not device certification.
- WebKit/Safari rendering of the copy layouts was not captured in this review.
- Wheel-driven travel was sampled at 8 forward and 3 reverse frames per desktop/phone run for copy coherence; motion quality itself belongs to the motion specialist.
- Print-from-browser of `/agreement/` was not exercised; the shipped PDF was inspected instead.

## Evidence paths

- Report: `docs/final-design-review/r6-copy.md`
- Evidence root: `qa-artifacts/final-design/r6/copy/evidence/`
  - `identity-check-start.json` — 28/28 hash verification
  - `run.mjs`, `measure.mjs` — capture and measurement scripts (headed Chromium)
  - `manifest.json`, `measurements.json` — chapter positions, safe-area fits, painted-copy counts
  - `desktop-1440/`, `phone-390x844/`, `small-320x740/`, `short-390x664/`, `tablet-768x1024/` — chapter, scroll and reading-mode captures with `errors.json`
  - `docs-1440/`, `docs-390/` — notes and resume full pages
  - `nojs-390/`, `nojs-1440/` — no-JavaScript full pages
  - `documents/` — both PDFs, rasterized pages, extracted texts, route HTML and route text
- All browsers launched by this review were closed by the scripts; no review-owned Chromium processes remain.
