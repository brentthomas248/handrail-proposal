# Second review: interaction, motion and accessible reading

Reviewed the published `?v=16d332d` proposal on 26 September 2026 (local time). This is an independent review of the existing renderer, not implementation approval. No application, test, build or publishing changes were made by this reviewer.

**Verdict:** the chapter endpoints are substantially stronger than the routes between them. Three interaction/access failures and a repeated ink-state discontinuity remain outside the present endpoint checks. The problem is not a need for another animation engine. Input ownership, chapter semantics, editorial grouping and fallback document order need explicit contracts.

## Evidence and boundaries

- Live URL: <https://brentthomas248.github.io/handrail-proposal/?v=16d332d>.
- Reviewed `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, `IMPLEMENTATION.md`, `docs/local-workflow.md`, `src/scripts/motion.ts`, `tour-path.ts`, page markup, CSS and browser tests.
- Used the Agentic UI lifecycle/QA skills under the repository's approved local Playwright exception. No Stagehand/Browserbase receipt or full global certification is claimed.
- Chromium captures at 1440×1000, 390×844, 320×740 and 390×664. Phone captures use DPR 3. The endpoint/intermediate capture uses phone viewport + touch capability; the adversarial and wheel passes also use Chromium mobile emulation. None is a physical iPhone result.
- `qa-artifacts/review-round-2/interaction/capture.mjs` saved **100 screenshots**, covering every chapter and 63 intermediate path positions plus ordinary-reading pages. Intermediate captures hold synthetic touch ownership to prevent the 650 ms settling timer from replacing the sampled pose. They demonstrate reachable poses, not physical touch performance.
- `adversarial.mjs` separately uses ordinary keyboard and wheel input, captures ink boundaries, and checks normal, reduced-motion and no-JavaScript reading. Results, ARIA snapshots and the exact reversal trace are in `adversarial.json`.
- `wheel-traversal.mjs` records actual forward/reverse wheel journeys at all four sizes, with 32 additional screenshots and 2,064 animation-frame samples. All four returned to scroll 0 / “Scroll to unfold,” with no page errors, page crashes or observed long tasks. The maximum phone paper estimate was 52.65 MiB across three drawn faces, with a 2556-device-pixel edge (within the existing 64 MiB / 4096 budgets). Desktop measured 23.39 MiB. These supplementary measurements are not a real-device memory or responsiveness certificate.
- Raw evidence is ignored under `qa-artifacts/review-round-2/interaction/`; the review is the durable tracked artifact. Screenshots were visually inspected; this verdict is not inferred from a green suite.

## Ranked reproduced findings

### I-01 · P2 · The chapter controls cannot be reached by normal forward Tab navigation

**Reproduction:** fresh load, press Tab five times. Reproduced at 1440×1000 and 390×844. Focus progresses through Skip to content → home → Proposal notes → Read normally. The fifth Tab silently changes presentation to ordinary reading and focuses “Read the proposal notes” inside the document. The chapter navigation disappears before the user can reach it. Continuing Tab never enters the tour controls.

This does preserve an accessible reading escape, but removes keyboard access to the visible tour navigation. Programmatically focusing a chapter and pressing Enter is not evidence that a keyboard user can get there.

**Evidence:** `adversarial.json` → `keyboard-1440` and `keyboard-390`; `1440-tab-5.png`, `390-tab-5.png`.

**Cause:** `src/scripts/motion.ts:821-829` switches modes when Tab leaves the mode button. Chapter navigation is later in DOM order than the paper (`src/pages/index.astro:342-363`). Its ordinary-reading style is hidden. The sheet's link fallback and the tour control tab order are therefore coupled.

**Missed by:** `tests/e2e/proposal.spec.ts:824-847` calls `chapter.focus()` directly; `1541-1581` and `1596-1610` intentionally assert the forced reading transition. Neither asserts real sequential reachability of the chapter buttons.

**Smallest durable correction:** establish a native, meaningful tab order for the persistent header and tour controls before the transformed paper links. Keep the offscreen-link reading restoration at the point a paper link is actually entered; do not switch mode merely because focus leaves the header button. Avoid positive `tabindex`.

**Acceptance:** from a fresh page, Tab and Shift+Tab can reach and leave every chapter control without pointer input or `locator.focus()`. Enter/Space lands on a chapter while retaining tour mode and visible focus. Tabbing into a paper link still switches to a usable reading context. Repeat on desktop and a phone viewport.

### I-02 · P2 · A meaningful backward scroll is undone after the pause timer

**Reproduction:** at 390×844, select Client first and wait for the pose to settle. Native scroll is **4147 px**. Send one wheel event with **deltaY = −280** and no further input. Native scroll becomes **3867 px**. About **671 ms after this move**, the app begins increasing scroll again and returns to **4147 px**. The user's last direction was backward; automatic motion takes them forward to the point they tried to leave.

The 280 px input covers about 42% of the roughly 668 px interval to Hire me first. This is a deliberate partial reverse, not a negligible tremor. The existing behavior requires crossing the midpoint within one uninterrupted gesture to avoid losing progress. Repeating this common short-scroll/pause pattern can feel stuck even though the damped camera itself continues smoothly.

**Evidence:** `adversarial.json` → `reversePause`. First negative native-scroll change at trace t=52.9 ms; first automatic positive change at t=723.6 ms; final return by t=1656.1 ms. `390-reverse-before-settle.png` and `390-reverse-after-settle.png` show the visible outcome.

**Cause:** `motion.ts:497-514` chooses the nearest anchor by absolute distance, without retaining the last user direction or distinguishing directional travel from navigation. `517-523` schedules it after every eligible scroll. The damping function's reversal handling in `tour-path.ts:133-153` does not govern this later native-scroll tween.

**Design conflict:** `DESIGN.md:107` allows inactivity settling but explicitly says it must not pull the reader back after a reversal. This finding targets that conflict, not the mere existence of settling.

**Missed by:** the fast-reversal test (`proposal.spec.ts:876-913`) stops at 700 ms and examines camera progress during the first 300 ms; it does not observe the full pause/settle cycle. The pause test (`915-945`) chooses a location already closer to the destination it expects. The canceled-touch test (`1002-1046`) actually requires returning to the original chapter after a smaller gesture.

**Smallest durable correction:** give settling an explicit input policy. Retain last deliberate input direction and distinguish user movement from an app-owned scroll tween. After reversing away from a reading anchor, either keep the chosen position or settle toward the previous anchor; never select an anchor opposite to the last deliberate direction. Do not merely increase the timeout.

**Acceptance:** forward and backward partial movements of 15%, 40% and 60% of a chapter interval, followed by a 1.8 s pause, never undo the last deliberate direction. Inspect native scroll and visual progress across the complete interval, not only damping's first 300 ms. Fresh wheel/touch/keyboard input must still cancel an active automatic move immediately. Define tiny-jitter tolerance separately.

### I-03 · P2 · All ordinary-reading paths put the ending before the economic proposal

**Reproduction:** open `?view=read`, use reduced motion, or disable JavaScript. All three render and expose the same order: beginning → partnership ending and notes CTA → cash flow → rates → 90-day expiration. The tour order is beginning → cash → rates → window → partnership ending. The normal document therefore asks the reader to leave for notes before explaining the cash and rates, then ends on the hiring commitment lapsing.

At 390 px, section starts were beginning y=216, Grow together y=614, cash y=1388, rates y=2663 and window y=3921. The ARIA snapshot independently confirms the same order; this is not only CSS placement. Normal/reduced-motion axe scans returned zero violations, illustrating why structural accessibility checks do not evaluate the narrative.

**Evidence:** `390-normal-full.png`, `390-reduced-full.png`, `390-nojs-full.png`; `adversarial.json` entries `normal`, `reduced`, `nojs`, including their `aria` strings and section positions. No horizontal overflow occurred in those 390 px captures.

**Cause:** physical print-panel membership owns the HTML order: left panel contains cover, partnership and followup (`index.astro:45-98`), then the center cash panel (`140-229`), then the right rates/window panel (`251-319`). `motion.ts:collectStops` sorts a separate camera list by `data-camera-order`, so the animated view alone repairs the story sequence.

**Missed by:** fallback tests (`proposal.spec.ts:1369-1418`, `1496-1530`) assert presence, transform removal and overflow; axe scans (`1532-1539`) assert automated rules. None compares visual and accessible section order with the tour narrative.

**Durable correction boundary:** make semantic narrative order authoritative and physical panel membership presentation metadata. Do not fix only CSS order while keeping the accessibility tree wrong. A bounded approach can emit the canonical logical sections in normal order and have tour mounting place the same section nodes into named existing panel slots; teardown restores those nodes to the semantic document. Alternatively, generate both presentations from the same content components with exactly one accessible presentation at a time. Whichever approach is chosen, no-JavaScript markup must already have the correct order, no duplicated accessible content or duplicate IDs, and the six-face renderer/budget must remain unchanged. This is a small structural project, not a heading-style patch.

**Acceptance:** normal, reduced-motion and no-JavaScript visual order and ARIA heading/section order are beginning → cash → paths → window → partnership/followup. The CTA follows the full proposal in each path. Tour → read → tour restoration preserves complete text, live links, focus and the current conceptual section. All essential text remains semantic HTML.

### I-04 · P2 · Peripheral ink and accessible content change abruptly around invisible thresholds

**Reproduction:** at 390×844 hold a partial scroll near the end of Hire me first. At path time 9.38 (scroll 3687), Client first and surrounding headings/window text are pale. Move only **16 native pixels** to time 9.42 (scroll 3703): surrounding text becomes full black/rust immediately although camera composition scarcely changes. Another 16 px around time 10.24→10.28 dims the opposite column. Time 11.09→11.12 similarly restores full ink. Reversing over these boundaries toggles the same jump.

**Evidence:** `390-ink-9.38.png` / `390-ink-9.42.png`; corresponding 10.24/10.28 and 11.09/11.12 images; `adversarial.json.inkBoundaries`. Computed Client first color changes from approximately rgb(183,182,180) to rgb(26,24,22). Its `aria-hidden` state changes at the same boundary. The artifact records the state, without claiming a manual screen-reader test.

**Cause:** `motion.ts:393-418` uses a binary focus window, removes it entirely between chapters, and couples visual ink to `inert`/`aria-hidden`. CSS `global.css:1936-1970` changes every secondary descendant color immediately. Camera C1 continuity cannot smooth these independent discontinuities.

**Missed by:** the endpoint reading-group test (`1056-1151`) explicitly expects inactive groups hidden only at landings. Motion tests sample camera transforms/progress, not ink or accessible-tree stability. The root heading finding is another consequence of this ownership model, but removing `.rates-heading` from one selector alone does not address the repeated threshold jump.

**Smallest durable correction:** derive a stable editorial focus state from the scene contract. Preserve readable ink for active context and avoid the current “one group → every group → next group” cycle. Prefer authored composition/stable print wherever possible; if an ink handoff remains necessary, make it continuous and bounded without adding per-paragraph composited layers. Keep accessibility exposure a separate deliberate state rather than mirroring every decorative paint boundary.

**Acceptance:** slow forward/backward passes and ±20 px oscillation around each focus boundary produce no large discrete ink jump, no transient re-exposure of all unrelated groups, and no loss of related heading/copy. Sample colors and accessible state as well as transforms. Reconfirm the paper raster budget after any paint change.

### I-05 · P3 · The chapter label often describes the previous idea after the next one is dominant

**Reproduction:** desktop intermediate path time 6.85 shows the rates panel prominently, but caption/current chapter remain Cash flow. On the phone, time 8.50 shows Hire first in the center while the caption remains As money arrives. At time 10.24 Client first is central, but the caption remains Hire me first. The reverse screenshot similarly shows a centered Client first card under a Hire me first caption.

**Evidence:** `1440x1000-held-time-6.85.png`, `390x844-held-time-8.50.png`, `390-ink-10.24.png`, `390-reverse-before-settle.png`; `capture.json` records both group rectangles and the selected label.

**Cause:** `motion.ts:393-395` advances the index only at `stop.at − 0.28`, and `420-449` uses that index for both navigation and caption. It is a last-arrived-step rule, not a measure of the currently dominant idea. On reverse travel, the same forward threshold can name the preceding idea unusually early.

**Missed by:** navigation tests assert the selected label after clicking a chapter and waiting for the destination. They do not pair intermediate screenshots with visible editorial content.

**Smallest durable correction:** separate “arrived at chapter” from “traveling between chapters.” Use an honest transition caption or a consistent dominant-scene ownership interval, with the same logic in both directions. Do not announce every animation frame to assistive technology.

**Acceptance:** content-distinct intermediate frames throughout both directions have either the visible idea's label or an explicit transition label. The current-step state still lands exactly at each chapter, without flicker on tiny reversals.

## Design judgments, not additional demonstrated functional defects

- The later rates/window/ending camera path still leaves reading distance for repeated distant orbits (`motion.ts:679-687`). In `390x844-held-time-7.80.png` and `390x664-held-time-12.90.png`, most of the stage is empty while several small competing sections are visible. The first opening-to-cash slice establishes closer hinge travel; the later repeated zoom-out changes that visual grammar. This is consistent with the implementation document's admission that those later scenes retain prior choreography. Extend the directed storyboard before declaring the whole journey finished.
- The final phone scene isolates a short paragraph and notes link in a large empty crop, with huge truncated neighboring print (`390x844-chapter-8.png`). Its target text fits. That is not sufficient evidence of a good ending. Compose the partnership story and next step as a deliberate conclusion instead of treating the small followup box as an independent camera destination solely because it fits.
- Cropped peripheral panels during motion are not automatically defects. I did not require every in-flight pose to be a full reading stop. The rate-heading problem is different: the supposedly settled scene misclassifies related content. The root reviewer owns that finding and correction.
- The 320×740 and 390×664 selected groups inspected here remain inside the primary reading area. The narrow header wraps and the dot-only chapter controls give little destination information, but I did not reproduce overlapping header controls or a primary endpoint text clip beyond the heading issue.

## Platform and performance risks that remain hypotheses

- No physical iPhone, mobile Safari, browser-process termination or manual VoiceOver session was tested here. Chromium emulation cannot dismiss the previously reported physical crash.
- The runtime measures `innerHeight` and listens to `window.resize` (`motion.ts:570-590`, `843-857`); browser checks use `setViewportSize`, which changes viewport dimensions cleanly. Actual iOS visual-viewport offsets, toolbar animation, pinch zoom, OS text scaling and interrupted gestures can differ. A physical test should hold a reading group while expanding/collapsing browser chrome, rotating and backgrounding/returning to the tab. This is a verification gap, not a reproduced iOS defect.
- Material shades repaint at quantized hundredths (`motion.ts:323-338`), front/back content is display-culled (`351-363`), and the ink switch repaints many text descendants. Chromium surface-area estimates only bound selected paper backing sizes; they do not measure WebKit's raster caches, tile duplication or total GPU/process memory. Preserve the current high-density paper budget; do not add full-face filters, duplicated compositor-backed paper or another engine to solve these interaction issues.
- Headless animation timing is supplementary. Screenshot calls, concurrent review work and the host compositor differ from a handheld display. A page-load Lighthouse score cannot establish scroll quality.

## Recommended bounded sequence

1. Correct and verify the related rate-heading group, as the root review already scopes.
2. Repair keyboard reachability and direction-aware settling with focused behavioral checks before changing the camera path.
3. Define one logical scene inventory for headings, copy, focus exposure and caption transitions; eliminate the ink-state threshold gap.
4. Align ordinary reading/ARIA order with the proposal narrative, preserving no-JavaScript output.
5. Direct the remaining rates → window → partnership conclusion within the existing CSS/GSAP renderer. Review intermediate and reverse frames again at all four widths.

A fresh endpoint-only suite cannot close I-01 through I-05. Each acceptance check above targets a real path or meaning that current checks omit.
