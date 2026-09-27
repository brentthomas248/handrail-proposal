# Round 2 candidate interaction review

Reviewed the local preview at `http://127.0.0.1:4321/handrail-proposal/` on 26 September 2026 local time (27 September UTC). This is an independent behavioral review under the approved [local workflow](local-workflow.md), using the Agentic UI lifecycle and QA skills with installed Playwright. No application, test, build, publishing or commit changes were made by this reviewer.

**Final verdict: approve candidate 5 for the bounded interaction and accessible-reading scope.** Candidate 2 was rejected for two reading-position ownership defects reproduced below. Both are corrected and independently rechecked on the rebuilt candidate. The original I-01 through I-05 findings are addressed within this review's coverage. Physical iPhone stability and manual VoiceOver remain unverified.

## Independent evidence

The reviewer read the original [interaction review](review-round-2-interaction.md), the [implementation contract](round-2-implementation.md), current `motion.ts`, `tour-path.ts`, semantic markup, paper mounting code and surrounding project instructions. Evidence lives in ignored `qa-artifacts/round-2-candidate/critic-interaction/`.

- `review.mjs` / `review.json`: 57 independent cases, including actual sequential Tab and Shift+Tab navigation and alternating Enter/Space activation at 1440×1000, 390×844, 320×740 and 390×664. No `locator.focus()` is used to establish chapter reachability. All chapter activations retain tour mode, the requested current chapter and `:focus-visible`.
- All four viewports can tab from the final chapter into the notes link and receive usable ordinary reading with the link focused.
- 24 actual wheel checks cover forward/backward movements of 15%, 40% and 60% of the adjacent chapter interval, followed by more than 1.8 seconds of inactivity. None moves back against the reader's last direction. Small movements within the reading radius may remain where placed.
- All three phone viewports retain Client first across a simple tour→read→tour round trip. Shrinking then restoring viewport height retains both Client first and native scroll position.
- 200 intermediate positions across both directions retain the same sampled print colors and group `aria-hidden`/`inert` states. Captions explicitly describe travel between named scenes. These positions use synthetic held-touch ownership to stop automatic settling while sampling; they are not evidence of physical touch performance.
- Twelve normal/reduced-motion/no-JavaScript cases show identical logical and visual section order: beginning, cash flow, two paths, window, partnership/notes. DOM section positions and ARIA snapshots confirm the ending follows the economics. No horizontal overflow occurs. Selected full-page and intermediate screenshots were visually inspected.
- Three supplementary WebKit ordinary-reading cases at the phone widths preserve that order without horizontal overflow. These are desktop WebKit measurements, not physical iPhone results.
- No page errors or crashes were observed in this independent pass.

The main pass ran 03:52:11–03:55:42 UTC. Tour contexts were opened on candidate 2; the implementation owner rebuilt candidate 3 near the end of this pass. Late fallback and WebKit contexts may therefore use candidate 3. The semantic/visual ordering was unchanged in that rebuild. Fresh candidate-4 ownership, fallback and budget evidence below supersedes those affected observations.

## Final candidate verification

`ownership.mjs candidate-4` opened fresh isolated contexts starting at 03:58:41 UTC against candidate 4. The recorded `motion.ts` SHA-256 is `27f626b8b3307d9ef722a98781c684bee066d31c47fc771b326b7c5057b4ff42`. All **21 ownership checks passed**, with zero page errors, across 390×844, 320×740 and 390×664:

- Retained notes-link focus followed by actual wheel scrolling returns to Cash flow.
- The quick-return case clicks Take the tour approximately 35 ms after the wheel input, without a screenshot or deliberate idle wait before clicking; it also returns to Cash flow.
- Two native touch gestures, each held 450 ms before moving, return to Cash flow.
- A simple mode round trip and a width/height reflow while reading preserve Client first.
- Native Home input in reading mode returns to The beginning.
- Native Tab into the notes link, without subsequent reading scroll, returns to Grow together.

The code now chooses the visible reading position for scroll-owned updates, records a newly focused paper link separately, and retains touch ownership until contact ends and momentum becomes idle. A persistent proposal reading header keeps the mode control reachable; section scroll margins keep selected headings below it. The reviewed ordinary-reading Client-first screenshot preserves the heading and complete group below the fixed header.

`candidate-4/fallback.json` and full-page screenshots repeat all **12 normal/reduced-motion/no-JavaScript cases** after the header change. The ARIA snapshots are identical across those modes at each width, section order is unchanged, first headings are below the header, and horizontal overflow remains zero. `candidate-4/budget.json` repeats the four-viewport layer pass after the final spacing change. No blocking interaction findings remain from this review.

