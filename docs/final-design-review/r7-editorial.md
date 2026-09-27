# r7 — Editorial typography and spacing (corrected)

Independent fresh review against `docs/final-design-review/brief.md`. No earlier reports, grades, remediation notes, peer findings or IMPLEMENTATION.md were read. No target score was supplied.

**Correction notice.** The first issue of this report is preserved unchanged as `docs/final-design-review/r7-editorial-original.md`. A measurement error in that issue understated projected body sizes in the tour and biased the chapter-to-chapter comparison that drove its only P2 finding. This corrected issue keeps the original observations, states the corrected measurements alongside the original ones, and re-grades each criterion with the reason it changed or did not.

## Candidate identity

Frozen candidate served from `http://127.0.0.1:4321/handrail-proposal/`. Hashes were fetched from the live server before the first capture of the original pass, after its last capture, and before and after the correction pass. All match `qa-artifacts/final-design/candidate-v7/identity.json`.

| Route | SHA256 (unchanged across all four checks) |
| --- | --- |
| `index.html` | `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4` |
| `agreement/index.html` | `504dd71d98a188f4bf6ebde5bd10a7c79331eb6e5e7039b44183bbd0a53c0f98` |
| `resume/index.html` | `dde002faf7212e0b054c370533db05dcee32f819d1714b35882a6953ac41d609` |
| `handrail-proposed-agreement.pdf` | `0c81c8d3a68ada31b9af1fe6c733627169e9a6cc38c8e08160a36cc8f9e40f95` |
| `brent-showalter-handrail-resume.pdf` | `dbf5cae25589697e1c9904e82ffa27aa384a9a98212a1a57272dcfca845ef501` |

Receipts: `evidence/identity-before.json`, `evidence/identity-after.json`, `evidence/scale-check/summary.json` (`identityBefore` = `identityAfter`).

## What was wrong in the original measurement

The original `measureIn` estimated the camera's projected scale as (mean `Range.getClientRects()` line-box height) ÷ (computed `line-height`). In Chromium a text Range box is the glyph inline box, about 1.20 em for Inter, not the CSS line box. The estimate was therefore multiplied by (inline box ÷ line-height):

| Authored line-height | Bias factor | Effect on reported size |
| --- | --- | --- |
| 1.4 (window steps, closing paragraphs, rate qualifications, cover description) | ≈ 0.86 | understated ≈ 14 % |
| 1.35 (cash-flow paragraphs at desktop) | ≈ 0.89 | understated ≈ 11 % |
| 1.3 (deal descriptions, link) | ≈ 0.92 | understated ≈ 8 % |
| 1.25 (phone cash-flow paragraphs, rate labels) | ≈ 0.96 | understated ≈ 4 % |
| 1.16 (cover statement) | ≈ 1.04 | overstated ≈ 4 % |

Because the chapters I compared used different line-heights, the bias manufactured most of the apparent gap between the "window/closing" chapters (1.4) and the cash-flow/rate chapters (1.25–1.3).

**Independent re-measurement.** `qa-artifacts/final-design/r7/editorial/verify-scale.mjs` revisits every relevant settled pose at all five viewports in headed Chromium and derives the composed projected scale directly from each element's own box: `getBoundingClientRect().width ÷ offsetWidth` and `height ÷ offsetHeight`. At every face-on pose the two agree within 1 % (e.g. 0.8969 / 0.8918 at 390×844 window), confirming a planar pose and a single scale. Corrected effective size = CSS font-size × composed scale. Results: `evidence/scale-check/<viewport>/scale.json`, captures `the-window.png`, `grow-together.png`, `beginning-logos.png`, and `errors.json` (empty at all five viewports).

## Corrected effective body sizes (CSS px on screen)

Original (Range-box) figures in parentheses.

