# R8 independent motion review

**Category:** Motion direction and spatial choreography\
**Assessment:** 100/100 within the inspected scope. No actionable motion defect found.\
**Date:** 27 September 2026\
**Candidate:** `http://127.0.0.1:4321/handrail-proposal/`

This is an independent design judgment against the neutral brief, not a rendering-performance certification or a whole-product release decision. I read the assigned project/design/workflow/reference documents and no previous reviews, grades, remediation records, peer findings, or IMPLEMENTATION.md. I made no application edits, rebuilds, commits, or publication changes.

## Candidate identity

All 28 entries in `qa-artifacts/final-design/candidate-v8/identity.json` were fetched from the running candidate and verified before review. The main document is SHA-256 `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`; the scene JavaScript is SHA-256 `2942e9da3b974b5a3394a61e35a578b2318b7ecd34afeea6c19a232f33f4a3ee`. Both remained unchanged at the end of the rendered run. The final all-file verification is in `identity-final.json`.

## Scope and method

Created isolated **headed Chromium** contexts and my own evidence in `qa-artifacts/final-design/r8/motion/`.

- **1440 × 1000, DPR 1:** full native wheel journey forward and backward, slower opening gestures, pause/reverse interruption, rapid flick followed by immediate reversal, every chapter shortcut, and interruption of a chapter transition.
- **390 × 844, DPR 3:** full native Chromium touch-scroll gestures forward/backward, slower opening, pause/reverse interruption, rapid wheel flick/reversal, every phone chapter, and touch interruption of a chapter transition. These are emulated native browser inputs, not physical touchscreen testing.
- **320 × 740, 390 × 664, DPR 3; 768 × 1024, DPR 1:** representative folded/opening and beginning/window/closing compositions. Not a second full journey at each size.

Continuous recordings are about 37 seconds on desktop and 59 seconds on phone. I inspected original screenshots from the ordered forward/reverse sequences, reading landings, and supplemental video-extracted temporal frames: desktop `crease-01/03/05/07.png` (4.8–6.3 seconds of the recording) and phone `motion-01/03/05.png` (12–14 seconds). These show actual ongoing native scrolling rather than only programmatically selected endpoints. Original lossless captures supplement the compressed video frames for legibility and crease inspection.

`review.mjs` preserves the exact inputs. `desktop/telemetry.json` and `phone/telemetry.json` preserve timed native scroll positions and sheet/wing transforms. The telemetry is a supporting record, not a frame-rate benchmark. Browser console/page-error logs are empty for all five reviewed contexts. All review-owned browser processes were closed.

## Rubric

| Criterion | Score | Reasons and exact deductions |
| --- | ---: | --- |
| Folded reveal | **20/20** | The initial packet reads as folded paper, with a visible rust layer behind the printed back. Both wings disclose a connected three-panel object before the cover approach. Desktop `opening-6` → `opening-12` and phone equivalents preserve the entire spread; small/short/tablet opening frames confirm the same composition. Phone rotation makes the wide spread fit the narrow stage while retaining recognizable panel order. **Deduction: 0.** |
| Camera/crease continuity | **20/20** | Crease crossings retain continuous neighboring surfaces and correctly oriented print. The camera changes viewpoint around the actual folded object rather than replacing panels or cutting to another composition. The final right-to-left traversal is spatially understandable in desktop `crease-*` and phone `motion-*`; reverse captures revisit the same intermediate relationships. I observed no detached seam, teleport, mirrored reading face, or discontinuous pose in the inspected sequences. **Deduction: 0.** |
| Pacing and reading transitions | **20/20** | The reveal, approach, readable face, and onward travel have distinct purposes. Scale changes stop at complete reading groups, including both rate rationales and the 90-day sequence. The smaller movements between rate choices and within the right panel suit related ideas. The longer return to the closing restores the left panel's location without a repeated distant overview. Paused reading landings are stable; transitional crops resolve into complete ideas. **Deduction: 0.** |
| Reversibility and input response | **20/20** | Full reverse traversal restores the original folded packet. Paused forward motion yields to reverse input; a rapid forward flick followed by reverse input settles in the reversed direction. Chapter shortcuts reach their exact reading compositions and user input cancels a shortcut. Desktop pause/reverse goes from native y=694 to 385.5 and rests at 0; phone goes from 613 to 341.5 and rests at 0. After the rapid reversal, desktop rests at the beginning (y=1444), phone at its beginning (y=1580), rather than returning to the abandoned forward target. **Deduction: 0.** |
| Expressive restraint and spatial coherence | **20/20** | Motion explains a physical proposal and its reading order. There is no unrelated decorative motion, floating text, persistent light sweep, or theatrical rotation during an exact reading pose. The rust center remains a useful spatial landmark throughout crossings. Short phone and tablet compositions retain purposeful reading scale and the same object identity. **Deduction: 0.** |
| **Total** | **100/100** | **No actionable deduction established by this review.** |

