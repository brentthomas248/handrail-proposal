# Paper rendering and material refinement

Status: published and verified.

## Target and findings

Batch PAPER-01 covers the opening and paper material on the proposal route. The user accepts the current scene pacing but still observes a choppy opening and a flat, digital paper appearance. This report supersedes any earlier claim that the opening is visually resolved.

- RENDER-01: opening playback remains choppy on the user's device.
- MATERIAL-01: the trifold needs perceptible paper texture, thickness and fold depth.
- QA-01: transform-coordinate and timing tests do not establish actual presented-frame smoothness.

Physical iPhone inspection remains unavailable. Preserve that boundary rather than interpreting emulation as certification. The approved local workflow applies; independent rendered review replaces the omitted credentialed services under the existing authorization.

## Root-cause hypotheses

The current render loop changes inherited shading values that feed textured face backgrounds, changes reverse ink and toggles face display while the object unfolds. Investigate repaint, raster and newly visible surface costs independently of camera timing. Compare cold and repeated openings and use controlled ablations before choosing an implementation. Distinguish actual callback timing from animation timestamps and presented-frame evidence.

The current grain is too fine to resolve at the viewing scale. Crease shading on the center panel is fixed because it uses that panel's zero hinge angle. Depth must come from coherent fold contact, a thin stock edge and restrained directional texture, with stable readable ink.

## Intended behavior and scope

Keep immediate short-gesture commitment, the accepted 1.7-second opening and 1.1–2-second scene transfers, exact reading stops, reversal, complete three-panel framing and the ordinary-reading/reduced-motion/no-JavaScript paths. Refine the material without changing business copy, typography, layout or downloadable documents.

Likely files: `src/scripts/motion.ts`, `src/styles/global.css`, the paper texture asset and scoped rendering tests. No new scene engine or dependency is planned. Preserve the 64 MiB estimated surface and 4096-device-pixel edge limits; count any new decoration surfaces in that budget rather than hiding them from the check.

## Plan and acceptance evidence

1. A rendering investigator captures the unchanged build in isolation, including Chromium/WebKit cold and repeat playback, traces and controlled ablations. A separate source auditor challenges the pipeline. A material specialist examines approved references and current renders.
2. Implement the smallest measured rendering correction and a coherent material treatment. Record alternatives and measured tradeoffs; do not slow the animation again to hide rendering stalls.
3. Compare before/after rendering cost and visible opening frames. An independent reviewer must inspect current material and complete reading scenes on desktop and phone sizes before publishing.
4. Run `pnpm check`, `pnpm test`, `pnpm format:check`, `pnpm build`, focused Playwright opening/timing/gesture/reading/framing/budget checks and supplementary WebKit verification. Keep original failures and diagnose them. Verify exact live assets and hosted interactions after publication.

Raw captures and profiling scripts belong under ignored `qa-artifacts/paper-rendering/`. Current release status is recorded in `IMPLEMENTATION.md` and the release receipts after verification. No aesthetic score or physical-device guarantee follows from green functional tests.

## Results

Controlled fresh WebKit processes reproduce a 47–51ms mid-opening callback gap while the front faces first enter view. Freezing the changing material paint removes it in both trials (19ms maximum); opacity-driven 16×16 light tiles also remove it (21–22ms). Visibility-only culling is inconsistent, and brightness filters—including explicit filter promotion—still repaint. Changing the grain image format alone does not solve the cost. These comparisons preserve the accepted timing and geometry.

The implementation keeps the printed fronts and backs static, animates small leaf lighting tiles and narrow crease strips, and replaces changing SVG ellipse geometry with fixed transformed floor tiles. Face culling retains layout. Absolute material decorations are excluded from printed content-height measurement, and renderer-owned visibility/opacity changes do not schedule typography checks. Actual thin edge planes bridge the existing front/back offsets.