| Viewport | Cover description | Cash-flow paragraphs | Rate description / qualification | Window steps body / heading strong | Closing paragraphs / note |
| --- | --- | --- | --- | --- | --- |
| 1440×1000 | 23.5 (20.4) | 21.9 (19.5) | 22.4 / 19.8 (20.8 / 17.0) | 19.8 / 22.5 (17.0 / 20.8) | 22.4 / 19.8 (19.3 / 17.0) |
| 768×1024 | 22.2 (19.3) | 19.7 (17.5) | 19.0 / 16.8 (17.7 / 14.4) | 16.8 / 19.1 (14.4 / 17.7) | 22.4 / 19.8 (19.3 / 17.0) |
| 390×844 | 19.5 (16.9) | 17.1 (16.6) | 18.5 / 17.5 (17.2 / 15.2) | 17.2 / 17.2 (14.7 / 15.8) | 17.2 / 17.2 (14.7 / 14.7) |
| 390×664 | 19.5 (16.9) | 16.1 (15.5) | 18.5 / 17.5; client scene 17.6 / 16.6 (17.2 / 15.2; 16.3 / 14.5) | 17.2 / 17.2 (14.7 / 15.8) | 17.2 / 17.2 (14.7 / 14.7) |
| 320×740 | 17.3 (15.0) | 16.2 (15.6) | 18.5 / 17.5 (17.2 / 15.2) | 16.8 / 16.8 (14.4 / 15.5) | 16.2 / 16.2 (13.9 / 13.9) |

What this changes:

- **Phones.** The original claim that window and closing paragraphs are the smallest text in the tour and fall below 16 px is **withdrawn**. At 390×844 and 390×664 they are 17.2 px, equal to the rate-scene qualifications (17.5) and slightly above the cash-flow paragraphs (17.1 / 16.1). At 320×740 the closing paragraphs are 16.2 px, equal to the cash-flow paragraphs, and the window body is 16.8 px. No tour paragraph measured below 16.1 px at any phone viewport.
- **Desktop.** The window body (19.8) is about 10 % smaller than the cash-flow (21.9) and closing (22.4) paragraphs and equal to the rate qualifications (19.8). Original figure 17.0 was wrong; the ranking within the desktop tour was correct but the magnitude was not.
- **Tablet.** The window body and the rate qualifications are 16.8 px against 19.7 (cash flow) and 22.4 (closing), a 25 % spread within one viewport. This is the one place where the original "smallest in the tour" observation survives, at a legible size.
- **Cover statement.** Original 40.2 px at 1440 was overstated; corrected 38.6 px. No judgment depended on it.

Document routes, notes and PDFs were measured without any transform and are unaffected.

## Corrected wordmark comparison

The original text compared a 3× screenshot pixel width against a CSS width. Both marks re-measured with `getBoundingClientRect()` in CSS px at the settled "The beginning" pose:

| Viewport | Header wordmark | Sheet masthead wordmark | Ratio | Vertical gap between marks |
| --- | --- | --- | --- | --- |
| 1440×1000 | 142.0 | 216.7 | 1.53 | 77.5 px |
| 768×1024 | 120.0 | 204.9 | 1.71 | 111.9 px |
| 390×844 | 107.0 | 167.6 | 1.57 | 126.4 px |
| 390×664 | 107.0 | 167.6 | 1.57 | 81.3 px |
| 320×740 | 85.0 | 149.1 | 1.75 | 114.7 px |

The original "≈ 290 px on phones" was a device-pixel figure; the CSS width is 167.6 px. The observation itself, that the printed mark is larger than the site's own and appears immediately beneath it, stands at 1.5–1.75×.

## Scores (corrected)

