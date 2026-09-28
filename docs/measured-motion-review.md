# Independent review of deliberate scene motion

Verdict: **accept the current deliberate-motion candidate within the rendered local scope**. The opening now has a gradual start and enough time to establish the fold; later camera movement has a clear departure, travel and arrival. Immediate short-gesture commitment is preserved. This is a bounded motion judgment, not a claim that every physical-device frame problem has been eliminated.

The user's report that the opening remains choppy and travel is now too fast supersedes the prior prompt-gesture acceptance. This review separates responsiveness, animation pacing and actual frame delivery; a fast exact arrival does not prove a smooth or satisfying reveal.

Reviewed 27 September 2026. Scope is the folded reveal and immediate-commit scene travel. The existing commercial copy, printed compositions and reference direction remain constraints. No application or regression-test code is changed by this reviewer.

## Basis and initial critique

The reviewer read `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, the current implementation checkpoint, the approved local workflow and the repository's approved reference/motion research. Telescope informs overview-to-detail travel, Igloo continuous camera direction, Exat typography and Stripe Press physical document treatment. These are art-direction references, not a numerical animation standard.

The published magnetic timing conflates two distinct requirements: acknowledging a short gesture and completing the whole camera movement quickly. Its opening spans 108 degrees of wing travel in the 0.48-second minimum, using `power2.out`. That ease crosses about half its distance in the first 100ms, then spends the remainder decelerating. It leaves little time to recognize the alternating folds before the overview is already established. An immediate response can instead begin a longer, deliberate transition without requiring additional scrolling.

**MM-01 — material pacing defect.** The source compresses the reveal and crease orbits into 0.48–0.8 seconds irrespective of their visual complexity. The user's report confirms that this feels too fast. Bounded correction: retain immediate gesture commitment and one-stop latching while giving the opening and crossed-crease travel sufficient continuous time, with a single smooth acceleration/deceleration owner. Recheck in real forward/reverse motion, especially the first cold opening; do not approve from timing numbers alone.

**MM-02 — unresolved choppiness.** Previous geometry passes and accepted endpoint captures did not establish physical-device smoothness. Treat the opening complaint as unresolved until current isolated profiling and independent cold rendered evidence identify whether visible pauses, uneven path velocity, paint work or a combination remain. Do not infer resolution merely by increasing the duration.

## Acceptance before capture

- The initial short input starts the response promptly without waiting for release or repeated scrolling. Response latency and total travel duration are measured separately.
- The cold opening reads as one continuous unfold: the packet expands, both creases articulate and all three panels fit before the cover approach. No newly exposed face flashes, vanishes or pops into its reading state.
- The reveal and crossed-crease orbit have time to be perceived. They neither snap through most of their distance immediately nor drift through an excessively long tail. A longer duration is a design hypothesis to inspect, not an automatic pass.
- Continued same-direction input stays with the selected stop; arrival holds until a new deliberate gesture. Reverse input remains responsive.
- Every primary reading group retains its heading, explanatory copy and qualification inside the actual header/control safe area on desktop, phone and a narrow short phone.
- Ordinary reading stays accessible during a flight and restores native document travel. No new user-visible runtime errors are accepted.
- Actual compositor/frame delivery is the separate rendering investigation. Headed recorded-video evidence establishes visible composition/rhythm within its capture limitations, not physical iPhone certification.

## Candidate and independent method

The source and build hashes were identical before and after this capture:

| File                       | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`    | `a3f98f260064559cd5000be6de32b4cfcae4981cd2f835edfc92fcae175c107a` |
| `src/scripts/tour-path.ts` | `04c348e0aa41c96b3c366e533427cb24d33568870501c73e55a3df509ee34817` |
| `dist/index.html`          | `1bc85f8205206d7adbcbedcb244aad96e249553f1be9ecaee049969a231b7126` |

Headed Chromium used fresh isolated contexts at 1440×1000 with DPR 1, and 390×844, 320×568 and 390×664 with DPR 3 and mobile/touch emulation. Each cold opening was captured before any chapter navigation or prior traversal. Desktop input was a one-pixel wheel event; phone input was a 35px native touch drag delivered through Chromium CDP. The first three viewports completed every concrete stop forward and backward, an interrupted cross-panel departure and a normal-reading escape. The 390×664 context covered the cold unfold and cover approach.

Original browser videos, arrival PNGs and per-animation-frame transforms were recorded. The reviewer inspected the opening sequences, extracted crease/orbit frames and full-resolution original reading captures, including Cash flow, both rate choices, the complete window and closing. Text-node Range rectangles were compared with the actual header/control safe area. Capture overlapped the owner's functional compatibility browsers; no isolated FPS or compositor-performance claim is made from this review. Credentialed Stagehand and Browserbase remained omitted under the approved local workflow.

