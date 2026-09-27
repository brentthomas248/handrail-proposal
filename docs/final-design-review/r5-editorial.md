# Round 5 independent review: editorial typography and spacing

Category: Editorial typography and spacing (type hierarchy; line measure and rhythm; microspacing and wrapping; macro composition and whitespace; responsive/document consistency).

Reviewer stance: fresh independent specialist. No earlier reports, scores, remediation notes, IMPLEMENTATION.md or peer findings were read. Score is candid; no target was supplied.

## Candidate identity

- URL: `http://127.0.0.1:4321/handrail-proposal/`
- `index.html` SHA256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5` (matches `qa-artifacts/final-design/candidate-v5/identity.json`), verified at start and again after all captures.
- Also verified against identity.json: `agreement/index.html`, `resume/index.html`, `handrail-proposed-agreement.pdf`, `brent-showalter-handrail-resume.pdf`, `handrail-logo.png`, `paper-grain.svg`. All match.
- No app edits, rebuilds, commits or publication were made. Only this report and `qa-artifacts/final-design/r5/editorial/` (ignored) were written.

## Scope and method

- Tooling: installed `@playwright/test` 1.63, headed Chromium (`--disable-smooth-scrolling`), device scale 1/2/3 as appropriate. Native wheel input drove the forward journey; settled poses were captured after the app's idle settle, intermediate angled frames ~260 ms after input, and a reverse wheel pass covered the last two hinges.
- Core matrix covered in the tour: 1440×1000, 390×844, 320×740, 390×664, 768×1024 (settled poses for every stop, 2–4 intermediate frames per gap, three reverse frames each). Per-stop metrics recorded computed and effective on-screen font sizes, line counts, characters per line, last-line ratios, overflow and safe-area containment (`tour/tour-report.json`).
- Ordinary reading (`?view=read`), `/agreement/` and `/resume/` captured at 1440, 768, 390 and 320 with full-page renders sliced into viewport tiles and inspected as original captures, not contact sheets. WCAG 1.4.12 text-spacing overrides (line-height 1.5, letter 0.12em, word 0.16em, paragraph 2em) were injected before load for reading, notes, resume and the tour entry.
- Both PDFs downloaded from the candidate, hashes confirmed, rasterized at 110 dpi with `pdftoppm`, inspected page by page, plus `pdffonts` and `pdftotext -layout` for measure and font provenance.
- Scripts: `qa-artifacts/final-design/r5/editorial/scripts/{lib,tour,documents,tour-spacing}.mjs`, `tiles.py`.

## Scores

| Criterion | Score | Reasons and exact deductions |
| --- | --- | --- |
| Type hierarchy | 18 / 20 | Cover, cash panel, rates, window and closing carry a clear four-tier hierarchy in the tour, reading mode, notes and both PDFs; Playfair italic intro, Inter display and tabular figures are consistent across surfaces. −1: resume screen uses a 13px tier for real content (Education, Tools, foundation notes, proof descriptions) at 1440 and 768 (ED-6). −1: on phones the "+ 5%" recurring figure is presented as a top-aligned peer of the 62px build rate with no shared baseline (ED-3). |
| Line measure and rhythm | 16 / 20 | Tour measures are short and appropriate (23–45 cpl); reading mode body 21px at ~45 cpl; notes 18px/1.65 at 66–87 cpl. −2: cash-flow stop renders explanatory copy at 14.0px effective on 320×740 and 14.4px on 390×664, and the window stop at 14.3px on 320×740 (ED-1). −1: proposal PDF body runs ~93 characters per line at 10.5pt and the resume PDF ~102 at 9.3pt, both beyond a comfortable measure (ED-4). −1: three qualifier lines under the notes table drop to 9pt/1.35 against 10.5pt body, a visibly cramped step (ED-4). |
| Microspacing and wrapping | 17 / 20 | Rag, hyphenation avoidance and paragraph spacing are clean across the printed faces; currency columns keep tabular figures with 47–139px ink gutters and never collide. −1: the rate separator renders as a line-leading "· 15%" / "· 20%" wherever `.collection-rate` is block (desktop/tablet tour, reading ≥760, notes at all widths) and dangles at line end under text-spacing at 320 (ED-2). −1: single-word orphans on primary lines: "revenue." (cover statement, reading 1440), "terms." (notes endnote 1440), "first." (notes h2 at 768) (ED-5). −1: phone rate group stacks "of collected / recurring / fees" one word per line in a narrow second column (ED-3). |
| Macro composition and whitespace | 16 / 20 | Paper margins, mastheads and colophons are consistent; the opened spread reads as one composed sheet; phone scenes keep breathing room inside the header/control safe area. −2: proposal PDF page 1 ends after section 3 leaving roughly 40% of the page blank because section 4 is forced to a new page (ED-4). −1: start-aligned Window and Grow together scenes leave the lower 30–45% of the stage as empty ground with the paper's bottom edge visible (tablet Window fills ~25% of the safe area) (ED-7). −1: resume watermark sits 2px below the last Tools line at 1440 and ~15px at 768, crowding content (ED-6). |
| Responsive/document consistency | 18 / 20 | Copy, order and hierarchy match across tour, reading mode, notes, resume and both PDFs; text-spacing overrides switch the entry to reading mode, and reading, notes and resume preserve all content with no horizontal overflow or clipping at 1440/390/320. −1: the collections table header wraps differently by surface (inline rate on phones, block with a leading dot elsewhere) (ED-2). −1: proposal PDF footer is set in Arial (`FAAAAA+ArialMT` in `pdffonts`) while everything else is Inter (ED-4). |

Total: 85 / 100.

Release eligibility from this specialty: no P0 or P1. One P2 (ED-1) requires correction or an evidence-backed disposition before release. The rest are P3.

## Findings

### ED-1 (P2) Cash-flow and window scenes fall below 16px effective on small and short phones

- Impact: the scene that carries the money comparison shows "Illustration: $120,000…", "Client first: $500 more…", "Collect first…" and "Before all company costs…" at 14.0px effective on 320×740 and 14.4px on 390×664; the window steps read at 14.3px on 320×740. On 390×844 the same copy is 17.1px, so this is a fit constraint rather than authored size. Readers on small or short phones get the key qualifiers at footnote size.
- Evidence: `tour/320x740-02-stop-cash-flow.png`, `tour/390x664-02-stop-cash-flow.png`, `tour/320x740-05-stop-the-window.png`; `tour/tour-report.json` items for those stops (effectivePx 14, 14.4, 14.3).
- Cause (observed): the cash pose is height-limited (`availableHeight × 0.92 / box.height`) and the window pose is width-limited (`width × 0.76 / box.width` against a 680-unit mobile block).
- Bounded fix: on `max-width: 759px` tighten the cash face's vertical spacing (collected-amount margins, table cell padding, qualifier gaps) or allow the cash height fraction to approach 0.97; reduce the mobile `.flyer-window` block width from 680 to ~580 paper units so the width-limited scale rises. No copy changes.
- Recheck: re-run `scripts/tour.mjs` with `VIEWPORTS=320x740@3,390x664@3,390x844@3`; every `p`/`th`/`td`/`figcaption` in stops 2 and 5 reports `effectivePx ≥ 16` and `insideSafe: true`; visually confirm no clipping by header/controls.

### ED-2 (P3) Rate separator becomes a line-leading or dangling middle dot

- Impact: "Hire first" then "· 15%" on the next line reads like a stray bullet in the desktop and tablet tour, reading mode ≥760 and the notes page at all widths; under text-spacing at 320 the dot dangles at the end of "Hire first ·" and then leads "· 20%".
- Evidence: `tour/1440x1000-02-stop-cash-flow.png`, `documents/tiles/read-1440x1000-full-02.png`, `documents/tiles/notes-1440x1000-full-02.png`, `documents/tiles/read-320x740-spacing-full-02.png`.
- Bounded fix: remove the literal " · " from the markup and supply it via `.collection-rate::before { content: '· ' }` only under the rules where `.collection-rate` is `display: inline`; when block, no separator.
- Recheck: at 1440/768 tour and reading, notes 1440/390, and 320 with text-spacing, no text line begins or ends with "·"; header cells still read "Hire first · 15%" inline on phones.

### ED-3 (P3) Phone rate group: mismatched peers and one-word lines

- Impact: on Hire first / Client first phone scenes the 62px "15%"/"20%" and the 30px "+ 5%" are top-aligned side by side; the second column's label wraps "of collected / recurring / fees" one word per line. The pairing looks unresolved next to an otherwise composed sheet.
- Evidence: `tour/390x844-03-stop-hire-first.png`, `tour/320x740-03-stop-hire-first.png`, `tour/390x664-04-stop-client-first.png`.
- Bounded fix: in the `max-width: 759px` `.deal-path` grid use `align-items: baseline` for row 2, or move `.deal-recurring` below the rate label full-width (grid-column 1/-1) with the "+ 5% of collected recurring fees" on one or two lines.
- Recheck: Hire/Client stops at 320×740, 390×664, 390×844 show the recurring label in ≤2 lines and either a shared baseline or a clear subordinate placement; group stays inside the safe area.

### ED-4 (P3) Proposal PDF: half-empty page 1, Arial footer, long measure, cramped qualifiers

- Impact: page 1 stops after section 3 with ~40% blank paper; the footer "Handrail / Brent Showalter — For discussion" and "1 / 2" are Arial; body lines average 93 characters; the three qualifier lines under the table drop to 9pt/1.35 with 2mm gaps.
- Evidence: `pdf/proposal-1.png`, `pdf/proposal-2.png`, `pdffonts` output (ArialMT), `pdf/proposal.txt` line lengths (avg 93, max 114).
- Bounded fix: in `src/pages/agreement.astro` print CSS drop `break-before: page` on section 4 and keep `break-inside: avoid` on the figure (or move the break to section 5 if the figure still splits); pass a footer template with `font-family: Inter` to the generator; widen `@page` side margins toward 22mm; raise the qualifier lines to 9.5–10pt with 2.5mm spacing.
- Recheck: regenerate, rasterize both pages, confirm page 1 ink extends past 75% of the page height, `pdffonts` lists no ArialMT, average line length ≤ 85 characters, and `pnpm pdf:check` still passes.

### ED-5 (P3) Single-word orphans on primary lines

- Impact: "No base salary. Commission follows collected / revenue." at reading 1440 (last line 19% of measure); notes endnote ends with "terms." alone at 1440 (6%); notes h2 "1. No base salary. Revenue comes / first." at 768 (13%).
- Evidence: `documents/tiles/read-1440x1000-full-01.png`, `documents/tiles/notes-1440x1000-full-04.png`, `documents/tiles/notes-768x1024-full-01.png`; `documents-report.json` lastLineRatio.
- Bounded fix: `text-wrap: balance` on `.cover-statement` and `.document-section h2`; `text-wrap: pretty` on `.document-endnote` and `.document-section p` (progressive enhancement, no layout risk).
- Recheck: last-line ratio ≥ 0.25 for those elements at 1440 and 768; no new orphans at 390/320.

### ED-6 (P3) Resume screen: 13px content tier and watermark crowding

- Impact: Education, Tools, foundation lines and proof descriptions are 13px on desktop and tablet; the faint wordmark's top edge sits 2px under "pytest, Playwright, Docker, Claude Code, Codex" at 1440 and ~15px at 768.
- Evidence: `documents/tiles/resume-1440x1000-full-02.png`, `documents/tiles/resume-768x1024-full-02.png`, `documents-report.json` (fontSizes 12–13).
- Bounded fix: raise those tiers to 14px minimum (15px for foundation lines); add `padding-bottom` to `.resume-sheet` equal to the watermark height + 24px, or clamp the watermark inside a reserved footer band.
- Recheck: no resume text under 14px at 1440/768/390; watermark bounding box top ≥ 24px below the last text line on both sheets at all three widths.

### ED-7 (P3) Start-aligned scenes leave the bottom third of the stage empty

- Impact: at the Window and Grow together stops on 1440, 768 and 390 the reading group occupies the upper part of the safe area, then blank paper, the panel's bottom edge and empty ground for the remaining 30–45%. On 768 the Window group fills about a quarter of the safe area. The alignment is deliberate per DESIGN.md (it prevents unrelated paragraph fragments above), but the composition reads bottom-heavy empty. Partly preference; deducted once under macro composition because it is the only stop where the object feels under-framed.
- Evidence: `tour/1440x1000-04-stop-the-window.png`, `tour/768x1024-04-stop-the-window.png`, `tour/390x844-05-stop-the-window.png`, `tour/1440x1000-05-stop-grow-together.png`.
- Bounded fix: for `data-camera-align="start"` stops whose drawn height is under half the available height, use `inset = (availableHeight − drawnHeight) / 3` instead of the fixed 60/24/8 px, keeping the group above centre while shrinking the void.
- Recheck: re-capture Window and Grow together at the five core viewports; group stays in the upper half, bottom void ≤ 25% of the safe area, no fragments of neighbouring sections intrude above the heading.

## Observations that are not defects

- Text-spacing overrides at load switch the entry to reading mode with the explanation "Normal reading preserves your text settings"; reading, notes and resume then preserve all content with no horizontal overflow or clipped containers at 1440/390/320 (`documents-report.json` overflowing/clipped arrays empty). This is a legitimate protocol, not a tour defect.
- Angled intermediate frames (e.g. `1440x1000-02-t35.png`, `390x844-02-t65.png`, reverse frames) keep text sharp and hierarchy legible; transient object composition was not judged as static reading.
- Reverse wheel travel landed on the same poses as forward travel at every viewport (captions and scroll positions in `tour-report.json`).
- Metric flags of `overflow: true` on display headings and `.deal-rate` are sub-2px `scrollHeight` artifacts of tight line-height, not visible clipping; verified in the captures.

## Untested limits

- No physical iPhone/iPad or Android device; Chromium emulation only. No WebKit run in this review.
- No VoiceOver/NVDA or other assistive-technology evidence; text-spacing evidence is a CSS override, not a user stylesheet in a shipping browser.
- Touch input was not simulated; native wheel input drove the journey. Momentum flicks and settle cancellation belong to the motion specialty.
- Browser zoom (200%/400%) and Windows/ClearType rendering were not exercised.
- Notes page browser printing was not tested; only the generated PDFs were inspected.

## Candidate unchanged

Post-review check: `index.html` SHA256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5`; `agreement/index.html`, `resume/index.html`, both PDFs, logo and grain hashes all still match identity.json. `git status` shows no source changes from this review beyond this report; evidence lives under the ignored `qa-artifacts/final-design/r5/editorial/` tree.

## Evidence locations

- `qa-artifacts/final-design/r5/editorial/tour/` (114 headed captures + `tour-report.json`)
- `qa-artifacts/final-design/r5/editorial/tour-spacing/` (text-spacing entry behaviour)
- `qa-artifacts/final-design/r5/editorial/documents/` (reading/notes/resume renders, `tiles/`, `documents-report.json`)
- `qa-artifacts/final-design/r5/editorial/pdf/` (both PDFs, rasters, text extraction)
- `qa-artifacts/final-design/r5/editorial/scripts/` (Playwright and tiling scripts)
- Logs: `qa-artifacts/final-design/r5/editorial/tour.log`, `tour-spacing.log`