| Criterion | Original | Corrected | Reason |
| --- | --- | --- | --- |
| Type hierarchy | 17 | **17** | Unchanged. Deductions were E7-2 (flat tier after the collections table, −2) and E7-3 (notes PDF heading rhythm, −1); neither depends on projected size. |
| Line measure and rhythm | 17 | **17** | Unchanged. The window chapter's three 224 px columns at 17–20 cpl in 3–4 ragged lines on desktop/tablet (−2) is a measure finding independent of scale, and the notes route's 87 cpl longest lines at 1440 (−1) stand. The clause "while being the smallest text on the page" is corrected to "10 % smaller than the neighbouring chapters on desktop, 15–25 % on tablet". |
| Microspacing and wrapping | 18 | **18** | Unchanged. PDF table label inset (−1) and the phone "+ 5%" hanging indent (−1) stand; text-spacing resilience and absence of stranded words re-confirmed. |
| Macro composition and whitespace | 15 | **17** | Revised. The original −4 bundled a whitespace observation with a false sub-16 px type claim. The whitespace observation stands as an aesthetic composition finding (E7-1, now P3, −2): both start-aligned chapters leave 230–300 px of empty ground under the paper on phones and roughly a third of the stage on desktop/tablet. The wordmark stacking (E7-4, −1) stands with corrected ratios. |
| Responsive / document consistency | 17 | **18** | Revised for two reasons. Phone body sizes are now shown consistent across chapters (16.1–18.5 px, window/closing within 0.1 px of cash flow), so the −2 falls to −1 for the remaining tablet spread (16.8 vs 22.4 px in one viewport) and desktop's 10 %. The Type 3 PDF font point was a coverage limit, not an observed defect; deducting for it contradicted the brief, so that −1 is removed and it is listed under limits. The notes/PDF/table treatment consistency across four widths is confirmed. |
| **Total** | **84** | **87** | Raised only where the corrected evidence or the reclassification of an untested item changed the judgment. |

No P0, P1 or P2 defect remains from this specialty. The original P2 (E7-1) is downgraded to P3 because its numerical basis on phones was a measurement artifact and its surviving numeric component (tablet/desktop window body 16.8–19.8 px) is legible and correctable rather than material.

## Findings (corrected)

### E7-1 — Start-aligned chapters leave the lower stage empty; window body is smaller than neighbouring chapters on desktop and tablet (P3, minor; composition plus a numeric note)

**Whitespace observation (aesthetic, stands).** "The window" and "Grow together" (`data-camera-align="start"`) are composed against the header safe line. On phones the paper's bottom edge sits 230–300 px above the controls at 390×844 and 135–196 px at 320×740; on desktop and tablet the lower third of the stage is bare ground (`evidence/scale-check/*/the-window.png`, `grow-together.png`; original captures `evidence/tour-*/05-the-window.png`, `06-grow-together.png`). Showing the sheet's physical edge is a defensible object choice; the deduction is for the two consecutive scenes reading as under-filled relative to every other chapter, not for any illegibility.

**Numeric note (corrected).** Desktop window body 19.8 px vs 21.9–22.4 px elsewhere; tablet window body and rate qualifications 16.8 px vs 19.7–22.4 px. On phones there is no size gap (17.2 px window/closing vs 17.1–18.5 px elsewhere at 390; 16.2–16.8 vs 16.2–18.5 at 320). Original claims of 13.9–14.7 px phone body are withdrawn.

**User impact.** On tablet the 90-day captions are the smallest reading text in that viewport while a third of the stage is unused; on desktop the same captions are 10 % smaller than the surrounding chapters. On phones the impact is compositional only.

**Bounded fix.** Allow start-aligned poses to scale until the group fills the header→controls safe area minus the existing margin (capped so no line leaves the safe area at 390×664), or set the window captions in two rows at ≤ 1024 px so the fitted camera comes closer. No change is needed for phone type size.

**Recheck.** Composed scale (rect ÷ offset) × font-size for `window-steps p` ≥ 19 px at 768 and 1440, within 10 % of the cash-flow paragraphs at the same viewport; all lines still inside the safe area at 390×664; headed captures at all five viewports.

### E7-2 — Post-table sentences form one flat tier (P3, minor) — unchanged

