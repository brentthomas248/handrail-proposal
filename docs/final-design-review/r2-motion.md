# Round two — motion direction and spatial choreography

**Independent score: 98/100.** One P3 pacing refinement; no P0, P1 or P2 motion defect established. This is a bounded local design assessment, not physical-device or performance certification.

## Candidate and independence

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`, against the candidate identified by the review owner as the 10:07 build.
- Independently fetched the served document. SHA-256 `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33` matches `qa-artifacts/final-design/candidate/identity.json`. Receipt: `qa-artifacts/final-design/r2/motion/identity-check.json`.
- Read the required project instructions, design specification, approved local workflow and neutral brief. Did not read prior reviews, scores, implementation commentary, remediation or progress records. Only the accepted reference rows were retrieved from `docs/redesign-research.md` to resolve the four reference URLs.
- Used fresh isolated **headed Chromium 153.0.8010.12** contexts through the installed Playwright 1.63.0. Did not run existing tests or reuse their captures. No app changes, rebuild, commit or publication.
- Evidence root: `qa-artifacts/final-design/r2/motion/`. Original screenshots were inspected individually, including CSS-pixel captures of the phone poses and intermediate frames. Videos were recorded as supplementary continuous evidence; the judgment below is based on inspected original consecutive frames and input observations.

## Scope and input

| Viewport | Independently exercised |
| --- | --- |
| Desktop 1440×1000, DPR 1 | Entry; full forward and reverse wheel journey; 66 × +80-pixel and 33 × −160-pixel wheel steps with 100 ms sampling; exact chapter entry; pause/idle settling; cancellation by reverse input; +1700/−1200 rapid flick; equal +480/−480 flick reversal. |
| Phone 390×844, DPR 3 | Native Chromium touch input through CDP `Input.dispatchTouchEvent`: 19 upward and 19 downward gestures, 230 pixels in ten moves at 25 ms intervals; opening through the window and reverse; all seven exact chapter poses; held-touch cover-to-cash path; normal-reading switch and return. |
| Short phone 390×664, DPR 2 | Complete opening-to-closing journey with 25 native touch gestures, 200 pixels in eight moves at 28 ms intervals; immediate reverse/forward touch; exact window pose. |
| Small phone 320×740, DPR 2 | Resized from the short phone while on the window; independently inspected retained complete window, folded entry and partial/full-width unfold. This was a framing spot check, not a second full journey. |

Screenshot calls add time between some sampled steps. These runs establish rendered paths and response, not a calibrated human swipe velocity or frame-delivery benchmark. Tablet 768×1024 was omitted from this specialist pass.

## Scored criteria

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Folded reveal | **20/20** | The compact packet becomes a visibly connected three-panel object before the camera enters the reading composition. Both hinges and all panel extents remain in frame during the inspected open phase at desktop, phone, short phone and narrow-phone spot check. The folded back rotates away instead of becoming mirrored readable copy. No deduction. |
| Camera/crease continuity | **20/20** | The inspected forward and reverse frames retain connected creases. Cover→cash and cash→rates travel follows the adjacent hinge; rates→window moves down the same paper; window→closing crosses the lower connected composition. No observed teleport, face flash, disconnected crease or unexpected return to the distant opening. This is visual continuity evidence, not a mathematical proof of C1 continuity. No deduction. |
| Pacing and reading transitions | **18/20** | Chapter landings give the complete idea a stable, front-facing composition. Reading scale changes are purposeful; mobile separates the two rate choices and keeps each explanation with its rate. **−2 for M2-M01:** the phone cover→cash transition spends a noticeable portion of the gesture traversing blank cover area and clipped fragments before the rust content becomes useful. This is a minor editorial pacing weakness, not missing terms or an unreadable landing. |
| Reversibility and input response | **20/20** | Native wheel and touch genuinely advance/retrace the scene. A paused desktop cash→rates transition began settling forward; reverse wheel input canceled that travel, held native scroll steady during the next samples, and subsequently settled back to Cash flow. Equal positive/negative flick input returned to the original cover stop. Short-phone reverse/forward input remained responsive. No deduction. |
| Expressive restraint and spatial coherence | **20/20** | Interest comes from one matte printed object, perspective, the rust face and its hinges. The fixed header/controls provide a stable reference. There is no perpetual decorative movement, gratuitous count-up or competing animation. The closing returns to the original left panel, making the relationship between opening and contribution legible. Optional ordinary reading remains directly available and returned to the tour in the exercised path. No deduction. |
| **Total** | **98/100** | **2 points deducted.** |

Scores apply to the observed candidate and named criteria. Unmeasured engineering and physical-device claims are excluded rather than treated as proven by these scores.

## Finding M2-M01 — phone cover-to-cash traversal crosses an uninformative paper area

**P3 minor · confidence high in the observation, medium in the preferred refinement.** Aesthetic pacing judgment with a repeatable input path; no lost proposal content.

**Expected:** During the move from the opening proposition into the collections illustration, maintain a useful outgoing/incoming visual anchor while preserving the hinge reveal. Transitional copy need not remain fully readable at every frame, but the visual change should continue to explain the next destination.

**Actual and impact:** At 390×844, moving past the cover makes the heading leave the left edge before the incoming rust heading is usefully framed. A broad blank area occupies the center, with a fragment of the later “New business” section at the bottom. The rust panel then enters narrowly and obliquely. The scene is moving, but the reader briefly has little narrative information to follow. This is most apparent during a slow held gesture; it is less noticeable in a fast flick. The full Cash flow landing remains intact.

**Fresh evidence:** Starting from the exact cover stop at native `scrollY=1060`, held touch advanced through ten 50-pixel moves, each followed by 100 ms before its sample. The first movement includes Chromium's touch threshold. Inspect the originals together:

- `phone-cover-cash-02.png`: `scrollY=1145`; coherent outgoing cover.
- `phone-cover-cash-04.png`: `scrollY=1245`; outgoing cover clipped left, center dominated by blank paper, later heading cut by bottom controls.
- `phone-cover-cash-06.png`: `scrollY=1345`; blank cover area remains central, incoming cash face narrow at right.
- `phone-cover-cash-08.png`: `scrollY=1445`; hinge is clear, incoming text still significantly oblique/cropped.
- `phone-cover-cash-10.png`: `scrollY=1545`; still between the cover and cash reading composition.
- `phone-cover-cash-settled.png`: after touch release, the scene settled to the complete Cash flow pose at `scrollY=1980`.
- Exact scene transforms, native positions and timestamps: `cover-cash-samples.json`. The earlier independent touch journey reproduces the same passage in `phone-forward-05.png` and `phone-forward-07.png`.

**Bounded suggested correction:** Tune only the mobile cover→cash path: advance the hinge/incoming-panel framing sooner or add a slight local pullback so the outgoing proposition and incoming collections heading overlap more usefully. Preserve the continuous fold, existing chapter endpoints and native input ownership. Do not replace the transition with a cut or add a frozen scroll interval.

**Recheck condition:** At 390×844 and 390×664, repeat a slow held gesture, ordinary swipe and reverse over cover→cash. Inspect consecutive originals around the same relative interval. The central blank traversal should be shorter, while the crease remains continuous, all terms remain complete at the Cash flow landing and idle settling remains interruptible. If retained intentionally, record this as an accepted minor pacing tradeoff; it is not a P0–P2 release blocker from this review.

## Positive evidence and response details

- **Complete opening:** `desktop-forward-02.png`, `04`, `06`, `08`; `phone-forward-00.png`, `01`, `02`; `short-forward-02.png`; `small-open.png`. The three-panel extent remains framed before the deliberate reading zoom.
- **Hinge travel:** `desktop-forward-24.png`, `36`, `40`; `phone-forward-07.png`, `11`. These show actual intermediate geometry, not merely chapter buttons landing correctly.
- **Lower-page connection and closure:** `desktop-forward-48.png`, `52`, `56`, `60`, `desktop-end.png`; `short-forward-21.png` and `short-end.png`.
- **Complete phone endpoints:** `phone-chapter-1.png` through `phone-chapter-6.png`. In particular, the two rate scenes include their explanations and shared terms; window and contribution remain coherent groups. `short-window.png` and `small-window.png` preserve the full 90-day sequence.
- **Idle cancellation:** `desktop-samples.json` labels `cash-exact`, `partial-forward`, `idle-start`, `cancel-reverse-*` and `cancel-reverse-settled`. Native scroll moved from 2651.5 to 2931.5 after input, then to 3441 during settling; reverse input brought it to 3296.5 and interrupted that forward travel. The next idle landing was 2651.5, Cash flow. Exact capture timing is in the samples; no frame-rate claim follows from it.
- **Equal flick reversal:** `equal-flick-forward`, `equal-flick-reverse-*`, `equal-flick-return` in `desktop-samples.json`, plus `desktop-equal-return.png`. The +480/−480 input returned native scroll to 1255 and the exact cover pose.
- **Optional motion:** `phone-normal-mode.png` and `phone-return-tour.png`. This covers the exercised mode switch, not the broader keyboard/no-JS/reduced-motion matrix assigned to inclusive interaction.
- **Continuous recordings:** `videos.json` identifies the desktop, phone and short-phone WebM files. `desktop-samples.json`, `phone-samples.json`, `short-samples.json`, `phone-endpoints.json` and `cover-cash-samples.json` retain the independent input observations.

## Reference basis

The approved reference mapping informs the judgment: [Telescope](https://telescope.fyi/) supports coordinated overview-to-detail scale and framing; [Igloo](https://www.igloo.inc/) supports continuity within one spatial environment; [Exat](https://exat.hottype.co/) supports deliberate display/reading scale; [Stripe Press](https://press.stripe.com/) supports a credible document object that still serves reading. These are the project's accepted principles, not a claim that this reviewer newly audited those sites or copied their interactions.

The [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion) was rendered in a browser and its main content read during this review. Purposeful, optional, gesture-consistent and cancellable movement are the relevant standards here. The observed reversibility and ordinary-reading control support them; M2-M01 concerns how effectively the movement communicates the next reading destination.

[web.dev's animation guide](https://web.dev/articles/animations-guide) distinguishes transform-based motion from proven frame performance and calls for profiling paint and dropped frames. It supports keeping the following limits explicit rather than treating attractive frames as performance evidence.

## Untested limits

- **Physical devices:** No physical iPhone, Safari browser chrome, touch hardware, device thermal/memory behavior or prior crash condition was certified. CDP native touch in Chromium is browser-emulated touch, not an iPhone test.
- **Actual frame performance:** No dedicated compositor/frame trace, paint profiler, dropped-frame measurement, field INP or battery/performance study was run. The screenshots and videos prove rendered motion states and input paths. They do not establish 60 fps, low memory use or physical-device stability. Recording/capture and concurrent desktop activity can also affect cadence.
- No WebKit/Firefox acceptance, manual VoiceOver, no-JavaScript, reduced-motion, keyboard matrix, PDF, notes/resume or portfolio audit was performed in this motion pass. Tablet and a full 320-pixel journey remain untested here.
- No complete mathematical continuity or source-code audit was performed. All continuity conclusions are limited to the independently observed rendered journeys.

The only changed durable source artifact is this report; the remaining outputs are ignored evidence under the assigned directory. Integration and publication decisions remain with the review owner.
