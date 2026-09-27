# Round 5 independent review: Art direction and material quality

Category: Art direction and material quality (identity and distinction; paper/edge/crease realism; light and shadow coherence; composition and visual hierarchy; finish across viewport sizes).

Reviewer stance: fresh independent specialist. No earlier reports, scores, progress, remediation, peer findings or IMPLEMENTATION.md were read. No target score was supplied.

## Candidate identity

- URL: `http://127.0.0.1:4321/handrail-proposal/` (frozen preview).
- Main HTML SHA-256 verified at start and end of review: `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5`.
- Also verified against `qa-artifacts/final-design/candidate-v5/identity.json` at the end of the review: `agreement/index.html`, `resume/index.html`, `handrail-logo.png`, `paper-grain.svg`, `handrail-proposed-agreement.pdf`, `brent-showalter-handrail-resume.pdf`. All matched. The candidate did not change during the review.

## Scope, tools and method

- Tools: installed `@playwright/test` 1.63.0 with headed Chromium (isolated contexts, no personal profile), Node, Python 3 with Pillow for luminance measurement, `pdftoppm` for PDF rasterisation. All scripts are mine and live in `qa-artifacts/final-design/r5/art/` (`capture.mjs`, `crops.mjs`). Every screenshot in this review was captured by me during this session; original PNGs were inspected individually, not via contact sheets.
- Viewports captured: 1440×1000 at DPR1 and DPR2, 390×844 at DPR3 (touch), 320×740 at DPR2 (touch), 390×664 at DPR2 (touch), 768×1024 at DPR2 (touch).
- Coverage per viewport: metadata scan of 41–81 scroll fractions (caption, wing angles, painted shade values, face visibility, cast-shadow opacity); folded packet and unfolding frames; every hinge-orbit crossing (enter / peak / exit, chosen from the scan where a wing reached 62°); every chapter pose via the chapter buttons; material crops around every visible face edge, crease and bottom edge at DPR1, DPR2 and DPR3.
- Actual native input: 72-tick mouse-wheel forward pass and 72-tick reverse pass on 1440×1000 and 390×844, sampling a frame every six ticks mid-damping (not settled endpoints), plus the settled end and home frames.
- Documents: `?view=read`, `/agreement/`, `/resume/` at 1440 and 390 (full-page and top), both PDFs rasterised at 72 dpi and inspected page by page.
- Not inspected: private documents, credentials, unrelated paths. No app edits, rebuilds, commits or publication. Browsers launched by my scripts were closed by the scripts; the Chromium processes still running on the machine at the end belong to another reviewer's `r5/motion` script and were left alone.

## Scores

| Criterion | Score | Reasons and exact deductions |
| --- | --- | --- |
| Identity and distinction | 19 / 20 | Official wordmark is unchanged and legible at every scale, including the tiny masthead on the folded packet. Cream / rust / ink is consistent from the packet through the tour, ordinary reading, notes, resume and both PDFs. The rust centre panel gives the object a distinct signature and the cream-over-rust packet is a memorable opener. −1: the notes route and notes PDF carry identity only through the rust eyebrow, logo and Inter; they read more generically than the flyer and resume sheets. Negligible, no finding raised. |
| Paper, edge and crease realism | 17 / 20 | Stacked hairline edges read as paper thickness at DPR1–DPR3 and scale correctly with the paper unit; crease highlights are credible and never smear text; grain is quiet at reading distance (measured σ ≈ 1.1 luminance levels on blank cream at DPR1/DPR2) and appears as faint speckle only at DPR2 closeups, which matches the brief. −2 (ART-2): during the first opening beat the near-edge-on wing back faces render their foreshortened headline as a column of black hatching that reads as an inked or dirty edge. −1: the crease valley itself is nearly flat; the authored 18-unit gradient is imperceptible at reading scale, so each fold reads as two flat-shaded cards meeting at a line rather than a paper valley. Observation only, no finding. |
| Light and shadow coherence | 15 / 20 | Per-face diffuse shading is coherent and changes with fold angle and camera (painted shade values move smoothly from 0.05 to 0.24 as faces turn away; no flicker or popping across 24 mid-motion wheel frames; matte throughout, no gloss, bloom or drifting light). −5 (ART-1): the projected cast shadow is effectively absent. Measured ground luminance within 25 px of the packet at the overview, and directly below every free bottom edge at the window and closing poses, differs from the far ground by at most 2 levels out of 229 (≤ 0.9%). The object therefore has no contact or weight cue; it floats as a cutout. This is a material problem against the stated purpose of cast shadows in DESIGN.md. |
| Composition and visual hierarchy | 18 / 20 | The packet is well placed at all six sizes; the fully opened spread frames all three panels with both free edges inside the frame on desktop, tablet and phone; reading poses have clear hierarchy and the rust panel carries the commercial emphasis. −1 (ART-4): on the 390×664 short phone the cover pose sits directly under the header with the paper's top edge hidden and the masthead touching the header boundary. −1 (ART-5): the notes PDF breaks before section 4, leaving the lower half of page 1 empty. |
| Finish across viewport sizes | 18 / 20 | Consistent geometry, edges and type across 1440 (DPR1/DPR2), 768, 390 (DPR3), 320 and 390×664; text stays sharp during motion; no missing paint in any headed capture. −2 (ART-3): at DPR1 the long diagonal free edges of the rust panel are visibly serrated at the overview and packet poses; the same edges are clean at DPR2 and DPR3. |

