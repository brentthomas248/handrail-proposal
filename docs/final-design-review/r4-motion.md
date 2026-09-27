# Round 4 independent review: motion direction and spatial choreography

Category: Motion direction and spatial choreography (five criteria, 0–20 each).
Reviewer: fresh independent specialist, 27 September 2026. No earlier reports, scores, remediation notes or IMPLEMENTATION.md were read.

## Candidate identity

- Served `http://127.0.0.1:4321/handrail-proposal/` index.html SHA-256: `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82` (matches `qa-artifacts/final-design/candidate-v4/identity.json` and the brief).
- Re-hashed after the last browser session closed: unchanged (see "Closeout").

## Scope and method

Headed Chromium 1243 via `@playwright/test` 1.63, isolated contexts, video recorded per context, native input only (`page.mouse.wheel` on desktop and tablet; CDP `Input.dispatchTouchEvent` finger drags, holds and flings on phones with `isMobile`/`hasTouch`). An in-page requestAnimationFrame recorder logged the actual inline camera transform (yaw, pitch, roll, scale, focus), both wing angles, scroll position, tour progress, caption and current chapter on every frame. Screenshots were taken at dense scroll checkpoints and decisive moments; original PNGs were inspected, not contact sheets. Driver: `qa-artifacts/final-design/r4/motion/review.mjs`. Evidence root: `qa-artifacts/final-design/r4/motion/evidence/`.

| Viewport | Input | Coverage |
| --- | --- | --- |
| 1440×1000 | wheel | slow full forward (24 px / 30 ms), slow full reverse, held midpoint + idle settle both directions, settle cancellation by reverse wheel, 1800 px flick with immediate reversal, all chapter buttons forward plus a 5→1 jump, video |
| 390×844 @3x | touch | finger-drag full forward and reverse, finger held 1.5 s at a midpoint then released, forward fling then immediate reverse fling, all seven chapter landings, video |
| 320×740 @3x | touch | finger-drag full forward and reverse, video (bounded) |
| 390×664 @3x | touch | finger-drag full forward and reverse, video (bounded) |
| 768×1024 @2x | wheel | full forward and reverse, video (bounded) |

Omissions: no keyboard-driven motion review, no address-bar height change sequence (the interaction category owns those), no physical device, no assistive technology, no field frame-rate claims. Frame-time gaps above 34 ms in the logs coincide with `page.screenshot` calls and are a measurement cost, not a rendering finding.

## Scores

| Criterion | Score | Reasons |
| --- | --- | --- |
| Folded reveal | 18 | The packet reads as a real closed object (back-face teaser, thin rust edge, shadow), both wings open through 146°→38° with the whole object inside the safe area at every viewport, the back face swings through 90° to the front cover correctly, and only then does the camera approach the cover. Deduction: on phones the approach clips the cover headline at the left edge mid-travel before the landing corrects it (M-R4-04). |
| Camera / crease continuity | 17 | Each crease crossing is a genuine orbit: the camera parks on the hinge line, pitches 12°, and swings from the departing face to the arriving face while all three panels stay visible; per-frame yaw stays within 3–6° on single-crease legs at reading speed; every chapter lands at exact poses (yaw −38/0/−38, wings 38/38, pitch 0, roll 0) on all five viewports. Deductions: the final leg crosses two creases with double the angular rate (M-R4-01) and its mid-orbit frames look at the empty lower half of the rust panel (M-R4-02). |
| Pacing and reading transitions | 16 | Same-panel travel is quiet (two paths→window and hire→client first: zero yaw, gentle vertical drift), captions and current-chapter changes are clean, and reading holds use ±0.24 time units of slow drift rather than dead scroll. Deductions: the window→Grow together leg gets the same 805 px (desktop) scroll budget as a single-crease leg yet turns 184° instead of 98°, so it is the fastest, busiest moment of the whole tour exactly where the closing paragraph should be quiet (M-R4-01); the window landing leaves roughly a third of the stage as empty ground below the paper on desktop and tablet (M-R4-03, aesthetic). |
| Reversibility and input response | 19 | Reverse wheel and reverse finger drags traverse the identical path and return to the exact packet pose; idle settle moves toward the next anchor only in the last deliberate direction (forward midpoint → Cash flow, same midpoint reached from above → The beginning); a reverse wheel 110 ms into a settle tween cancels it within one frame and the scene follows the finger/wheel; a held finger blocks settling for the full hold and release settles after 650 ms; a forward fling followed by a reverse fling settles backward; a 1629 px wheel flick reversed after 120 ms shows no overshoot and the visual catches up within about 600 ms. Negligible residual: during a large flick the caption and chapter counter flip through intermediate states faster than they can be read. |
| Expressive restraint and spatial coherence | 17 | No effects beyond the object itself: matte paper, one soft ground shadow, no parallax gimmicks, no decorative light; the printed object remains the only actor and text stays upright and readable at every hold. Deduction: the double orbit at the end reveals mostly blank paper, which reads as motion for its own sake rather than as revealing the object (M-R4-02), and the empty-ground compositions on the right panel weaken spatial grounding (M-R4-03). |
| **Total** | **87 / 100** | |

