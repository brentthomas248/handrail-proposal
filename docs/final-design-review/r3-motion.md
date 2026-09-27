# R3 independent review: motion direction and spatial choreography

Reviewed 27 September 2026. **100/100 in this category; no actionable motion defect established in the tested scope.** This is a bounded design judgment against the review brief, not physical-device or performance certification. Release eligibility still depends on the other independent categories and the integration gate.

## Candidate and independence

- URL: `http://127.0.0.1:4321/handrail-proposal/`.
- Live main-document SHA-256: `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`, matching `qa-artifacts/final-design/candidate-v3/identity.json`.
- Browser: **headed Chromium 153.0.8010.12**, fresh isolated contexts. Phone contexts enabled mobile/touch emulation at DPR 1.
- Read the neutral brief, AGENTS.md, PROJECT.md, DESIGN.md, approved local workflow and reference links. Did not read earlier review reports, scores, remediation records or other reviewers' findings. No app edits, rebuild, commit or publication.
- Applied the Agentic UI lifecycle/QA skills using the explicitly approved local workflow. Stagehand and Browserbase remained omitted. This is the motion specialty review, not a claim of full global lifecycle certification.

## Reference basis

Opened and scrolled the live original [Telescope](https://telescope.fyi/), [Igloo](https://www.igloo.inc/), [Exat](https://exat.hottype.co/) and [Stripe Press](https://press.stripe.com/) sites in a separate headed context. Captures are `reference-*.png` in the evidence directory. The applicable ideas are continuity around an identifiable object, a clear focal subject during travel, typography as composition, and restraint around reading. The Handrail tour has its own paper, identity and business purpose; it need not duplicate those sites' spectacle to satisfy the brief. The separate reference context was closed before the complete candidate journeys.

## Coverage and method

All evidence below was produced for this review under [the motion evidence directory](../../qa-artifacts/final-design/r3/motion/). Original PNGs were individually inspected; assessment was not based on a contact sheet. Continuous browser videos preserve the input sequences. Selected opening and cover frames were also extracted from the narrow/short phone videos and inspected individually.

| Viewport | Actual input and coverage | Evidence |
| --- | --- | --- |
| 1440 × 1000 | Complete native wheel forward/reverse; gradual opening; both crease crossings; closing return across sheet; pause and automatic-settle reversal | `desktop-forward-reverse.webm`, `desktop-native-wheel.json`, `desktop-forward-*.png`, `desktop-reverse-*.png`, `desktop-exploration.webm` |
| 390 × 844 | Complete native touch forward/reverse; intermediate unfolding held for 1 second; reverse while finger remained down; release and settling | `phone390-forward-reverse.webm`, `phone390-native-touch.json`, `held-touch.json`, `phone390-held-*.png` |
| 320 × 740 | Complete native touch forward/reverse to both ends; narrow opening-to-cover sequence and subsequent reading transitions | `phone320-forward-reverse.webm`, `phone320-native-touch.json`, `phone320-opening-frame-*.png`, `phone320-cover-frame-*.png` |
| 390 × 664 | Complete native touch forward/reverse to both ends; short-height opening-to-cover sequence and reading transitions | `phone-short-forward-reverse.webm`, `phone-short-native-touch.json`, `phone-short-opening-frame-*.png`, `phone-short-cover-frame-*.png` |
| 768 × 1024 | Complete forward native-wheel travel, opening, cash-flow framing and final scene | `tablet-forward.webm`, `tablet-wheel.json`, `tablet-*.png` |

Desktop continuous travel used 36 px wheel increments at approximately 80 ms intervals, plus a 2,100 px flick and subsequent reverse input during settling. Phone gestures used Chromium's `Input.dispatchTouchEvent`: 400 px drags over 16 moves, approximately 30 ms apart, with a brief held endpoint before release. These caused native document scrolling; no direct scene seek or `scrollTo` substituted for the reviewed journeys. Tablet used faster 140 px wheel increments. Capture overhead adds time, so these are input descriptions, not frame-delivery measurements.

The 390 × 844 journey reached native scroll position 4,996.5 and returned to 0; the narrow phone reached 4,381 and returned to 0; the short phone reached 4,320 and returned to 0. Desktop reached 5,180 and returned to 0. Tablet reached 5,304.5. The held-touch sequence stayed at native scroll position **435 before and after the one-second hold**, then moved to **315 on deliberate reversal**, and settled to **0 after release**. Screenshots and transform samples agree with those changes.

## Scores

| Criterion | Score | Exact deduction and reason |
| --- | ---: | --- |
| Folded reveal | **20/20** | **0 deducted.** The initial packet establishes a compact physical object. The wings open into a three-panel composition before the reading camera arrives. This remains observable on 320 × 740 and 390 × 664, not only desktop. See `desktop-start.png`, `desktop-unfold-8.png`, `desktop-after-idle.png`, and phone opening frames 04, 06 and 08 followed by the cover frames. Small overview print is appropriately contextual; the subsequent camera pass supplies reading scale. |
| Camera/crease continuity | **20/20** | **0 deducted.** The camera follows the physical joins through both forward crossings and their reverse path. The rust center remains a useful orientation cue; no mirrored reading face, detached panel or discontinuous change of subject was established in the inspected sequence. See desktop forward frames 048/060/072/084/096, reverse 096, phone forward 4/6 and the corresponding continuous videos. |
| Pacing and reading transitions | **20/20** | **0 deducted.** The opening gives the whole object a recognizable moment, then transitions into readable compositions. Cash flow, the two phone rate scenes, the full 90-day sequence and the contribution ending have coherent resting/near-resting reading views. Intermediate clipped copy belongs to identifiable travel, rather than becoming a final reading crop. See `phone390-forward-3.png`, `phone390-forward-5.png`, `phone320-cover-frame-01.png`, `phone320-forward-8.png`, `phone390-forward-11.png` and all three phone end captures. No gratuitous repeated pullback was established between the reading regions. |
| Reversibility and input response | **20/20** | **0 deducted.** Desktop and all three phone journeys returned along the same spatial sequence to the folded packet. Reverse wheel input interrupted a forward settle and continued toward the previous reading region. Held touch preserved the intermediate pose beyond the idle-settle interval, accepted in-gesture reversal, then released ownership. See `desktop-settle-*.png`, `desktop-reverse-200ms.png`, `desktop-reverse-sustained.png`, `desktop-reverse-settled.png` and `held-touch.json`. The wheel tool returns before the next paint; the immediate screenshot/sample pair is not used to claim subframe cancellation latency. |
| Expressive restraint and spatial coherence | **20/20** | **0 deducted.** The printed sheet, hinged depth and camera account for the visual interest. The center panel identifies the economic story, peripheral paper maintains context, and the final return across the sheet leads into the contribution statement. There is no separate ornamental animation competing with the content. See `desktop-forward-132.png`, `desktop-end.png`, `tablet-end.png` and the phone ending captures. |
| **Total** | **100/100** | **0 points deducted.** |

## Findings and disposition

**No P0, P1, P2 or P3 motion finding was established.** There is consequently no defect-based correction or recheck condition to prescribe in this category. This does not certify every frame or every interaction outside the coverage above. A screenshot of clipped neighboring text during travel is not, by itself, evidence that the motion failed: the important distinctions are whether the object remains understandable, input remains effective, and the reading pose resolves the complete idea. Those conditions held in the inspected journeys.

## Explicit limits

- This review did not measure real frame delivery, GPU/layer memory, battery cost or dropped-frame distributions. Browser videos/screenshots cannot establish those results; the rendering specialty owns profiling. All review browser contexts were closed for that reviewer's isolated timing window.
- No physical iPhone, iPad, Android device or Safari/WebKit run. Chromium mobile emulation does not establish physical-device stability or address-bar behavior.
- Tablet reverse travel was not repeated; complete reverse coverage was desktop plus all three phone sizes.
- No resize/orientation/background recovery, long-duration repeated flick stress, keyboard cancellation, touchcancel, no-JavaScript, reduced-motion, reading-mode, PDF, resume or assistive-technology acceptance is claimed here. Those paths belong to the functional/inclusive and document reviews.
- The whole videos were retained, but detailed visual judgment used the original captures and selected video frames; this is not exhaustive frame-by-frame certification.
- No source-level proof of C1 derivatives was attempted. The camera judgment concerns the rendered motion observed in this pass.

The candidate remained frozen throughout capture. A changed candidate must retain its own identity and proportionate fresh rendered evidence; this report does not transfer automatically to a later build.