The first material preview is rejected: high-opacity formation produces repeated pale blobs, especially on rust. The corrected asset lowers formation and bright fiber strength while preserving visible irregular fibers. Independent review accepts the corrected formation at actual reading scale; no passing performance result approves the rejected texture. It also rejects the former full-proposal view because its camera projection hides the Z silhouette. The final opening views blend toward a 22-degree pitch and -6-degree yaw, retaining the 38-degree hinges, full three-panel framing and every reading pose. This geometric correction supplies depth without adding stronger noise.

Four new cold regressions fail the immutable published baseline: newly exposed fronts paint 27–29 times and opening layout runs 101–102 times. The first test prototype incorrectly relied on absent `layerPainted` events; that vacuous result is retained and superseded. The corrected tests accumulate actual layer-tree paint counters across backend node identities and require nonzero first-exposure evidence. All four pass the current candidate: new fronts paint once, other face paint deltas remain zero, and layout runs twice. Timing, complete unfolding and exact endpoint checks remain.

The expanded high-density regression passes with 63.8768 MiB of estimated drawn face, light, crease, edge and floor surfaces, a 3177-device-pixel maximum edge, three face backings and no face pseudo-element backings. It counts material descendants and the floor as well as printed faces. This is a conservative surface-area estimate, not actual resident GPU memory.

The final exact v4 build reduces aggregate Chromium raster work from 1171 ms cold / 1137 ms warm to 89.1 / 36.4 ms, about 92% / 97% less worker CPU work. These are parallel-worker totals, not elapsed freezes. Layout runs twice. Cold capture has 34 paint events including first allocation of the material surfaces; warm capture has 10, and every retained material layer finishes with paintCount 1. Two fresh WebKit processes have maximum opening callback gaps of 21 and 20 ms, compared with 51 and 47 ms on the baseline. Chromium still records a 33.1 ms first-input scheduling gap. Callback cadence and paint evidence do not certify physical iPhone presentation.

Independent material review first rejects pale repeated mottling, then rejects the v3 overview's nearly planar silhouette. The corrected v4 camera exposes both creases through top/bottom slope changes and distinct face orientation, including at 320×568. Its four-size cold/reverse recheck records 16 held arrivals, 30 safe cover text-line rectangles and no page errors or observed face flashes. The preceding full material journey records 54 held arrivals and 648 safe primary text lines; that earlier capture is not relabeled v4. See [the independent review](paper-depth-review.md).

Final compatibility covers 70 Chromium scenarios. The initial run passes 68/70; two tests inspect hidden retained geometry before the destination's text appears. The strengthened reading helper requires real visible ink, complete bounds, unclipped lines, minimum text size and mobile context together in one snapshot. Its 10 focused rechecks pass with unchanged thresholds and unchanged application bytes. All 23 supplementary WebKit checks pass. Original failures and traces remain at `qa-artifacts/paper-rendering/compat-v4/`.

Typecheck covers 50 files with zero issues; all 34 unit tests, formatting, deterministic texture, canonical Markdown, both complete PDFs and the three-route build pass. All 28 rebuilt assets match the independently reviewed/profiled manifest. Current profiling is in `qa-artifacts/paper-rendering/final-profile-v4/`; the v3 profile remains historical. Full global/cloud lifecycle certification, physical iPhone playback, manual VoiceOver, actual GPU memory and field performance remain unclaimed.

Source `5e7950ce453906c717543ce02cb723bb2569393f`; static `7f8a88e8579c131649177480322e388b07d18e26`. [Pages deployment](https://github.com/brentthomas248/handrail-proposal/actions/runs/36363928330) succeeded. All 28 hosted files match the reviewed candidate; all 24 focused hosted checks pass without retries.

The closeout reconciles the paper asset manifest to the 512×512 generated tile. `texture:generate` now updates its digest, dimensions and generator provenance; `texture:check` verifies both the SVG and manifest. This check prevents stale asset metadata without changing the reviewed/published image bytes.