Total: 87 / 100.

Release note: ART-1 is P2 and must be corrected or given an evidence-backed disposition before release. No P0 or P1 defects were found.

## Findings

### ART-1 · P2 · Cast shadow is imperceptible, so the printed object has no weight

- User impact: at the folded packet, the wide unfolding shots and every reading pose whose free edge is on screen, the paper reads as a flat cutout resting on nothing. The material argument of the whole piece (a real printed object) is weakened at the very first frame.
- Evidence: `shots/d1440-open-f0.000.png`, `shots/p390-open-f0.000.png`, `shots/t768-open-f0.000.png`, `shots/d1440-stop4.png`, `shots/d1440-stop5.png`, `shots/p390-stop5.png`, `shots/p390-stop6.png`; crops `shots/c1440x2-stop4-right-front-bottom.png`, `shots/c1440x1-stop4-right-front-bottom.png`. Measurements in `measurements.md`: block-mean luminance map around the packet at 1440 DPR1 shows 227–229 everywhere outside the paper (ground = 229); bands 12–100 px below the free bottom edge at the window and closing poses measure 229.0 on desktop and phone.
- Why (reproduced from the rendered page, not assumed): the shadow ellipses are sized to 0.55 × the projected face width and 0.52 × height, so the ellipse rim (where the gradient is already at 0) lies only a few percent beyond the paper edge; the whole visible gradient is hidden under the paper. The layer opacity (0.09–0.12 in the tour) further reduces whatever peeks out.
- Bounded fix: enlarge the ellipse radii (about 0.65–0.75 of the projected extent) and offset them along the light direction so a soft band of 20–60 px is visible past the free edges; raise the near-rim stop opacity slightly; keep the existing softening on edge-on projections so no dark halo or streak appears. Do not add a shadow around every panel edge or a drop shadow on faces.
- Recheck: repeat the luminance map at 1440 DPR1 and 390 DPR3 for the packet (fraction 0), the open spread (about 0.10), an orbit peak and the window/closing poses. Expect a 3–8% darkening within ~40 px of the free edges that fades smoothly, with no darkening exceeding ~10% anywhere and no visible streak beside edge-on wings.

### ART-2 · P3 · Grazing-angle wing text renders as black hatching during the first opening beat

- User impact: for a fraction of a second at the start of the unfold (scroll fractions ~0.03–0.07, wings at 105–126°), the visible back faces of both wings are nearly edge-on and their large headline compresses into a column of dark stipple that reads as an inked or dirty paper edge. Visible on desktop DPR1, DPR2 and phone DPR3.
- Evidence: `shots/d1440-open-f0.050.png`, `shots/p390-open-f0.050.png`; crops `shots/c1440x2-f0.050-left-back-L.png`, `shots/c1440x2-f0.050-center-front-L.png`, `shots/c390x3-f0.050-left-front-R.png`. Face visibility at these fractions is recorded in `meta-desktop.json` (wing `.panel-face` hidden, `.panel-back` shown).
- Classification: this is optical aliasing of moving, steeply foreshortened authored text, not an artwork error. It is reported because it is visible at every DPR tested and occurs on the first frames a viewer sees.
- Bounded fix: fade face content (not the paper) toward transparent when the face's incidence to the camera drops below roughly 10–12°, or show the plain paper colour with the existing edge lines in that band. Keep the paper itself opaque so the fold silhouette is unchanged.
- Recheck: capture fractions 0.03, 0.05 and 0.07 at 1440 DPR1 and 390 DPR3 and confirm the near-edge-on wing shows cream/rust paper with a clean edge and no dark hatching; confirm no visible pop when the content returns as the wing opens.

### ART-3 · P3 · Serrated diagonal edges at DPR1

