# r7 — Editorial typography and spacing

Independent fresh review against `docs/final-design-review/brief.md`. No earlier reports, grades, remediation notes or IMPLEMENTATION.md were read. No target score was supplied.

## Candidate identity

Frozen candidate served from `http://127.0.0.1:4321/handrail-proposal/`. Hashes were fetched from the live server before the first capture and again after the last capture; both match `qa-artifacts/final-design/candidate-v7/identity.json`.

| Route | SHA256 (before = after) |
| --- | --- |
| `index.html` | `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4` |
| `agreement/index.html` | `504dd71d98a188f4bf6ebde5bd10a7c79331eb6e5e7039b44183bbd0a53c0f98` |
| `resume/index.html` | `dde002faf7212e0b054c370533db05dcee32f819d1714b35882a6953ac41d609` |
| `handrail-proposed-agreement.pdf` | `0c81c8d3a68ada31b9af1fe6c733627169e9a6cc38c8e08160a36cc8f9e40f95` |
| `brent-showalter-handrail-resume.pdf` | `dbf5cae25589697e1c9904e82ffa27aa384a9a98212a1a57272dcfca845ef501` |

Receipts: `qa-artifacts/final-design/r7/editorial/evidence/identity-before.json`, `identity-after.json` (checked 2026-09-27T20:05Z). Candidate unchanged during review.

## Scope and method

- Headed Chromium via `@playwright/test` 1.63 (isolated contexts, `deviceScaleFactor` 3 for phones, 1 otherwise). Script: `qa-artifacts/final-design/r7/editorial/capture.mjs`, built on the neutral `review-tools/browser.mjs` helpers.
- Tour: every chapter at all five core viewports (1440×1000, 390×844, 320×740, 390×664, 768×1024), plus one in-travel wheel frame after "The beginning" and after "Cash flow" at each viewport, and a WCAG 1.4.12 text-spacing override probe at 1440 and 390.
- For each active reading group I measured, in screen space after the camera transform: effective font size (computed size × line-rect height ÷ computed line height), line-height ratio, weight, line count, mean characters per line, bounding box, and whether any line sat under the fixed header or chapter controls. Results: `evidence/tour-<w>x<h>/metrics.json`.
- Ordinary reading (`?view=read`), `/agreement/` and `/resume/` at 1440, 390, 320 and 768: full-page captures, section crops and the same metrics. Results: `evidence/docs-<w>x<h>/`.
- Both PDFs rasterised with Poppler at 90 dpi (`evidence/pdf/*.png`), text extracted (`notes.txt`, `resume.txt`), fonts listed with `pdffonts`. All four pages inspected as images.
- Console/page errors were captured per viewport: zero at every viewport (`evidence/tour-*/errors.json`).

Protocol notes so they are not mistaken for defects: the `partlyOff` flag in the document `metrics.json` files marks elements below the fold at scroll top in a full-page measurement, not clipping. Headed captures only, so the known headless paint omission does not apply.

## Scores

| Criterion | Score /20 | Basis |
| --- | --- | --- |
| Type hierarchy | 17 | Cover, cash-flow panel and rate panels have a clear five-tier scale (Playfair italic eyebrow → 141 px display → 40 px statement → 20 px body, and 102 px rates → 24 px labels → 21 px body → 17 px notes at 1440). Deductions: the three sentences after the collections table share one visual tier so the operative rule does not separate from its caveats (E7-2, −2); notes PDF section headings sit only 1.5 pt above body with paragraph-sized gaps (E7-4, −1). |
| Line measure and rhythm | 17 | Reading measures are sound where paragraphs exist: read mode 44–59 cpl at 1440, notes 70–87 cpl at 1440 and 27–42 cpl on phones, resume 55–86 cpl (72ch cap). Line-height is consistent (1.3–1.4 print, 1.65 notes). Deductions: the "90 days" chapter sets its three captions at 17–20 cpl in 3–4 ragged lines on desktop and tablet while being the smallest text on the page (part of E7-1, −2); notes body at 1440 runs to 87 cpl on the longest lines, at the outer edge of comfortable (−1). |
| Microspacing and wrapping | 18 | Non-breaking space on "before costs", `text-wrap: balance/pretty` where it matters, tabular numerals in the table, no stranded single words in any tour scene at any viewport, and the text-spacing override hands the reader to a correctly re-flowed reading view with an explanatory label (probe captures). Deductions: PDF table first-column labels are inset 2 mm from the body margin so "Build commission" does not align with the text above and below (E7-4, −1); the phone "+ 5% of collected / recurring fees" hanging indent under the strong reads as an accidental second column (−1). |
| Macro composition and whitespace | 15 | Overview, cover, cash flow and both rate scenes are well-framed with deliberate margins. Deductions: the two start-aligned chapters ("The window", "Grow together") are composed against the top of the stage and leave 230–300 px of empty ground beneath the paper at every viewport while carrying the smallest body text of the tour (E7-1, −4); the first reading scene stacks two Handrail wordmarks (site header and sheet masthead) within ~130 px with the lower one larger than the site's own (E7-5, −1). |
| Responsive / document consistency | 17 | The same hierarchy survives all five viewports; the collections table reflows to a two-column grid on phones in tour, read, notes and PDF alike; PDF text matches the notes route and the seven-section order. Deductions: body size is not consistent between chapters on phones (16.6–17.2 px for cash/rates vs 13.9–14.7 px for window/closing) and on the tablet the rate qualifications and window captions drop to 14.4 px (E7-1, −2); the PDFs embed Inter as Type 3 glyph fonts, which extract correctly but whose rendering in non-Poppler viewers is unverified (limit, −1). |
| **Total** | **84 / 100** | |