Release eligibility from this category: no confirmed P0 or P1. One P2 (M-R4-01) needs correction or an evidence-backed disposition. One capture anomaly (M-R4-05) is unconfirmed and needs a human on-screen check before release; it is not scored.

## Findings

### M-R4-01 · P2 · Two-crease closing leg runs at double angular rate

- Impact: scrolling from The window to Grow together at the same wheel or finger rate that feels calm elsewhere produces the fastest rotation of the tour (the object whips through two orbits) right before the closing paragraph. Readers using the chapter button also get a compressed 1.1 s double orbit.
- Evidence: desktop forward log (`evidence/desktop-1440x1000/frames.json`, mark `forward-slow`, corrected rerun): window→Grow together yaw travel 184° over 805 px, peak 8.6°/frame (8.9° in run 1), versus 98° over 805 px and peak 6.1°/frame (4.4° in run 1) for cash flow→two paths and 98° over 1397 px, peak 3.1°/frame for beginning→cash flow. Same ratio on every viewport: 390×844 peak 5.5° vs 3.1–3.3°; 320×740 peak 9.5° vs 4.5–4.8°; 390×664 7.8° vs 4.3–4.9°; 768×1024 4.1° vs 1.3–2.5°. Frames: `evidence/desktop-1440x1000/fwd-y04536.png`, `fwd-y04680.png`, `fwd-y04800.png`; `evidence/phone-390x844/fwd-y04537.png`, `fwd-y04699.png`.
- Cause (from the path construction): the scroll cursor advances a fixed 1.7 time units per stop regardless of how many hinge bridges the leg contains, so a four-bridge leg is compressed into the same distance as a two-bridge leg.
- Bounded correction: scale the cursor advance by the number of crease crossings for that stop (for example `1.7 + 0.85 × (crossings − 1)`), or give the two-crease leg its own constant near 2.6, and let the journey height grow accordingly.
- Recheck: rerun `review.mjs desktop phone`; peak yaw per frame and yaw per scroll pixel on window→Grow together must be at or below the single-crease legs at the same input rate; all landings remain exact; the final scene stays reachable after resize (interaction suite).

### M-R4-02 · P3 · Closing double orbit stares at blank paper

- Impact: the mid-leg frames show a large empty rust field with a sliver of foreshortened text, so the orbit that is meant to reveal the physical object reveals its least interesting area.
- Evidence: `evidence/desktop-1440x1000/fwd-y04680.png`, `evidence/tablet-768x1024/fwd-y04656.png`, `evidence/desktop-1440x1000/nav-fwd-5-mid.png`.
- Cause: bridge poses interpolate focusY linearly between the window pose (bottom of the right panel) and the Grow together pose (bottom of the left panel), so the whole orbit happens at the bottom of the sheet.
- Bounded correction: bias bridge focusY toward the vertical middle of the sheet (blend toward `paperHeight / 2` for the bridge keyframes, keeping the arrival pose unchanged) so the crease frames show printed content on both faces.
- Recheck: mid-leg screenshots at the same scroll checkpoints show readable text on both faces of each crease; landing poses unchanged.

### M-R4-03 · P3 (aesthetic) · Window landing leaves a third of the stage empty

- Impact: at 1440×1000 and 768×1024 the 90-day group is top-aligned and the paper's bottom edge sits at about 62% of the stage height, leaving a large empty ground area between the paper and the controls. Physically coherent (the paper ends there), and the design document explicitly prefers top alignment over exposing unrelated fragments above, so this is recorded as a composition preference, not a defect.
- Evidence: `evidence/desktop-1440x1000/nav-fwd-4-land.png`, `evidence/tablet-768x1024/fwd-y04656.png` (approach), `evidence/phone-390x844/nav-5-land.png`.
- Bounded correction (optional): slightly larger scale cap or smaller start inset for the window stop on wide stages.
- Recheck: visual judgment of the landing frame only.

### M-R4-04 · P3 · Cover headline clipped mid-approach on phones

