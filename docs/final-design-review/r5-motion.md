# Round 5 independent review: motion direction and spatial choreography

Category: Motion direction and spatial choreography (five criteria, 0–20 each).
Reviewer: fresh independent design specialist, 27 September 2026. No earlier reports, scores, progress or remediation documents were read.

## Candidate identity

- URL: `http://127.0.0.1:4321/handrail-proposal/`
- `index.html` SHA256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5` (matches `qa-artifacts/final-design/candidate-v5/identity.json`), verified at the start and again after the last browser session.
- Served bundles matched identity: `index.astro_…DVlipvW1.js` `ec5bccc5…47720`, `client.CCxN9xF8.js` `4907db89…54811`, `handrail-logo.png` `1e024d51…766bb3a`, `paper-grain.svg` `f1ad2a83…c774b`.
- No page errors or console errors in any session.

## Scope and method

Headed Chromium (Playwright 1.63, `chromium-1243`), isolated contexts, DPR 2 desktop / DPR 3 phone. All scripts and raw outputs are in `qa-artifacts/final-design/r5/motion/` (`lib.mjs`, `desktop-static.mjs`, `desktop-dynamic.mjs`, `phone-matrix.mjs`, `phone-cancel.mjs`, evidence under `evidence/`).

| Viewport | Coverage |
| --- | --- |
| 1440×1000 | Path calibration from chapter landings; 241 settled path samples for continuity; 25-sample opening in-frame check; 27 frozen decisive poses; native wheel forward and reverse journeys with per-frame telemetry, video and mid-motion captures; fast flick; instant full jump; idle settle; settle cancellation; reverse nudge; chapter-jump interruption; long chapter jumps on video |
| 390×844 (mobile, touch) | Calibration; 21-sample opening check; 22 frozen poses; real CDP touch drags forward and reverse (11 each, finger lifted between) with telemetry and video; release settle; momentum fling; reverse after fling; settle cancellation by reverse drag |
| 320×740, 390×664, 768×1024 | Calibration; 21-sample opening check; 9 frozen poses each (spread, acquire, cover, first-crease mid, cash, double-crease mid, closing) |

Calibrated stop times (path seconds; scroll px per unit): desktop 473 px/unit, stops at 2.65 / 5.61 / 7.31 / 9.01 / 12.42 of 12.66; phone 402 px/unit, stops at 2.64 / 4.92 / 7.11 / 8.81 / 10.50 / 14.77 of 15.01. Both match the keyframe schedule in `src/scripts/motion.ts`, so the sampled path is the shipped path.

Protocol artifacts identified and excluded from findings:

- Mid-scroll `page.screenshot` captures show the fixed header displaced downward by the unconsumed compositor scroll delta (for example `desktop-wheel-fwd-t6.45.png`, `desktop-jump-fwd-2.png`). Screencast frames captured at the same moments (`video-frames/fwd-*.png`) show the header stationary. These captures are still valid for paper pose, not for chrome position.
- Every frame gap over 50 ms in the wheel journeys coincides with a screenshot capture; sessions without captures (flick, instant jump, phone reverse) had a maximum frame gap of 10.4 ms at ~120 Hz.
- The 1440×1000 screencast is letterboxed at ~0.84 scale because the headed window is shorter than the emulated viewport.
- Frozen sampling holds a synthetic `touchstart` so idle settling cannot move the sampled position; the per-frame telemetry and corner overlay add small main-thread work.

## Scores

| Criterion | Score | Reasons and deductions |
| --- | --- | --- |
| Folded reveal | 18 | Compact packet opens to the full spread with all three panels inside the viewport at every sampled step from t=0 to t=1.73 on all five viewports (`desktop-opening-frame.json`, `phone-matrix.json` opening rows). The spread pose at t=1.7 is a strong establishing frame at 1440, 768 and 390 widths. −2: the acquisition keyframe at t≈1.98 slides the spread down and to the right at unchanged scale so the right wing leaves the frame and the upper half of the stage is empty before the push-in begins (M2, frames `*-pose-07-acquire.png` at all viewports). |
| Camera and crease continuity | 19 | Monotone cubic path is velocity-continuous; sampled second differences show no discontinuity, only the steep but smooth second orbit. Every orbit pivots on a real crease with the departing and arriving faces correctly oriented (frames 11–13, 15–16, 20–24). Forward and reverse traversals agree at equal scroll positions within the damping lag (max 2.9° yaw). −1: mid double-crease on desktop both hinges change angle while the camera holds still, so the paper appears to refold itself (M5). |
| Pacing and reading transitions | 16 | Arrivals are calm: drift of ≤9 px inside each reading radius, no dead scroll, captions track travel. −2: the second single-crease orbit is paced roughly twice as fast per pixel as the first (M1). −2: the cover approach compresses an 8× push-in on phones (2.8× on desktop) into ~170–205 px of travel right after ~680 px of unfolding (M2). |
| Reversibility and input response | 18 | Native wheel and real touch drive the scene at ~120 Hz; reverse travel is the same path; idle settle starts ~700 ms after input stops and always in the last deliberate direction; wheel or touch cancels a running settle within one frame and never pulls back after a reversal; momentum flings are respected before settling; chapter-jump interruption kills the tween immediately. −1: long chapter jumps replay every orbit in ≤1.8 s at peak yaw rates above 4900°/s (M3). −1: the settle threshold turns a 168 px reverse nudge into a 1.3 s, 1300 px auto-travel back through the crease (M4). |
| Expressive restraint and spatial coherence | 18 | Motion is purposeful: hinge orbits, thin edges and folded self-occlusion carry the object; no gratuitous effects, no drifting light, no decorative motion. −1: the second orbit's whip and the chapter-jump strobe cut against the otherwise deliberate tempo (M1, M3). −1: the acquisition frame is the one composition in the journey that does not look authored (M2). |
| **Total** | **89 / 100** | |

Release note: no P0 or P1. Two P2 findings (M1, M2) require correction or an evidence-backed disposition before release.

## Findings

### M1 · P2 · Second-crease orbit is paced about twice as fast as the first

- Observation: on desktop the Cash flow → The two paths orbit turns 68° of yaw in ~170 px of scroll (peak 53°/100 px) while the cover → Cash flow orbit takes ~390 px for the same swing (peak 26°/100 px). Under the same constant wheel input (~680 px/s) the peaks were 1241°/s vs 847°/s forward and 1702°/s vs 702°/s in reverse. The double-crease orbits sit between (37°/100 px). On the phone the two single-crease orbits are close (642 vs 629°/s forward) because the mobile schedule gives the cash → Hire first segment 2.2 units; desktop gives only 1.7.
- User impact: after a deliberate first orbit, the second reads as a whip pan; rust-panel type streaks and the reader loses the sense of a hand turning a printed object.
- Evidence: `evidence/desktop-path-samples.json` (yaw −62→6 between t 6.28 and 6.64), `evidence/desktop-continuity.json` (largest yaw second differences all in t 6.22–6.70), `evidence/desktop-dynamic.json` `journey.forward.peaks`, frames `desktop-pose-15-bridge-C-R-1.png`, `desktop-pose-16-bridge-C-R-2.png`, `desktop-wheel-fwd-t6.45.png`, `video-frames/fwd-16.6.png`.
- Bounded fix: give each single-crease transition the same travel budget. In `buildTour`, the increment after stop 2 on desktop is 1.7; raising it toward the 2.95 used after the cover (or deriving a constant per-crease budget in `hingeTravel` consumers) equalises the orbits without touching reading poses. Adjust `range` only through the existing formula.
- Recheck: peak yaw per 100 px within ±25 % across all single-crease orbits from a 240-sample settled path; largest yaw second difference in the sampled path below 3° per sample; chapter landings unchanged.

### M2 · P2 (phone, small phone, short phone) / P3 (desktop, tablet) · Cover acquisition pans off-centre, then pushes in too fast

- Observation: between t=1.7 and t=1.98 the camera pans and rolls to centre the cover at the spread's scale, so the object slides to the lower right and the right wing leaves the viewport (every viewport fails the in-frame check only at t≥1.78–1.88). Then the scale jumps from the spread to the reading pose over ~0.43 units: 8.0× in 167 px at 390×844, 8.8× in 148 px at 320×740, 8.0× in 153 px at 390×664, 4.7× in 203 px at 768×1024, 2.8× in 205 px at 1440×1000. The preceding unfold used ~680 px (desktop 804 px).
- User impact: one thumb flick goes from a tiny full spread to a screen-filling cover; the intermediate frame is the only unauthored composition in the journey (small object low-right, empty upper stage). The tempo lurches exactly where the reader should be invited in.
- Evidence: `evidence/phone-pose-07-acquire.png`, `evidence/phone-pose-06-spread.png`, `evidence/phone-pose-09-cover.png`, `evidence/m320x740-pose-07-acquire.png`, `evidence/m390x664-pose-07-acquire.png`, `evidence/desktop-pose-07-acquire.png`, opening rows in `evidence/phone-matrix.json` and `evidence/desktop-opening-frame.json`, phone telemetry (t 1.54→2.79 within one 620 px drag, `phone.forward.timeline`).
- Bounded fix: start the push-in during the pan instead of clamping scale at the spread value at t=1.98 (interpolate log-scale from the spread to the cover across 1.7→2.41 and keep the cover's centre on screen during the pan), and on widths below 760 place the cover stop later (for example cursor 2.65→3.1) so the approach spans at least ~350 px. Keep the spread keyframe at 1.7 so the reveal itself is unchanged.
- Recheck: no sampled step between t=1.7 and the cover exceeds ~0.5 log-scale per 100 px on phones; all three panel rectangles stay inside the viewport until the scale exceeds the spread scale; the acquire frame keeps the cover's centre within the safe area at all five viewports.

### M3 · P3 · Long chapter jumps replay the whole path at strobe speed

- Observation: Overview → Grow together takes 1.8 s and crosses the opening plus three crease orbits; measured peak yaw 4930°/s forward and 6506°/s on the return. Consecutive 25 fps video frames skip entire orbits (t 3.17 → 6.47 in 200 ms).
- User impact: a disorienting whirl before an exact landing; individual frames are coherent but the sequence is not readable as an object turning. Chapter buttons are secondary navigation and the landings are exact, hence P3.
- Evidence: `evidence/desktop-dynamic.json` `chapterJump`, `evidence/video-frames/jump-9.3.png`, `jump-9.5.png`, `jump-9.7.png`, `jump-11.7.png`, `evidence/phone-matrix.json` `desktopJump`.
- Bounded fix: scale `scrollToPosition` duration with creases crossed (for example 0.7 s per crease, cap ~3.2 s), or route jumps longer than one chapter through the spread scale so the orbits are seen from farther away.
- Recheck: peak yaw during any chapter jump below ~1500°/s; interruption by wheel or touch still kills the tween within one frame.

### M4 · P3 · Settle threshold completes a full transition from a small reverse nudge

- Observation: from Cash flow, a 168 px reverse wheel nudge (beyond the 0.24-unit reading radius ≈ 114 px desktop, 96 px phone) triggered, after 700 ms, a 1.3 s auto-travel of ~1300 px back through the crease to the cover. The forward case and touch equivalents behave the same. Direction is always the reader's last deliberate direction and any input cancels within one frame, so the rule is honoured.
- User impact: a reader who over-scrolls slightly to see the top of a panel is carried back a chapter.
- Evidence: `evidence/desktop-dynamic.json` `reverseNudge` timeline, `evidence/phone-matrix.json` `reverseAfterFling`.
- Bounded fix (or accept with disposition): widen the no-settle band around stops (≈0.35 units) or require a minimum deliberate travel since the last stop before settling.
- Recheck: a 150 px nudge holds position; a 300 px nudge still completes to the next stop; cancellation unchanged.

### M5 · P3 · Both hinges change while the camera holds mid double-crease (desktop)

- Observation: between the second and third bridge of The window → Grow together (t ≈10.44–11.02, ~275 px) yaw holds at 6° while the left wing folds 38→62° and the right wing opens 62→38° simultaneously. On the phone the wings are off-screen, so it reads as a pan across the rust panel.
- User impact: a brief moment where the paper appears to refold itself with no camera motion; not clipped, not disorienting.
- Evidence: `evidence/desktop-pose-22-bridge-R-L-mid.png` (L=R=50), path samples t 10.44–11.02, `evidence/desktop-wheel-fwd-t10.70.png`.
- Bounded fix (or accept): stagger the two hinge changes so the right wing relaxes before the left folds, or drive wing angle from camera azimuth in `hingeTravel` bridges.
- Recheck: no path sample where both wing angles change in the same interval.

## Verified behaviours (no deduction)

- Z-fold geometry, face orientation and thin edges are correct in every orbit frame; the selected face is face-on at every landing.
- Idle settle: stops mid-orbit at t≈3.9 settled forward to Cash flow ~700 ms after input ended (desktop wheel and phone release).
- Cancellation: a reverse wheel during a running settle stopped the tween within ~20 px and the scene then settled backward; a reverse touch drag did the same on the phone; no forward pull after reversal in any case.
- Momentum: a 4000 px/s phone fling coasted from Cash flow past Hire first and only then settled forward to Client first.
- Fast input: a 3000 px wheel flick and an instant scroll to the end were absorbed by the damped ticker (~0.3–0.35 s) without a jump or dropped frame.
- Frame delivery in this environment: p50 8.3 ms, p95 ≤ 10 ms at ~120 Hz for wheel and touch journeys, excluding capture stalls.
- Reverse travel reproduces the forward path; the reading drift of ≤9 px inside each stop is subtle.

## Untested limits

- Physical iPhone or Android hardware, Safari/WebKit and Firefox motion, trackpad inertial scrolling with OS momentum (Playwright wheel deltas apply instantly), 60 Hz displays, thermal throttling, and assistive-technology interaction were not exercised. Reduced motion, keyboard paging and document reading are other specialists' scope.
- Video is a 25 fps letterboxed screencast; mid-scroll screenshots carry the compositor-offset artifact described above. Judgements of motion rest on settled path sampling, per-frame telemetry and video frames together.

## Evidence locations

- Report: `docs/final-design-review/r5-motion.md`
- Harness: `qa-artifacts/final-design/r5/motion/{lib,desktop-static,desktop-dynamic,phone-matrix,phone-cancel}.mjs`
- Data: `qa-artifacts/final-design/r5/motion/evidence/{desktop-path-samples,desktop-continuity,desktop-opening-frame,desktop-poses,desktop-dynamic,desktop-journey-samples,phone-matrix,phone-journey-samples,phone-cancel}.json`
- Frames: `qa-artifacts/final-design/r5/motion/evidence/desktop-pose-*.png`, `phone-pose-*.png`, `m320x740-*.png`, `m390x664-*.png`, `m768x1024-*.png`, `desktop-wheel-*.png`, `desktop-jump-*.png`, `video-frames/*.png`
- Video: `qa-artifacts/final-design/r5/motion/evidence/video-desktop-journey/`, `video-desktop-jump/`, `video-phone/`

Candidate unchanged at the end of review: `index.html` SHA256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5`. All review browser processes were closed.