No P0/P1 defect was found. One P2 (E7-1) requires correction or an evidence-backed disposition before release under the brief's gate.

## Findings

### E7-1 — Start-aligned chapters render the smallest reading text in the tour and waste the lower stage (P2, material)

**Observation.** "The window" and "Grow together" use `data-camera-align="start"`. The camera frames them against the header safe line and never advances to fill the available height, so the paragraphs that carry the 90-day conditions and the closing commitment are the smallest text a reader meets, at every viewport.

Effective on-screen body size of the primary paragraphs (`window-steps p`, `partnership-details p`) versus the preceding chapters:

| Viewport | Cash-flow body | Rate scene body | Window body | Closing body | Empty stage below group |
| --- | --- | --- | --- | --- | --- |
| 1440×1000 | 19.5 px | 20.8 px | 17.0 px | 19.3 px | window paper ends at y=627, controls at 924 |
| 768×1024 | 17.5 px | 17.7 px (qualifiers 14.4 px) | 14.4 px | 19.3 px | window paper ends at y=520, controls at 948 |
| 390×844 | 16.6 px | 17.2 px | 14.7 px | 14.7 px | 230 px (window), 278 px (closing) |
| 390×664 | 15.5 px | 16.3–17.2 px | 14.7 px | 14.7 px | 67 px (window), 98 px (closing) |
| 320×740 | 15.6 px | 17.2 px | 14.4 px | 13.9 px | 135 px (window), 196 px (closing) |

Evidence: `evidence/tour-390x844/05-the-window.png`, `06-grow-together.png`; `evidence/tour-320x740/05-the-window.png`, `06-grow-together.png`; `evidence/tour-768x1024/04-the-window.png`; `evidence/tour-1440x1000/04-the-window.png`; per-element rows in each `metrics.json` (`## The window`, `## Grow together`). Reproduced identically on two separate runs at 320×740 (the first run was interrupted after "Cash flow"; the rerun matches to 0.1 px).

**User impact.** On a 390 px phone the closing paragraphs and the muted note are 14.7 px at 23–30 cpl, four lines deep, below the 16 px the rest of the tour maintains; on 320 px they fall to 13.9 px. On desktop the 90-day captions are 17 px in 224 px columns (17–20 cpl, 3–4 ragged lines) while the bottom third of the stage is empty ground. The reader's effort peaks exactly where the conditional terms live.

**Distinguish from preference.** Display scale on the cover and rates is purposeful and not deducted. This is body reading ergonomics: the same class of text is 15–25 % smaller in two chapters than in the others, and the composition leaves room to correct it without cropping.

**Bounded fix.** Either (a) on `max-width: 759px`, raise `--body`/`--detail` for `.flyer-window` and `.flyer-partnership` from 40 to about 46 paper units and narrow those sections (580/600 → about 520 units) so the fitted camera lands closer; or (b) let start-aligned poses scale up until the group's height fills the header→controls safe area minus the existing margin, capped so no line leaves the safe area at 390×664. Desktop/tablet: allow the window scene to scale to ≥18 px body, or set the three captions in two rows on ≤1024 px.

**Recheck.** Effective `window-steps p` and `partnership-details p` ≥ 16 px at 390×844, 390×664 and 320×740, and within 10 % of the cash-flow body at the same viewport; ≥ 18 px at 1440 and 768; every text line of both groups still inside the measured header/controls safe area at 390×664; independent headed captures at all five viewports.

### E7-2 — Post-table sentences form one flat tier, so the rule and the caveats read as a list of three equal lines (P3, minor)

**Observation.** After the collections table, "Client first: $500 more commission per installment.", "Collect first. Pay commission second." and "Before all company costs. Illustration only; not Handrail pricing." are three consecutive one-sentence paragraphs at the same size with the same gap between them (1440 tour: 19.5 / 20.8 / 19.5 px, gaps ≈ 22 px and 13 px; notes 1440: all 18 px; PDF: 10.5 pt each). Weight 500 on the middle line is the only differentiator.

Evidence: `evidence/tour-1440x1000/02-cash-flow.png`, `evidence/tour-390x844/02-cash-flow.png`, `evidence/docs-1440x1000/notes-collections.png`, `evidence/pdf/notes-1.png`.

**User impact.** The operative rule of the whole proposal does not separate from a comparison result and a disclaimer; on phones the three become six or seven stacked lines of identical texture beneath the numbers.