## Findings and dispositions

**No P0, P1, P2, or P3 motion defect established in this scope.** No fix/recheck item is warranted from this evidence. The score applies the brief's “exemplary within the stated brief with no actionable defect” anchor; it does not mean every device or input has been verified.

The long window-to-closing crossing spends more travel revisiting the sheet than adjacent same-panel transitions. I considered this as a pacing concern. The temporal evidence shows a coherent return across two physical creases, with continuous user control and a clear final destination. Shortening it is an aesthetic alternative, not an evidence-backed defect; no deduction.

Partial text at the edge of an in-progress camera crossing is intentional peripheral/intermediate cropping. It is not the same as clipped primary copy at a reading stop. Compare `phone/forward-10.png` with `phone/chapter-cash-flow.png`, and `phone/forward-22.png` with `phone/chapter-the-window.png`. The settled groups are complete. Likewise, fine print in the fully opened overview is object-scale information; the next camera approach supplies the reading view. I did not treat overview-sized text as a failed reading pose.

Video compression softens small type. That is why the original PNGs were also inspected. No headless screenshot was used for visual acceptance. No missing-paint anomaly required escalation in these headed captures.

## Evidence map

All following paths are relative to `qa-artifacts/final-design/r8/motion/`:

- `identity-start.json`, `identity-end.json`, `identity-final.json`: candidate integrity.
- `desktop/page@92da627210f6f3b8d590fac3a78e03c1.webm`: desktop sequence; opening about 0.2–2.0s, forward journey through 8.4s, reverse through 13.7s, pause/flick interruption through 18.8s, chapters through 30.7s, shortcut interruption through 36.3s.
- `phone/page@c0b710fa11e475443cacbca330603b2b.webm`: phone sequence; opening about 0.2–3.5s, forward through 17.6s, reverse through 31.4s, pause/flick interruption through 38.1s, chapters through 51.9s, shortcut interruption through 58.4s.
- Each main viewport: `00-folded.png`, `opening-*.png`, `forward-*.png`, `reverse-*.png`, `interrupt-*.png`, `flick-*.png`, `chapter-*.png`, `shortcut-*.png`, and `telemetry.json`.
- `small/`, `short/`, `tablet/`: five representative captures each.

## Reference basis and limits

The approved Telescope overview/detail, Igloo continuous-space, and Stripe Press physical-document principles are interpreted through the supplied research and DESIGN.md. This review judges this proposal against that adopted direction; it does not claim a new comparative audit of the reference sites. [web.dev's animation guidance](https://web.dev/articles/animations-guide) distinguishes transform-oriented implementation from actual measured frame delivery. Accordingly, coherent choreography here is not asserted to prove compositor efficiency or a frame-time percentile.

Untested: physical iPhone stability and thermal/memory behavior; native Safari/WebKit visual delivery; actual trackpad hardware; device browser-chrome expansion/collapse; orientation/height-change sequences; manual VoiceOver or other assistive technology; reduced-motion/no-JavaScript and document routes in this motion specialty pass; frame-time and layer/memory certification. The integration owner runs the deterministic suites separately. This report establishes no cloud/Stagehand/Browserbase certification. Those services were omitted under the approved local workflow.
