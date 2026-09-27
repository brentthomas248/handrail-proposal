# Round 4 independent review: art direction and material quality

Reviewer: fresh independent specialist (art direction and material quality). No earlier reports, scores, progress or remediation notes were read. IMPLEMENTATION.md was not read, per the task brief.

## Candidate identity

- App: `http://127.0.0.1:4321/handrail-proposal/` (frozen preview).
- Served `index.html` SHA256 `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82` matches `qa-artifacts/final-design/candidate-v4/identity.json`.
- Served `paper-grain.svg`, `handrail-proposed-agreement.pdf` and `brent-showalter-handrail-resume.pdf` hashes also match the identity file (`f1ad2a83…`, `d9759900…`, `c832d689…`).
- Logo file matches the recorded official PNG hash (`1e024d51…`).

## Scope and method

Own evidence only, captured 27 September 2026 with headed Chromium (Playwright 1.63, `headless: false`). Script: `qa-artifacts/final-design/r4/art/capture.mjs`. Evidence: `qa-artifacts/final-design/r4/art/evidence/`.

| Surface | Coverage |
| --- | --- |
| 1440×1000 @1 | 41 static frames every 2.5 % of the journey, six chapter endpoints |
| 1440×1000 @2 | 12 targeted frames, endpoints, 20 hinge/edge/text closeup clips |
| 390×844 @3 | 41 static frames, seven endpoints, closeup clips |
| 320×740 @2, 390×664 @3, 768×1024 @2 | 12 targeted frames each plus all endpoints |
| Actual motion | Headed video of real wheel input forward to the end, pause, reverse to the start, then forward to ~45 % with immediate reversal, at 1440×1000 and 390×844. Frames extracted at 3 fps under `evidence/video-*/frames/`. |
| Documents | `?view=read`, `/agreement/`, `/resume/` at 1440 and 390 (top and full page). Both PDFs rasterised with pdftoppm at 80 dpi under `evidence/pdf/`. |

Static mid-journey frames were taken after a synthetic `touchstart` so idle settling could not move the scene while the screenshot was written. Endpoint frames used the real chapter buttons without that hold. Video frames carry WebM compression; they were used to judge coherence of motion, not material detail.

## Scores

| Criterion | Score | Reason |
| --- | --- | --- |
| Identity and distinction | 19 | Official wordmark unchanged, cream/rust/ink palette, Inter plus Playfair italic, and a genuinely distinct object: a folded packet that opens into a wide Z-fold. Only residual: the notes PDF carries almost no Handrail identity while the resume PDF does (F4). |
| Paper, edge and crease realism | 17 | Grain is at a believable scale and invisible at reading distance (closeups at @2 and @3), edges show a thin bevel, creases read as a fold at every orbit. Two correctable weaknesses: hairline rules break into dashes on 1× displays whenever the sheet is small or angled (F1), and angled type is soft at 1× (F5). |
| Light and shadow coherence | 18 | Face shade follows orientation, folded wings are darker than the open centre, cast shadow sits lower-right consistently and softens with separation. Matte throughout, no gloss or drift. One noticeable oddity: a detached shadow blob from the hidden right wing during the early unfold (F3). |
| Composition and visual hierarchy | 17 | Reading poses are clean, primary copy unambiguous, peripheral cropping stays outside the active group. Weaknesses: the establishing open spread is a small strip in portrait viewports with most of the stage empty (F2), and the desktop window/closing poses leave roughly the lower third of the stage as empty ground (F6, partly preference). |
| Finish across viewport sizes | 18 | 320, 390 short/tall, 768 and 1440 all hold the same material and hierarchy; density budget at @2/@3 does not visibly change grain. The 1× rule aliasing is the only size-dependent finish variance (F1). |
| **Total** | **89 / 100** | No P0/P1. No uncorrected P2. Release-eligible from an art-direction standpoint with the P3 corrections recommended. |

## Findings