**Bounded fix.** Set difference and qualifier as caption-tier (`--detail`, and on the rust panel a slightly reduced ink alpha that still meets 4.5:1), and give the rule its own space (≈1.5× the paragraph gap above it, or a hairline above). Mirror in notes CSS and the print sheet.

**Recheck.** Three visibly distinct tiers in headed captures at 1440 and 390 tour, notes at 1440 and 390, and PDF page 1; contrast of any lightened text ≥ 4.5:1.

### E7-3 — Notes PDF: heading/body compression and table label inset (P3, minor)

**Observation.** Section headings print at 13 pt over 11.5 pt body with 3 mm section spacing versus 2 mm paragraph spacing, so the space before "2. Hire first…" is barely larger than a paragraph break. In the collections table the first-column labels carry 2 mm cell padding and sit inset from the body margin that every other line shares.

Evidence: `evidence/pdf/notes-1.png` (heading rhythm across sections 1–4; "Build commission" / "Handrail keeps, before costs" inset), `src/pages/agreement.astro` print rules for context only.

**User impact.** Skimming the two-page notes by heading is harder than the web notes, and the table's left edge wobbles against the text column.

**Bounded fix.** Print `h2` at 14–15 pt or add ≥ 4 mm before each section; zero the first-column `padding-left` in print (`th[scope=row]`), keeping the interior padding for value cells.

**Recheck.** Re-rasterise page 1; headings distinguishable at thumbnail scale; row labels flush with the body margin; document still two pages.

### E7-4 — First reading scene stacks two wordmarks (P3, minor, composition)

**Observation.** At "The beginning" the fixed site header wordmark (142 px wide at 1440, 107 px on phones) sits directly above the sheet masthead wordmark (≈ 200 px at 1440, ≈ 290 px on phones at 3×), separated by ~130 px at 1440 and ~250 px at 390, with the sheet's mark larger than the site's.

Evidence: `evidence/tour-1440x1000/01-the-beginning.png`, `evidence/tour-390x844/01-the-beginning.png`, `evidence/tour-320x740/01-the-beginning.png`.

**User impact.** The brand is read twice before the Playfair eyebrow, and the larger of the two is the printed one, inverting the chrome/content size relationship for the opening beat. Low cost, first impression.

**Bounded fix.** Frame the cover pose so the masthead rests just above the header safe line (as the cash-flow pose already does with its masthead), or reduce the cover masthead logo to the 258-unit size used on the other faces.

**Recheck.** Headed capture of "The beginning" at 1440 and 390 shows one dominant wordmark in the reading area; no essential text under the header.

### Observations without deduction

- **Text-spacing resilience passes.** Injecting the WCAG 1.4.12 values during the tour switched the page to the reading view with the control relabelled "Reading view" and the explanation "Normal reading preserves your text settings."; nothing clipped or overlapped (`evidence/tour-1440x1000/90-text-spacing-probe.png`, `evidence/tour-390x844/90-text-spacing-probe.png`, `metrics.json → textSpacingProbe`).
- **Type stays sharp in travel.** Oblique frames between chapters show crisp Inter at grazing angles with no blur or shimmer (`evidence/tour-*/01-the-beginning-travel.png`, `02-cash-flow-travel.png`).
- **No line under chrome.** No measured element of any active group sat under the header or controls at any viewport (`underHeader`/`underControls` false throughout).
- **Read mode 1440.** `proposal-note` runs as one 90-character line at 17 px; acceptable for a muted note, would improve at ≤ 640 px width.
- **Phone rate scenes.** 17.2 px body, 15.2–15.8 px qualifications, and "Both paths…" at 15.8 px are on the low edge but consistent with each other; the muted "Two ways to begin" context line is a good device.
- **Resume web and PDF.** 15 px/1.6 body with a 72ch cap, quiet rules, faint watermark in empty space, and a letter-size two-page PDF whose text and order match the route. Page 2 proof links print at 8.2 pt underlined, small but legible.

## Untested limits

- Physical iPhone/Android rendering, Safari/WebKit text rasterisation and real print output were not exercised; device emulation is not physical certification.
- PDFs were rasterised and extracted with Poppler only. `pdffonts` shows Inter embedded as Type 3 glyph fonts (Chromium's variable-font print path); rendering and selection quality in Acrobat, Preview and mobile viewers is unverified.
- No manual screen-reader pass; the transcript/reading-mode accessibility tree was not part of this specialty.
- Browser zoom at 200 % and user font-size preferences were not tested beyond the text-spacing override.
- Motion pacing was judged only from two in-travel frames per viewport; frame-rate and reversal belong to the motion and rendering reviews.

## Paths

- Report: `docs/final-design-review/r7-editorial.md`
- Evidence: `qa-artifacts/final-design/r7/editorial/evidence/` (114 PNG captures, per-viewport `metrics.json`, `errors.json`, `identity-before.json`, `identity-after.json`, `pdf/`), script `qa-artifacts/final-design/r7/editorial/capture.mjs`
- Browsers: each capture run launched and closed its own headed Chromium; a stale-process sweep was attempted at the end (process listing is unavailable in this sandbox, so a stale window from the interrupted earlier run cannot be positively excluded).
