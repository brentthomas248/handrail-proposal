# R7 independent motion direction and spatial choreography review

**Score: 99/100. One P3 finding; no P0–P2 motion finding in the reviewed scope.**

The unfolding sequence establishes a believable three-panel object, then transfers attention to complete reading compositions. The two crease crossings and the return across the sheet remain spatially understandable in reverse. Slow input, rapid input and interruption retain control. A minor phone navigation-feedback defect remains after interrupting a distant chapter shortcut.

## Candidate and independence

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.
- Main HTML SHA-256: `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4`.
- All 28 routes/assets in `qa-artifacts/final-design/candidate-v7/identity.json` matched over HTTP before and after the primary review. The HTML hash also matched after both supplemental rechecks.
- Identity receipts: [start](../../qa-artifacts/final-design/r7/motion/identity-start.json), [end](../../qa-artifacts/final-design/r7/motion/identity-end.json), [final recheck](../../qa-artifacts/final-design/r7/motion/confirm-nav/result.json).
- Read the task, AGENTS, PROJECT, DESIGN, local workflow, neutral brief, redesign research and brand-source documents. No earlier or peer review, score, remediation/progress document or IMPLEMENTATION content was used. Current motion code was inspected only to understand the public behavior and locate the confirmed finding's likely cause.
- Used the Agentic UI lifecycle/QA instructions within the explicitly authorized local review scope. No credentialed services, app edits, rebuilds, commits or publication. Only this report and assigned ignored evidence were written.

## Scope and evidence

All browser contexts were isolated, headed Chromium. The primary temporal evidence is this reviewer's original PNG sequence. Selected original frames from both directions and the rechecks were inspected individually, rather than only through a contact sheet. Two continuous WebM recordings supplement that sequence; this review does not claim a frame-performance measurement from those recordings.

| Viewport | Evidence and interaction coverage |
| --- | --- |
| 1440×1000, DPR 1 | Full native-wheel forward/reverse journey, opening, both crease crossings, all scene regions, pause/resume, immediate reversal, large opposing wheel impulses, cover/closing shortcuts, slow 20px wheel steps and interrupted distant shortcut. |
| 390×844, DPR 3 | Same full wheel journey and interruptions; five native browser touch swipes through opening/cover into the first crease, pause, reverse touch, slow wheel crease passage, a second opening-arrival sample and two independent canceled-shortcut reproductions. Touch input used Chromium's input protocol, not synthetic DOM touch events. |
| 320×740, DPR 3 | Folded opening, native opening travel, settled cover, Hire first and closing composition. |
| 390×664, DPR 3 | Folded opening, native opening travel, settled cover, Hire first and closing composition. |
| 768×1024, DPR 1 | Folded opening, native opening travel, settled cover, paired rates and closing composition. |

Primary evidence: [directory](../../qa-artifacts/final-design/r7/motion/), [capture script](../../qa-artifacts/final-design/r7/motion/review.mjs), [coverage/errors](../../qa-artifacts/final-design/r7/motion/summary.json), [desktop timeline](../../qa-artifacts/final-design/r7/motion/desktop/events.json), [phone timeline](../../qa-artifacts/final-design/r7/motion/phone/events.json), [slow-input and interruption script](../../qa-artifacts/final-design/r7/motion/recheck.mjs).

Continuous recordings: [desktop](../../qa-artifacts/final-design/r7/motion/desktop/page@628648aa698ef73d39e2adbd25c04af7.webm), [phone](../../qa-artifacts/final-design/r7/motion/phone/page@780628bac418164d70e737b0d83966b2.webm). Timelines label the actual input/capture sequence and native scroll coordinates. No console/page errors were recorded in the five primary viewport contexts or supplemental contexts.

## Five criteria

| Criterion | Score | Reasons and exact deduction |
| --- | ---: | --- |
| Folded reveal | 20/20 | The initial packet is compact and entirely present in the safe stage. Both wings become visible as distinct leaves; the complete spread is established before focus transfers into the cover. Portrait roll and scale accommodate the wide object without losing the opening's physical logic. The reverse journey reconstructs the same packet. No deduction. Evidence: desktop and phone `00-folded`, `forward-03`, `forward-06`, `forward-10`, `reverse-60` and `reverse-end`. |
| Camera/crease continuity | 20/20 | Adjacent ink and the shared hinge remain connected during the cover→cash and cash→rates crossings. The return from the window to the left-hand closing crosses the same physical sheet, without a cut, mirrored reading face or detached replacement panel. Slow 20px input samples show progressive travel rather than a frozen transition followed by a jump. No deduction. Evidence: desktop `forward-26`, `forward-38`, `forward-65`, `reverse-36`, and both `recheck/*/slow-10`, `slow-20`, `slow-30` sequences. |
| Pacing and reading transitions | 20/20 | The reveal earns the overview-to-detail zoom, and the reading regions provide a quiet hierarchy after travel. Phone rate scenes retain the heading, rate, rationale and common terms together. Short and small phone compositions complete the idea within the stage. Pauses between regions settle toward readable content; continued input remains progressive. No deduction. Evidence: `phone/shortcut-cover`, `phone/forward-38`, `phone/forward-51`, `small/rates`, `short/rates`, and the pause/touch timeline entries. |
| Reversibility and input response | 19/20 | Forward/reverse native journeys, opposing rapid inputs and touch reversal remain coherent. Desktop settling reversed from native y=2057 to y=1873 immediately after new input, then returned to the cover at y=1444. Phone settling reversed from y=2166 to y=2005.5, then returned to the cover at y=1580. Interrupted shortcuts stop correctly. **−1 for R7-MOTION-01:** the phone chapter strip can continue displaying the canceled destination while its actual current chapter is offscreen. |
| Expressive restraint and spatial coherence | 20/20 | Motion belongs to the printed object: unfolding, proximity, and hinge traversal. There are no competing text entrances, pulsing values or detached ornaments. Stable typography supplies the resting hierarchy. The center panel's color helps orient the cross-sheet return. No deduction. Intermediate crops belong to continuous transit and resolve into complete reading groups. |
| **Total** | **99/100** | **One-point deduction, fully assigned to R7-MOTION-01.** |