"Client first: $500 more commission per installment.", "Collect first. Pay commission second." and "Before all company costs. Illustration only; not Handrail pricing." are three consecutive one-sentence paragraphs at the same size with near-equal gaps in tour (1440: 21.9 / 23.4 / 21.9 px corrected), read mode, notes (18 px each) and PDF (10.5 pt each); weight 500 on the middle line is the only differentiator. Evidence: `evidence/tour-1440x1000/02-cash-flow.png`, `evidence/tour-390x844/02-cash-flow.png`, `evidence/docs-1440x1000/notes-collections.png`, `evidence/pdf/notes-1.png`. Fix and recheck as in the original: caption-tier difference and qualifier, distinct space or hairline above the rule, mirrored in notes and print; contrast of any lightened text ≥ 4.5:1; three visible tiers in headed captures at 1440 and 390 and on PDF page 1.

### E7-3 — Notes PDF heading rhythm and table label inset (P3, minor) — unchanged

Section headings print at 13 pt over 11.5 pt body with section spacing barely larger than paragraph spacing; first-column table labels carry 2 mm cell padding and sit inset from the shared body margin (`evidence/pdf/notes-1.png`). Fix: `h2` 14–15 pt or ≥ 4 mm before sections; zero first-column `padding-left` in print. Recheck: re-rasterised page 1, still two pages.

### E7-4 — First reading scene stacks two wordmarks (P3, minor, composition) — corrected figures

At "The beginning" the fixed header wordmark sits above the sheet masthead wordmark with the printed mark 1.53–1.75× the header mark's CSS width and 78–126 CSS px between them (table above; `evidence/scale-check/*/beginning-logos.png`). Impact and fix unchanged: the brand reads twice before the eyebrow with the printed mark dominant; frame the cover pose so the masthead rests just above the header line, or reduce the cover masthead logo to the 258-unit size used on the other faces. Recheck: one dominant wordmark in the reading area at 1440 and 390 with no essential text under the header.

### Observations without deduction — unchanged

- Text-spacing override during the tour hands off to a correctly reflowed reading view labelled "Reading view" with the explanation "Normal reading preserves your text settings."; nothing clips (`evidence/tour-1440x1000/90-text-spacing-probe.png`, `evidence/tour-390x844/90-text-spacing-probe.png`).
- In-travel frames keep Inter sharp at grazing angles (`evidence/tour-*/01-the-beginning-travel.png`, `02-cash-flow-travel.png`).
- No measured element of any active group sat under the header or controls at any viewport.
- Read mode at 1440: the muted note runs as one 90-character line at 17 px; acceptable, would improve at ≤ 640 px width.
- Resume web and PDF: 15 px/1.6 body with a 72ch cap, quiet rules, faint watermark in empty space; two-page letter PDF matches the route.

## Untested limits

- Physical iPhone/Android rendering, Safari/WebKit text rasterisation and real print output were not exercised; emulation is not physical certification.
- PDFs were rasterised and text-extracted with Poppler only, where they render and extract correctly. `pdffonts` shows Inter embedded as Type 3 glyph fonts (Chromium's variable-font print path). Rendering and selection in Acrobat, Preview and mobile viewers were **not tested**; this is a coverage limit, not an observed defect, and no longer carries a deduction.
- No manual screen-reader pass; 200 % browser zoom and user font-size preferences were not tested beyond the text-spacing override.
- Motion pacing was judged only from two in-travel frames per viewport.
- Composed-scale measurement relies on face-on poses (width and height ratios agreed within 1 % everywhere measured); it would not be valid for oblique in-travel frames, which were not size-measured.

## Paths

- Corrected report: `docs/final-design-review/r7-editorial.md` (this file)
- Original report, unchanged: `docs/final-design-review/r7-editorial-original.md`
- Evidence: `qa-artifacts/final-design/r7/editorial/evidence/` — original passes (`tour-*/`, `docs-*/`, `pdf/`, `identity-*.json`) plus the correction pass in `scale-check/` (`summary.json`, per-viewport `scale.json`, captures, `errors.json`); scripts `capture.mjs`, `verify-scale.mjs`
- Browsers: each script launched and closed its own headed Chromium; the correction pass closed cleanly after all five viewports.