- User impact: on 1× displays the long diagonal free edges of the rust panel at the packet and overview poses show a sawtooth edge, which cheapens the printed-object finish on the first frame. Clean at DPR2 and DPR3.
- Evidence: `shots/c1440x1-f0.000-right-back-bottom.png`, `shots/c1440x1-f0.000-left-back-bottom.png` (serrated) versus `shots/c1440x2-f0.000-right-back-bottom.png`, `shots/c1440x2-f0.000-left-back-bottom.png` (clean).
- Bounded fix: give the 3D faces an edge-antialiasing hint (for example a 1 px transparent outline or border on `.panel-face` / `.panel-back`), and check whether the stacked 1–3 unit box-shadow edge lines are contributing steps at shallow rotations; keep the existing edge treatment and paper budget.
- Recheck: DPR1 crops of the packet's rust diagonal edges at fraction 0 and of the wing edges at an orbit peak show smooth antialiased edges; DPR2 output unchanged.

### ART-4 · P3 · Short-phone cover pose crowds the header

- User impact: on 390×664 the cover pose places the paper's top edge under the header and the masthead logo touches the header boundary, so the sheet loses its top margin and reads cropped at the first reading pose.
- Evidence: `shots/h664-stop1.png` (compare `shots/p390-stop1.png` and `shots/s320-stop1.png`, which keep a visible top edge and margin).
- Bounded fix: on very short viewports, allow the cover pose a slightly smaller scale or a small downward shift so the top edge and masthead sit inside the stage safe area, without breaking the complete-idea framing rule for the reading group.
- Recheck: at 390×664 the cover pose shows the paper's top edge below the header with at least a few pixels of ground, and the reading-group text lines remain inside the safe area.

### ART-5 · P3 · Notes PDF page break leaves half of page 1 empty

- User impact: the printed/downloaded notes look unbalanced: page 1 ends after section 3 with the lower half blank, and the table opens page 2.
- Evidence: `pdf/agreement-1.png`, `pdf/agreement-2.png`.
- Bounded fix: allow the section 4 heading and its short table to break naturally, or move the break after the table's caption block; keep the seven-section order and canonical text unchanged so `pnpm pdf:check` still passes.
- Recheck: page 1 fills to at least roughly 80% or the break falls at a heading with the following block starting on the same page; the PDF text check still passes.

## Observations that are not defects

- The two-flat-planes look at creases (see the realism deduction) is a restrained choice consistent with matte card; a slightly wider, still faint valley gradient would add realism but is preference.
- At the window and closing poses the lower third of the stage is empty ground with the paper's bottom edge mid-screen. This is physically honest (the panel ends there) and is a composition preference, not a defect; ART-1 is what makes it feel hollow.
- Mid-motion wheel frames (forward and reverse) show identical geometry at matching scroll positions and no face popping, so light/shadow coherence holds under real input, not only at endpoints.
- The overlay scrollbar visible in some wheel frames is browser chrome during active scrolling, a capture-protocol artifact, not product.
- Resume web sheets and PDF: faint watermark, quiet rules, coherent palette. No art-direction findings.

## Untested limits

- Chromium emulation only; no WebKit, no physical iPhone or iPad, no VoiceOver or other assistive technology, no field performance. None of that is inferred.
- Wheel input in a touch-emulated phone context stands in for finger scrolling; momentum and rubber-banding were not exercised.
- Luminance measurements are on PNG captures at the stated DPRs; colour management of a physical display was not measured.
- Hover states, print stylesheet output of the web routes, and the public GitHub Pages copy were not part of this specialty and were not captured.

## Evidence locations

- Report: `docs/final-design-review/r5-art.md` (this file).
- Evidence directory (ignored): `qa-artifacts/final-design/r5/art/`
  - `capture.mjs`, `crops.mjs`: the scripts used.
  - `shots/`: 286 original PNG captures (`d1440-*`, `d1440x2-*`, `p390-*`, `s320-*`, `h664-*`, `t768-*`, `*-wheel-*`, `c1440x1-*`, `c1440x2-*`, `c390x3-*` crops, document routes).
  - `meta-desktop.json`, `meta-phone.json`, `meta-wheel.json`, `meta-small-short-tablet-hidpi.json`, `meta-crops.json`, `meta-docs.json`: scan and pose metadata (captions, wing angles, painted shade values, face visibility, shadow opacity, face rectangles).
  - `pdf/`: downloaded PDFs with matching hashes and their rasterised pages.
  - `measurements.md`: luminance maps and grain statistics quoted above.
  - Note: the `d1440-stop*-crop-*` files from the first pass were clamped to the wrong region and are superseded by the `c1440x*` crops.