The regression owner subsequently identified a fractional alignment boundary: at a nominal 88-pixel reading line, Cash flow can begin at 88.09375 pixels and the previous section can be selected. Candidate 5 adds a one-pixel inset to the chooser; the layout and rendering budget are unchanged. Starting at 04:01:45 UTC, `ownership.mjs candidate-5 quick-wheel-aligned,held-touch,simple-roundtrip` independently passed **nine fresh checks** across the three phone viewports, with zero page errors. The aligned Cash-flow top was 88.09375 pixels at 390-pixel width and 87.5625 at 320-pixel width; the quick return selected Cash flow in all three cases. Held-touch returns also selected Cash flow, and simple round trips still selected Client first. Final `motion.ts` SHA-256: `a1e8678e8396ecfca8b8ae739e6fd1d60c810fb08f471c0a81531c454ca2d85f`. This final focused recheck is in `candidate-5/ownership.json`. An automatic-control-scroll race is not established by these results; the reproduced quick-return cause was the fractional boundary.

## Reproduced defects

### IC-01 · P2 · Retained link focus overrides a subsequent reading scroll — closed

At 390×844, select Client first, enter ordinary reading, then press Tab. The notes link receives focus and the browser scrolls to it. Wheel upward by 2200 pixels. Cash flow now starts at approximately viewport y=0, with native scroll at 526 pixels, while the notes link remains focused. Click Take the tour: candidate 2 returns to Grow together.

The last deliberate reading input clearly selected Cash flow. `readingElement()` nevertheless checks the active element before the viewport, so a focused offscreen link owns every subsequent wheel update. This is a defect in input ownership, not failed section mounting. `focus-scroll-before-tour.png` and `focus-scroll-after-tour.png` show the mismatch.

Acceptance is met on candidate 4: actual reading scroll owns the resumed idea even when an earlier paper link retains focus; a newly focused paper link owns the idea when focus itself is the reader's action; the existing no-gesture Client-first round trip remains intact.

### IC-02 · P2 · A touch held before dragging loses reading ownership — closed

At 390×844 with touch/mobile Chromium emulation, select Client first and enter ordinary reading (native scroll 1842). Use browser-dispatched native touch input: touch at x=200/y=150, hold 450 ms, move to y=650 in ten 50-pixel steps spaced 60 ms apart, release and pause 800 ms. Repeat once. The page ends at scroll 872: Cash flow spans approximately y=−346 to 517, while Client first is below the viewport at y=970 to 1411. Take the tour still returns to Client first.

These are CDP `Input.dispatchTouchEvent` gestures that cause native browser scrolling, not `dispatchEvent` combined with `scrollTo`. `held-touch.json` and `held-touch-before-tour.png` record the result. This remains browser emulation rather than physical iPhone evidence.

`handleUserInput()` expires `readingInput` after 180 ms even while `touchActive` remains true. A finger that rests before moving, or pauses during its drag, therefore scrolls without updating the resume target. Ownership must persist through the active contact and subsequent scroll momentum, and release after the gesture has actually ended.

Acceptance is met for the delayed native-touch reproduction on all three phone viewports in candidate 4. Actual native scroll and the returned chapter now agree. Touch ownership and subsequent momentum keep updating the resume position. The earlier height-resize checks preserve place; the project regression suite separately owns its durable touch-cancellation coverage.

## Paper budget and scope

`budget.mjs candidate-4` / `candidate-4/budget.json` independently sample Chromium compositor layers during four forward/reverse wheel journeys and five mode round trips at each viewport. All six authored faces remain in the DOM; at most three faces are drawn in this pass. The earlier candidate-2 pass observed four desktop faces, still below budget. No separate face-decoration compositor layers are recorded. Five semantic sections remain after repeated mounting/restoration.

| Viewport  | DPR | Maximum paper estimate | Largest device edge | Layer samples |
| --------- | --- | ---------------------- | ------------------- | ------------- |
| 1440×1000 | 1   | 23.39 MiB              | 1703 px             | 285           |
| 390×844   | 3   | 59.26 MiB              | 2877 px             | 288           |
| 320×740   | 3   | 59.26 MiB              | 2877 px             | 288           |
| 390×664   | 3   | 59.26 MiB              | 2877 px             | 286           |

This stays below the existing 64 MiB / 4096-device-pixel project budget. It estimates drawn RGBA paper backing surfaces; it does not measure total GPU memory, WebKit raster caches, physical iPhone stability, real touch frame timing or manual VoiceOver usability. The art/commercial reviewer owns complete composition and commercial clarity. This review does not replace release checks, hosted verification or physical-device validation.