- Impact: for a few hundred milliseconds between the open overview and the cover landing the headline "Let's grow Handrail." is cut at the left edge at reading size; the landing then frames it correctly. Also visible on departure from the cover on the short viewport.
- Evidence: `evidence/phone-390x844/fwd-y00883.png`, `evidence/phone-390x664/fwd-y1077.5.png`.
- Bounded correction: add an intermediate approach keyframe whose focusX sits at the cover's left content edge so the panel's margin enters the frame before the zoom completes, or ease focusX ahead of scale on the last overview→cover segment.
- Recheck: no headline glyph is cut in any frame between the last overview keyframe and the cover landing at 390×844, 390×664 and 320×740.

### M-R4-05 · Unconfirmed · Fixed header and controls displaced in mid-tween captures

- Observation: CDP screenshots and the recorded screencast both show the fixed header, caption and chapter controls displaced by 50–150 px (and the sticky stage with them) in some frames during chapter tweens and during a touch fling, then back in place at rest. Examples: `evidence/desktop-1440x1000/nav-jump-6to1-mid.png` (run 1 capture), `evidence/desktop-1440x1000/video-frames/nav1-06.png`, `evidence/phone-390x844/fling-reverse-120ms.png`.
- Status: not confirmed as on-screen behaviour. Both capture paths go through the same Chromium compositor copy request, which is known to combine a stale scroll offset with fixed layers during programmatic or compositor-driven scrolls. An attempt to capture the real display with macOS `screencapture` returned black images because this shell lacks Screen Recording permission (`evidence/screen-truth/`). No score deduction is taken without evidence, but this must not be closed on my word.
- Recheck: a person watches the header while clicking a distant chapter button and while flinging on a touch device; if it jumps, escalate to P1 (rendering engineering) and trace the scroll write path.

## Verified behaviours (no deduction)

- Packet → full unfold → cover at 1440×1000, 768×1024, 390×844, 390×664, 320×740: wings 146°→38° with all corners inside the header/control safe area; back face swings to front face through the hinge, never mirrored.
- Chapter landings on every viewport: yaw exactly −38 (left/right panels) or 0 (center), wings 38/38, pitch 0, roll 0; one transient "Between…" caption frame within 0.5 px of the landing during the tween is sub-frame and acceptable.
- Reverse traversal returns to the identical packet pose and scale (rev-end-settled frames).
- Settle: forward midpoint → next anchor after 650 ms idle; same midpoint reached from above → previous anchor; never reverses the last deliberate direction; no settle inside the ±0.24 reading radius.
- Cancellation: reverse wheel during a running settle tween takes ownership within a frame; a held finger blocks settle for the full hold; touchend releases it.
- Flick: 1629 px wheel flick reversed after 120 ms shows monotonic catch-up with no overshoot; reverse fling after forward fling settles backward.

## Limits

- Chromium desktop emulation of phones and tablet; no physical iPhone, Safari, VoiceOver or field frame delivery is claimed.
- The in-page recorder measures the transform the app wrote, not display presentation; frame gaps above 34 ms coincide with screenshot calls.
- The first desktop run's recorder mis-indexed transform fields; that log is kept as `frames-run1-mislabeled.json` (yaw is in `scale`, pitch in `yaw`, roll in `pitch`, scale is `-fx`) and the desktop pass was rerun with the corrected recorder; numbers above are from the corrected data and agree with the remapped first run.
- 320×740, 390×664 and tablet received forward/reverse coverage only; hold, fling and chapter-button coverage was taken at 390×844 and 1440×1000.
- Real-display capture was not possible (see M-R4-05).

## Evidence index

- Driver and ground-truth attempt: `qa-artifacts/final-design/r4/motion/review.mjs`, `screen-truth.mjs`.
- Per-viewport folders under `qa-artifacts/final-design/r4/motion/evidence/`: `chapters.json` (discovered chapter scroll positions), `frames.json` (per-frame camera log with marks), `fwd-y*.png` / `rev-y*.png` (checkpoint screenshots), `hold-*`, `settle-cancel-*`, `flick-*`, `held-finger-*`, `released-*`, `fling-*`, `nav-*-mid/land.png`, and the `.webm` recording; `desktop-1440x1000/video-frames/` holds extracted tween frames.

## Closeout

All browsers launched by this review were closed by the scripts (`browser.close()`); the rerun log ends with `done` and no Chromium process from this machine's Playwright cache remained afterwards (Chromium processes from another worker's separate cache were running and were left alone). Candidate identity re-hashed after the last session: `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82`, unchanged.

Corrected-run desktop checks used for the scores above: held midpoint 1953.5 → settled at 2651.5 (Cash flow); same midpoint from above 1953 → 1255 (The beginning); settle tween at 3902 cancelled by reverse wheel → 3562.5 and stayed there (inside The two paths' reading radius); chapter landings at 1255 / 2651.5 / 3456.5 / 4261.5 / 5066.5 with yaw −38 / 0 / −38 / −38 / −38, wings 38/38, pitch 0, roll 0.
