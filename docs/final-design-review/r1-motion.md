# Round 1 — Motion direction and spatial choreography

**98/100. No P0–P2 motion finding. One P3 pacing refinement remains.** The native-scroll journey is a coherent physical-paper experience: a recognizable folded packet opens visibly into a whole spread, the camera approaches the cover, and later travel follows the real panel hinges. Long-distance chapter navigation is the one noticeably less deliberate part of the motion.

## Candidate and independence

Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`, against the frozen application `33f64ef7e648ec740cf443120663faba0d39d218`. Live JavaScript asset: `index.astro_astro_type_script_index_0_lang.Cq-k_JAy.js`, SHA-256 `81a2d742e4b58323dafaf1a12464144cc479b8a4c570488922de4f877ea168f0`. The live index SHA-256 and capture timestamp are in `qa-artifacts/final-design/r1/motion/identity.json`.

This reviewer captured its own headed Chromium evidence and did not read another reviewer's report or score. App code, shared dist and publication were not changed. The approved local workflow applies; Stagehand and Browserbase were omitted under that existing authorization. This is a scoped motion assessment, not full global lifecycle certification.

## Coverage and evidence

- **1440×1000 desktop, 390×844 phone, 390×664 short phone:** complete forward/reverse wheel journeys, every chapter, idle settle, interruption by reverse input, rapid forward/reverse input. Phone and short phone also received emulated touch drags, a held touch and release.
- **320×740 small phone, 768×1024 tablet:** opening motion and every chapter landing. These two sizes did not receive a complete continuous reverse sweep.
- All contexts used headed Chromium and isolated browser storage. Evidence uses DPR 1; these are viewport-emulation recordings, not physical-phone recordings.
- Videos, original viewport PNGs, per-frame progress/transform/scroll samples, and reproducible capture scripts are under `qa-artifacts/final-design/r1/motion/`. All five recorded runs completed without `pageerror` events.
- Original captures were inspected in addition to contact sheets. Particularly useful originals: `desktop/forward-025.png`, `desktop/forward-050.png`, `desktop/forward-100.png`, `desktop/forward-175.png`, `desktop/forward-275.png`, `short/forward-025.png`, `short/chapter-1.png` through `short/chapter-6.png`, and the extracted `desktop/uninterrupted/nav-frame-*.png` sequence.

The initial evidence run took in-motion screenshots, which can disturb capture timing. A separate **uninterrupted recording with no in-motion screenshots** therefore repeated complete forward/reverse motion and long-distance navigation at desktop and short-phone sizes. See `continuous.mjs`, each `uninterrupted/receipt.json`, and `uninterrupted-summary.json`. The uninterrupted videos are:

- Desktop: `desktop/uninterrupted/page@6a33868097933fe5c18d7a2852c89cf4.webm`.
- Short phone: `short/uninterrupted/page@a0a309f56d1a1192ab60cd3d8d68c35c.webm`.

The uninterrupted desktop and short-phone samples had no requestAnimationFrame gap over 50ms; maximum sampled gaps were 16.7ms and 17.5ms respectively during forward motion. These measurements support this local review only: they are scheduling observations, not proof of presented-frame delivery on other hardware. Video sequences and original frames establish the visible path; endpoint bounds were not used as a substitute for motion evidence.

## Scores

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Folded reveal | **20/20** | Both folded wings become visible parts of one widening object. The open spread is established before the cover approach. Whole-object framing survives desktop, phone, small, short and tablet openings. No deduction. |
| Camera/crease continuity | **20/20** | Actual panel edges remain understandable through both crease crossings and the return from the right-side window to the left-side closing. Reverse footage traces the same route. No visible teleport, face inversion or discontinuous hinge switch was found. No deduction. |
| Pacing and reading transitions | **18/20** | Native input gives purposeful approach, slower readable regions and useful transitions; complete reading groups are restored at stops. **−2 for M-01:** long-distance chapter selection rushes almost the entire authored journey through a short animation. |
| Reversibility and input response | **20/20** | Sustained input remains responsive; rapid reversal changes the travel direction; reverse input interrupts idle settle. Held emulated touch prevents an unsolicited settle until release, after which a readable pose is recovered. No deduction. |
| Expressive restraint and spatial coherence | **20/20** | Physical interest comes from one printed object, its two real folds and camera travel. The rust center is a useful spatial landmark. No extraneous decorative motion competes with reading, and the short-phone window/closing scenes retain complete ideas rather than isolated oversized sentences. No deduction. |
| **Total** | **98/100** | **2 points deducted, entirely for M-01.** |

## Finding M-01 — P3 minor: distant chapter choices play the whole route too quickly

**Observed behavior.** From Overview, selecting Grow together traverses the unfolding, cover approach, collections, rates, window and return across the sheet in roughly a second including the damping tail. The middle 80% of visual progress takes **375ms on desktop and 375.6ms on short phone**. Selecting The beginning from the closing similarly compresses the middle 80% into 375ms. Several major changes of viewing direction therefore arrive in rapid succession. The geometry stays continuous, but this feels like fast-forwarding a tour rather than an intentional navigation move.

**User impact.** A reader revisiting a nonadjacent chapter experiences a brief burst of large-scale lateral, rotational and zoom movement. It is a minor finish issue: navigation still lands correctly, input can interrupt it, and no essential content is lost.

**Evidence.** Desktop uninterrupted video, approximately **19.17–20.1 seconds** for Overview → Grow together and **20.60–21.7 seconds** for closing → cover. See `desktop/uninterrupted/navigation-sequence.png`, the original `nav-frame-04.png`, `nav-frame-06.png`, `nav-frame-08.png`, and `uninterrupted-summary.json`. The short-phone uninterrupted video independently reproduces the compressed progression. These clips contain no in-motion screenshot calls.

**Bounded correction.** Keep the existing native-scroll path and damped renderer. Give nonadjacent chapter navigation a duration based on the amount of physical travel or number of hinge crossings, with a measured upper bound; preserve the current quick adjacent navigation and immediate user cancellation. Start by evaluating about 1.2–1.5 seconds for the longest jumps. This is a tuning proposal, not a requirement to add a new animation system or slow ordinary scrolling.

**Recheck.** Record Overview → closing, closing → cover, and cash → closing at desktop and short-phone sizes, without screenshots during recording. The intervening rotations should be visually trackable at normal playback, with no abrupt whip, no dwell at each intermediate chapter, exact final poses, and immediate wheel/touch cancellation. Retest adjacent navigation to ensure it remains prompt.

## Limits and release interpretation

No uncorrected major or material motion defect was found in this scope. M-01 is a minor refinement rather than a release blocker under the supplied severity contract. This score is this reviewer's design assessment, not a certification or award.

Physical iPhone stability, Safari/WebKit rendering, device DPR 2/3 motion, manual assistive technology, background/resume behavior and browser-chrome height changes were not certified by this pass. Ordinary reading, no-JS, reduced motion, notes/PDF/resume content and unrelated controls belong to the other review specialties and were not graded here. No subjective claim about field frame rate follows from the local RAF receipt.