These scores assess the stated design brief and observed scope; they are not a universal quality, accessibility or device-stability certification.

## R7-MOTION-01 — phone chapter strip retains canceled destination

- **Severity:** P3, minor. **Confidence:** high; reproduced in two independent headed contexts at 390×844.
- **Observed behavior:** From Cash flow, reveal and activate Grow together. About 160ms later, scroll upward by 180px to cancel the jump. The paper immediately stops and remains around Cash flow. The horizontal chapter strip stays scrolled toward Grow together, leaving the current Cash flow button almost entirely outside its visible region. It does not reconcile after the input settles.
- **User impact:** Cancellation correctly controls the paper, but the chapter strip no longer shows the corresponding current chapter. The reader must horizontally search the strip to recover that cue or select the nearby chapter. The content and caption remain available, so this is not blocked reading or loss of input ownership.
- **Evidence:** [first reproduction after settling](../../qa-artifacts/final-design/r7/motion/recheck/phone/shortcut-interrupted-land.png), [independent repeat](../../qa-artifacts/final-design/r7/motion/confirm-nav/canceled-shortcut.png), [measured repeat](../../qa-artifacts/final-design/r7/motion/confirm-nav/result.json), [repeat script](../../qa-artifacts/final-design/r7/motion/confirm-nav.mjs). In the repeat, the nav spans x=18–372; the `aria-current="step"` Cash flow button spans x=−47.75–28.01. Native y=2361.5 remains near Cash flow after 2.2 seconds.
- **Likely cause:** Current motion code recenters the horizontal nav only when the chapter index changes. Revealing/clicking a distant button moves the strip, but an early cancellation can leave the current chapter index unchanged, so the recenter operation never runs. This is consistent with `src/scripts/motion.ts` around the `index !== lastIndex` navigation update; the finding is grounded in the rendered reproduction, not the code alone.
- **Bounded correction:** Reconcile the visible chapter strip with the actual current scene after a canceled shortcut once the user's vertical input settles, including when the chapter index has not changed. Preserve deliberate horizontal nav manipulation and keyboard focus visibility; do not resume the canceled camera animation.
- **Recheck:** Repeat the same cancellation twice on 390×844 and one narrower phone. Confirm the current chapter is visible after settling, scroll position does not resume toward Grow together, and keyboard focus remains visible when using the chapter buttons. No broad camera-path redesign is needed.

## Observations not classified as defects

The mobile opening temporarily shows the later closing heading near the lower edge while the camera moves into the cover. A slower repeat at native y=1160, 1280 and 1400 showed a continuous enlargement and removal of that peripheral context, not a stuck crop or a missing cover sentence. See `recheck/phone/cover-arrival-58.png`, `cover-arrival-64.png`, `cover-arrival-70.png` and `cover-arrival-land.png`. I do not deduct for that legitimate transit composition.

The cross-sheet closing return passes earlier cash/rate content. That is spatially explained by the continuous printed sheet and the stated reference direction. A preference for a shorter cut would not establish a defect. No deduction.

## Limits and closeout

- This is emulated viewport and browser-input evidence on macOS, not a physical iPhone test, hand-driven touch evaluation, Safari certification or manual assistive-technology review.
- No frame-time, field INP, GPU-memory or thermal conclusion is made. Other concurrent review processes can affect rendering delivery; this report judges choreography and observed input response.
- The small/short/tablet matrix is representative composition coverage, not a full forward/reverse behavioral matrix on every size. Native touch covered the opening and first crease, not every chapter. Wheel input covered the full forward/reverse phone journey.
- Ordinary reading, reduced motion, no-JS, notes, resume, PDFs and external portfolio destinations were not audited by this motion specialty. No claims about those surfaces are inferred.
- All eight browser instances opened by this review were closed in `finally` blocks. Both primary and supplemental scripts completed. All 28 candidate hashes remained unchanged at the end of the primary run; the final reproduction reverified the main HTML hash above.
- No P0–P2 finding requires a motion block in this scope. R7-MOTION-01 remains an actionable P3 refinement. The integration owner retains the separate overall release decision.
