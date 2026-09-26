# Remediation batch: continuous Z-fold and paper material

## Target

- Batch ID: `z-fold-motion-material-2026-09-26`.
- Status: **implemented and verified locally; selected findings resolved within the approved local scope**.
- Scope: the homepage `/handrail-proposal/`, its motion/material implementation and related reading regressions.
- Curated source: the user's report that motion feels choppy or stuck, the request for a true Z-fold and realistic paper, and the independent browser baseline below.
- Baseline artifacts: `qa-artifacts/motion-interruptions/report.json`, associated screenshots and `probe.mjs`; root's baseline analysis. Raw artifacts remain ignored.
- Working ledger: the finding table in this batch. Do not infer resolution from the previous release's endpoint tests.
- Publication: **published and hosted-verified**. The existing business proposal and Handrail branding are unchanged.

This batch was recorded before the replacement motion/material implementation. It adapts the global remediation-batch template to the user-approved local workflow; credentialed Stagehand/Browserbase verification remains omitted under that standing authorization.

## Curated findings and classification

| ID    | Finding                                                                         | Baseline evidence and scope                                                                                                                                                                            | Classification                 | Current local status                                                                                                                     |
| ----- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ZM-01 | Scrolling advances while the scene stays still, then movement resumes abruptly. | The baseline's longest stationary interval was 716.6ms, with approximately 60fps and no long tasks. The comparable analysis found 147/527 unchanged scene samples despite advancing rendered progress. | Product choreography defect    | Fixed locally: continuous-input regressions, frame comparison and independent rendered review.                                           |
| ZM-02 | The wings fold inward rather than forming a Z.                                  | The previous wings rotated in opposite signs around opposite hinge edges.                                                                                                                              | Product geometry/design defect | Fixed locally: same-sign hinges, opposite depth, face-facing reading poses and rendered/native review.                                   |
| ZM-03 | Mobile height changes rebuild and rebase the journey.                           | Changing 390×844 to 390×780 moved scrollY from 3514 to 3232. The chapter stayed stable; this was a rebase, not a demonstrated chapter change. Six height changes triggered six rebuilds.               | Product viewport-state defect  | Fixed locally: zero rebuilds and unchanged scrollY across six height changes, plus breakpoint and canceled-touch regressions.            |
| ZM-04 | The sheet lacks convincing paper texture, edges and light.                      | The user requested realistic paper texture and lighting after reviewing the published material.                                                                                                        | Material design revision       | Fixed locally: matte grain, edges, creases and orientation-linked lighting passed rendered material review.                              |
| ZM-05 | Chapter endpoints alone do not establish continuous journey quality.            | The previous 19-test suite missed stationary intervals and viewport rebasing.                                                                                                                          | Verification coverage gap      | Fixed locally: 25 browser tests include continuous input and lifecycle coverage; current captures include transition samples and videos. |

No auth, data, billing or business mutation is involved. The root cause indicated by the baseline is progress-to-scene choreography, not an established frame-rendering throughput failure. Material quality requires rendered comparison; it cannot be inferred from a CSS change or a high performance score.

## Intended behavior

A real Z-fold uses same-signed wing rotations around opposite hinge edges, placing the two wings on opposite sides of the center sheet. The camera moves around the structure to face the panel being read. Do not flatten the accordion solely to conceal incorrect geometry.

Native scroll supplies the target progress; one GSAP ticker owns critically damped scene progress so startup and rapid input cannot bypass the animation mapping. A pure sampled camera path coordinates pose, hinges and scale. Position and first derivative are continuous at joins (C1 continuity); interpolate zoom in logarithmic scale so changes in apparent magnification feel consistent. Chapter controls target exact reading poses. The document responds throughout active scroll without fixed dead-scroll intervals. Reading is paced by gentle movement and by the reader stopping input, not by consuming a block of scroll with no visible response. After about 650ms without input, a position between reading regions may settle smoothly to a readable pose by animating the native scroll position. New wheel, touch or keyboard input cancels that settling immediately. It must not fight sustained input; resuming and reversing remain continuous.

Mobile browser-chrome height changes preserve the scene and reading position. Width/orientation changes may remeasure framing, but preserve the logical chapter and progress through it instead of replaying the opening or jumping to another section. Use stable mobile stage dimensions rather than rebuilding the journey for every address-bar resize.

Paper should look matte and tactile: fine local grain, thin edges, credible crease shading, soft projected shadows and restrained directional illumination that changes coherently with face orientation. Lighting and texture must keep printed text sharp, readable and high contrast. No glossy reflections, shiny card finish, bloom or coarse noise over the copy.

## Non-goals