### F1 · P3 · Hairline rules alias into dashed lines on 1× displays

- Impact: on a 1× monitor the masthead and colophon rules on every face read as perforated or dotted whenever the sheet is small (overview, opening) or turned (every hinge orbit). The same rules are solid at reading distance, so the paper looks like tear-off stationery in the first frame and then changes character. Not present at @2/@3.
- Evidence: `evidence/desktop-1440x1000--p0000.png` (cover back rule above “For discussion / September 2026”), `--p0100.png`, `--p0150.png` (all three mastheads), `--p0325.png`, `--p0625.png`, `--p0900.png`, `--stop-the-window.png` (rust colophon rule, left). Compare `evidence/desktop-1440x1000@2--p0000.png` and `@2--p0155.png`, where the same rules are continuous.
- Cause as observed: rules are one paper unit (`1px` at 1×) inside a 3D-transformed layer; at scale ≈0.3 the border is rasterised at sub-pixel coverage and drops out intermittently.
- Bounded correction: give paper rules a minimum device-pixel thickness, for example `border-width: max(1px, calc(1 * var(--paper-unit)))` combined with a slightly lower alpha, or paint rules as a 2-paper-unit gradient at reduced opacity so they stay continuous when scaled down. Keep the reading-pose weight unchanged.
- Recheck: headed capture at 1440×1000 @1 of overview, `p0100`, `p0325` and `stop-the-window`; every masthead/colophon rule must be continuous with no visible gaps at 100 % zoom.

### F2 · P3 · Establishing open spread is tiny in portrait viewports

- Impact: at 390×844 and 768×1024 the moment where the whole opened object is meant to be established occupies only about a quarter to a third of the stage height; the remainder is empty ground above and below. The spread reads as a small strip, and the text on it is unreadable at that scale, so the “establish then approach” beat carries little visual reward on phones and tablets.
- Evidence: `evidence/phone-390x844@3--p0100.png`, `--p0150.png`; `evidence/tablet-768x1024@2--p0155.png`; `evidence/small-320x740@2--p0155.png`. Desktop `evidence/desktop-1440x1000--p0150.png` is fine.
- Bounded correction: for portrait stages (height > width) allow the final opening keyframes to keep a stronger pitch (16–18°) and/or fit the spread to width minus margins rather than to both free edges with the 0.8 multiplier, so the opened object fills more of the stage before the cover approach. Preserve the “both free edges on screen” rule.
- Recheck: same frames at 390×844 and 768×1024; the opened spread should occupy at least roughly half the safe-stage height without any wing edge leaving the frame.

### F3 · P3 · Detached shadow from the hidden right wing during the early unfold

- Impact: between the folded overview and the open spread, a soft dark blob appears on the ground to the right of the object with no visible caster (the right wing is behind the centre panel at that moment). It reads as a smudge rather than a shadow and briefly undermines the light logic.
- Evidence: `evidence/desktop-1440x1000@2--p0060.png` (blob at roughly x 1350–1500, y 900–1100 of the 2880-px capture); `evidence/desktop-1440x1000--p0050.png`; `evidence/phone-390x844@3--p0050.png` (right of the packet).
- Bounded correction: weight each shadow pad by the visibility of its caster (for example scale opacity by the clamped facing term already computed in `render()`), or merge pads whose projected ellipses fall within the object’s own footprint.
- Recheck: capture `p0040`–`p0080` at 1440×1000 @2; no shadow region should exist more than one shadow radius outside the projected silhouette of visible faces.

### F4 · P3 · Notes PDF carries no Handrail identity cues