The video extraction helper's estimated wall-clock offset is only an index into the recording and can include recorder padding. The first-four-seconds contact sheets therefore sample the original video from its actual beginning; source timing conclusions use the per-frame browser timestamps, not inferred video alignment. Contact sheets do not replace the inspected originals.

## Findings and disposition

**MM-01 — resolved in the current candidate.** The fold does not launch through most of its hinge movement at the start. Its first movement is small, the wings progressively articulate through their grazing orientation, and the camera reaches the full spread before a separate gesture approaches the cover. The rust center remains a stable spatial reference. Natural self-occlusion remains visible while folded; no detached wing, blank front-face flash or mirrored reading face was found in the inspected sequences.

The 1.7-second opening now has time to read as physical action. The later 1.1–2.0-second flights feel differentiated: same-panel reading moves are quieter and shorter, while crossed creases receive more time to turn and settle. The longer two-crease return to the closing panel is perceptible as travel around the object rather than a slide swap. None of the inspected hops requires continued scrolling, and the ending does not add a second spring tail. I do not request a further duration increase or path redesign for this candidate.

**MM-02 — bounded local resolution, physical-device uncertainty retained.** Independent cold sequences show a continuous unfold rather than the prior front-loaded jump. Floating-point camera progress changes smoothly while native scroll can remain on the same rounded value near the easing ends. The owner separately profiled the renderer in isolation and reports a remaining cold scheduling delay; that finding is not transformed here into a claim of perfect frame delivery. A real iPhone may still expose a performance problem that these captures cannot reproduce. The present evidence supports this narrower timing/progress correction without a speculative material rewrite.

**MM-03 — capture anomaly, not reproduced in recorded playback.** The initial 390×844 forward Hire first and Client first protocol PNGs omit the fixed header. The simultaneously recorded video shows the header continuously through the same orbit and held reading compositions, and the reverse Hire first original PNG also shows it. Both anomalous PNGs are retained. Original video frames establish the visual judgment for those two stops; the report does not silently discard the contradictory captures or change app code to address an unconfirmed product defect.

## Complete compositions and interaction

All 42 captured arrivals reached their intended captions and held the same native position and camera transform during the additional 300ms idle observation. Forward/reverse visits returned to matching reading positions, including the exact folded 0px start. All 487 sampled primary text-line rectangles remained inside the measured safe area; no clipped line or page error was recorded.

| Viewport                    | Concrete arrivals | Primary text-line rectangles | Clipped lines |
| --------------------------- | ----------------: | ---------------------------: | ------------: |
| 1440×1000                   |                12 |                          139 |             0 |
| 390×844                     |                14 |                          169 |             0 |
| 320×568                     |                14 |                          171 |             0 |
| 390×664, opening/cover only |                 2 |                            8 |             0 |

The short phone's Cash flow composition is dense but preserves the installment premise, both dollar amounts, collection rule and before-costs qualification. Rate stops retain rationale and common terms. The window and closing remain complete ideas. The slower approach does not alter the approved endpoint framing or turn individual sentences into isolated macro crops.

In all three full-journey contexts, a one-pixel reverse input after 400ms of cross-panel departure returned to the exact Cash flow stop. Read normally remained operable during travel; subsequent wheel input moved the ordinary document by exactly 35px in each context. No automatic second-scene advance occurred during the observed holds.

## Evidence and limits

Commands completed with exit 0:

- `node qa-artifacts/measured-motion/review/capture.mjs candidate`
- `node qa-artifacts/measured-motion/review/extract.mjs desktop`
- `node qa-artifacts/measured-motion/review/extract.mjs phone`
- `node qa-artifacts/measured-motion/review/extract.mjs narrow-short short`

Ignored evidence lives under `qa-artifacts/measured-motion/review/`. `candidate/results.json` preserves stable hashes, full timestamps, source transforms, complete reading-line measurements, interruptions and errors. Each viewport folder retains the original video, arrival PNGs, extracted unfold/orbit frames and contact sheets. `first-four-seconds.png` indexes the cold start. The two phone header-anomaly PNGs remain alongside the simultaneous video evidence.

No application or test edits were made by this reviewer. The owner's isolated performance profiles, regression tests, engine compatibility, release and hosted-byte checks remain separate evidence. This review does not certify physical iPhone Safari, real address-bar behavior, device GPU memory, physical trackpad inertia, manual VoiceOver, field INP or a whole-site numerical design score. No remaining P0–P2 visual-motion finding was identified within the inspected scope.