- No compensation, benefits, 90-day-window or broader partnership-copy changes.
- No new brand direction, paperclip, decorative symbols, calculator or signature flow.
- No backend, analytics, account system, private financial disclosure or profile mutation.
- No new credential request, paid generation dependency or claim of full global lifecycle certification.

## Changed implementation and ownership

- Root: `src/scripts/motion.ts`, pure `src/scripts/tour-path.ts` and `tests/tour-path.test.ts`.
- Material implementation: `src/styles/global.css`, `src/pages/index.astro` and `public/paper-grain.svg`.
- Independent browser reviewer: `tests/e2e/proposal.spec.ts`, continuous-input probes/capture and current rendered evidence.
- This record and `DESIGN.md`: current motion/material intent and acceptance boundary.

## Implementation completed

1. Replaced the separate scroll-animation mapping with one GSAP ticker owning damped visual progress. Native scroll sets its target. `tour-path.ts` samples a shape-preserving C1 cubic camera path with logarithmic zoom; startup and reverse input use the same path.
2. Applied same-signed wing rotation at opposite hinge edges. The camera faces the selected panel at reading poses, while other panels remain folded. Chapter controls animate native scroll to the corresponding pose.
3. Removed fixed dwell regions. Slow reading movement and cancelable idle settling pace the journey. Wheel, touch and scroll keys cancel automatic movement. Both `touchend` and `touchcancel` release touch ownership.
4. Preserved stable mobile height through browser-chrome changes. Width changes retain the reading stop or its containing section across the mobile/desktop breakpoint. These two lifecycle edge cases were found during independent source review, fixed, and covered by browser regressions.
5. Added local SVG paper grain, thin edges, crease treatment, projected shadows and face-orientation-linked diffuse light. Existing content, branding, notes, ordinary reading, reduced-motion and no-JavaScript access remain.

## Verification plan

Run from the repository with its declared pnpm/Node tooling:

```sh
pnpm check
pnpm test
pnpm build:release
pnpm pdf:check
pnpm test:e2e
pnpm build-storybook
pnpm test:components
pnpm format:check
CAPTURE_OUTPUT=qa-artifacts/z-fold pnpm capture
pnpm performance
```

The browser suite was extended with the continuous scenarios below; the old endpoint suite was not treated as sufficient. The baseline `probe.mjs` accepts `PROPOSAL_BASE_URL`, but writes its baseline report paths: preserve baseline copies or choose separate output paths before any rerun.

Required current evidence:

- Continuous slow wheel input through the entire journey, fast forward flicks, immediate reversal, pause/resume, idle settling cancellation and repeated traversal. Exercise immediate startup input as well as an already running scene. Sample actual scroll, camera/hinge transforms and visual movement across the path, not only at chapter buttons.
- Same-signed Z-fold wing angles around opposite edges and a camera orientation that exposes the intended readable face. Inspect partially folded states as well as reading positions.
- Resize sequences covering mobile height-only changes and width/orientation changes. Compare logical progress and the active reading position before/after; no opening replay or unexplained position jump.
- Full framing, readable text and contrast throughout reading regions, with no clipping or face crossing during transitions. Preserve keyboard focus, direct notes/PDF access, browser-back behavior, ordinary reading, reduced motion and no-JavaScript content.
- Content-distinct before/after images, material closeups and transition frames or a video/replay. Inspect grain at reading distance, edge/crease depth and light/shadow changes across orientations. Static endpoint screenshots alone cannot prove a smooth journey.
- Current console/network output, focused tests, app build, PDF consistency and performance measurements. Workshop checks cover touched reusable surfaces; app-specific 3D motion remains app-level evidence.
- Where relevant, supplementary WebKit behavior/native-window review with the existing protocol-screenshot backface limitation kept explicit. Do not treat that known capture defect as an application material fix.

Visual and ARIA baseline enforcement is not newly invented for this batch. Existing keyboard/accessibility scans remain required. No dependency installation is planned; if implementation adds a package, inspect its declared runtime/license and dependency health before adding it.

## Independent review and local verification authorization

The root/material implementers do not supply the sole acceptance verdict. The independent browser reviewer must exercise the revised journey, compare the selected findings and inspect current rendered motion/material evidence. Root can provide additional native-window review where the browser screenshot protocol is unreliable.

The user previously approved local deterministic verification with credentialed generation, Stagehand semantic QA and Browserbase replay omitted. That authorization persists for this revision. No new Stagehand report, semantic-reconfirmation manifest or full-cloud certification is claimed or fabricated. Closeout must identify the actual local evidence and independent reviewer, and preserve any unresolved visual concern or coverage limit.

## Stop gates

- Unexpected changes to business terms, brand direction, auth, data, billing or production scope.
- Inability to reproduce the selected finding or to capture current motion/material evidence.
- Unrelated test failures, unclear repository ownership or dependencies that require unapproved spend/credentials.
- A proposed fix that merely masks dead motion or incorrect folding without correcting its progress/geometry cause.