- Impact: the proposal notes PDF is black Inter on white with a single rule; it has no wordmark, no cream/rust accent and no “Prepared for” eyebrow, while the resume PDF uses the rust eyebrow and the faint watermark. Someone forwarding both files sees two different houses. Content is complete and correct; this is presentation consistency only.
- Evidence: `evidence/pdf/notes-1.png`, `evidence/pdf/notes-2.png` versus `evidence/pdf/resume-1.png`, `evidence/pdf/resume-2.png`.
- Bounded correction: reuse the resume PDF’s eyebrow treatment (rust “For discussion · September 2026”) and the faint wordmark watermark in the notes PDF, or a small wordmark in the running footer. Do not add colour blocks that would harm printing.
- Recheck: rasterise the regenerated notes PDF and confirm eyebrow/watermark presence on page 1 and that `pnpm pdf:check` still passes.

### F5 · P3 · Angled type is soft on 1× displays

- Impact: during orbits and on the far wing of the open spread, text on turned faces is visibly blurrier than text on the facing panel at 1×. No content is read at those angles, so impact is limited to perceived polish.
- Evidence: `evidence/desktop-1440x1000--p0100.png` (right wing), `--p0575.png` (right wing), `--p0900.png` (right wing). Crisp at @2: `evidence/desktop-1440x1000@2--p0450.png`.
- Bounded correction: none required; this is Chromium rasterising a 3D-transformed layer at a fixed scale. If pursued, limit to reading-pose sharpness checks only. Recorded so it is not mistaken for a regression later.
- Recheck: reading-pose text closeups at @1 remain sharp (`evidence/desktop-1440x1000--stop-*.png`).

### F6 · P3 (preference-adjacent) · Large empty lower field at the desktop window and closing poses

- Impact: at 1440×1000 the window and closing scenes align to the top of the stage and show the sheet’s bottom edge with about a third of the stage as empty ground beneath. This does reveal the physical edge, which is a plus, but the composition feels bottom-heavy in emptiness rather than deliberately framed.
- Evidence: `evidence/desktop-1440x1000--stop-the-window.png`, `--stop-grow-together.png`; tablet `evidence/tablet-768x1024@2--stop-grow-together.png`; phone `evidence/phone-390x844@3--stop-the-window.png`.
- Bounded correction (optional): for start-aligned stops on tall stages, let the camera sit slightly lower so the edge and its shadow land nearer the lower third line, or accept as authored. This is a taste call; I would not block on it.
- Recheck: visual judgement of the same frames.

## What holds up well

- Folded overview: a credible packet with a thin cover edge, a rust spine peeking from behind and a soft grounded shadow (`desktop-1440x1000@2--closeup-overview.png`, `tablet-768x1024@2--p0000.png`).
- Crease and edge at reading distance: dark hinge line with a thin light bevel and a restrained shade gradient on the rust side (`desktop-1440x1000@2--closeup-cash-flow-center-left-edge.png`, `--closeup-grow-together-left-right-edge.png`).
- Grain: fine, fixed-seed speckle visible only in closeups; no patterned tiling seen at 96-unit repeat in any capture (`desktop-1440x1000@2--closeup-the-beginning-text.png`, `phone-390x844@3--closeup-cash-flow-text.png`).
- Light: folded wings are darker than the open centre, the far wing lightens as it opens, and the rust face keeps its matte finish with no streak or bloom across the whole journey.
- Reverse travel: video frames of the reverse run reproduce the forward poses in mirror order with the same shading (`video-desktop-1440x1000/frames/f022.png`, `f027.png`; `video-phone-390x844@3/frames/f036.png`).
- Ordinary reading, notes and resume pages share the same header, palette and rhythm; the resume’s faint watermark is well judged.

## Explicit limits

- Chromium only (Playwright 1.63 headed). No WebKit or Firefox capture. No physical iPhone or iPad; device emulation is not device certification.
- No assistive-technology or performance measurement; frame delivery and memory were not measured here.
- Mid-journey static frames used a synthetic held touch to suppress idle settling; endpoint and video captures did not.
- Video evidence is compressed WebM at 3 fps extraction; it supports motion coherence judgements, not material detail.
- Contact sheets were not used; every cited file is an original capture.
- No app, dist, test or documentation files other than this report and the ignored evidence directory were written.