Do not stop for the already authorized omission of credentialed services. Keep manual VoiceOver, physical-device and field-INP coverage unverified unless actually performed.

## Closeout ledger

- Fixed locally: ZM-01 through ZM-05, within the explicitly approved local verification scope.
- Partial: none of the selected local findings remain partial.
- Unresolved implementation defects: none currently identified by the independent source review.
- Superseded: the old assumption that passing chapter endpoints establishes the whole journey's motion quality.
- Blocked: none identified within the approved local scope.
- Next checkpoint: user visual review; publication and hosted verification are complete.

## Evidence after implementation

The independent browser reviewer ran `pnpm test:e2e` against the final local build: **25/25 passed in 19.1s**. The six added behaviors cover continuous scene movement, startup fast flick/reversal, idle recovery and input cancellation, mobile height-only resize, mobile-stop to desktop-parent preservation, and recovery after a real CDP `touchCancel`.

The preserved baseline is `qa-artifacts/motion-interruptions/report.json`; the revised comparable probe is `qa-artifacts/z-fold-interruptions/report.json`:

| Measurement                                             | Baseline        | Revised local probe     |
| ------------------------------------------------------- | --------------- | ----------------------- |
| Maximum stationary interval during continuous input     | 716.6ms         | 50ms                    |
| Same camera and hinges while rendered progress advances | 147/527 samples | 2/560 samples           |
| Early peak rendered-progress speed                      | 43.0 per second | 8.36 per second         |
| Rebuilds during six phone-height changes                | 6               | 0                       |
| Revised resize sequence scrollY                         | Not applicable  | 2640 at all six heights |
| Long tasks                                              | 0               | 0                       |

These measurements concern the same local probe and are not a physical-device or universal frame-rate guarantee. They support correcting the choreography rather than claiming that a rendering-throughput problem was fixed.

Final capture is recorded in `qa-artifacts/z-fold-final/capture.json`, timestamp `2026-09-26T21:13:12.155Z`: **24 chapter images, 15 opening samples, three full-journey videos and 1,143 animation-frame records**. There were zero errors, warnings or failed requests. Measured reading text is at least **13.48px**, and the composed front-facing normal at reading targets is approximately 1.0. The independent browser reviewer exercised the complete journey and supplied these receipts. Material review passed; root also inspected the result in a native browser window. A separate source/document reviewer inspected `desktop-fold-04.png`, `desktop-fold-13.png` and `small-mobile-03.png`, finding correct accordion depth, a thin matte edge, fold shading, soft cast shadows and sharp reading text. Additional integrated material evidence is in `qa-artifacts/paper-material/integrated-material-receipt.json` and its associated images. This supports local closure of ZM-01, ZM-02 and ZM-04; the user’s aesthetic acceptance is not inferred.

Supplementary WebKit verified 21 reading positions at 1440/390/320px: full bounds, composed face normals, legibility, hinge reversal and ordinary reflow pass. Its IntersectionObserver reports a 0.593 ratio for a face whose bounds match Chromium’s fully framed bounds; root confirmed the actual paint in the native desktop window. The verifier uses full bounds and normals, while Chromium retains its IntersectionObserver assertion. Hit-testing returned a transparent parent for some right-wing points in both engines; those counts remain diagnostics and are not a clickability pass. Native desktop beginning, open Z-fold and rate views were inspected and correctly rendered. Protocol screenshots retain the independently reproduced hidden-backface limitation. Headful WebKit did not honor phone viewport emulation, so native mobile and physical iOS remain unverified. See `agentic-ui/webkit-verification.json`.

The broader build, unit, PDF, workshop and performance receipt is maintained in [IMPLEMENTATION.md](../IMPLEMENTATION.md). Current local Lighthouse measurements are in `agentic-ui/performance-evidence.json`; page-load scores are separate from the continuous-motion evidence above. Manual VoiceOver, physical iOS devices and field INP remain unverified. The WebKit protocol limitations above do not justify changing correct CSS geometry.

This revision is published; the final 27-test hosted suite passed in 21.7s. User visual acceptance remains separate. Earlier inward-folding release screenshots and receipts are historical.

## Cold-load follow-up

Root observed the unpositioned sheet briefly flashing during a cold public navigation before fonts and the camera module were ready. The tour now reveals the sheet and controls only after the first measured pose is applied. A four-second initialization timeout restores normal reading if the module or fonts fail; no-JavaScript and reduced-motion reading are unchanged. Both cases pass; the complete local suite passes 27/27 in 20.8s. The startup refinement is published; all 27 hosted tests pass in 21.7s. This addresses initial presentation separately from the already-verified continuous journey.
