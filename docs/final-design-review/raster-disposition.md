# REN-R2-01 raster disposition

**Disposition: retain as unresolved P3. No app-source change is justified by the available evidence.** This 27 September 2026 investigation independently parsed the retained round-two traces and inspected the current face-culling, material and ticker code. It did not launch a browser, rebuild, change the app, or establish a new release score.

## Evidence

The evidence belongs to the frozen round-two candidate identified in [r2-rendering.md](r2-rendering.md), with HTML SHA-256 `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33`. It is not a performance certification of subsequent camera or typography changes.

- `qa-artifacts/final-design/r2/rendering/phone-repeat.trace.json` contains six `TileBasedLayerImpl::AppendQuads checkerboard` events. Each corresponding `LayerTreeHostImpl::CalculateRenderPasses` reports **one missing tile**; the next recorded pass reports zero, 7.931–8.841 ms later. There are 1,199 render passes in that trace. This is a compositor-pass observation, not the duration of visible damage on a physical screen.
- The completed RAF tracker separately reports `checkerboarded_need_raster: 6`, `checkerboarded_need_record: 0`, `expected: 600`, and `dropped_v4: 0`. Its denominator is not interchangeable with all render passes. The initial phone/desktop completed trackers retain the reported 4/601 and 6/601 raster counts.
- The repeat's missing-tile passes occur **1.381, 5.672, 7.514, 8.272, 9.230 and 9.298 seconds after its first DrawFrame**. They are spread through the scripted forward/reverse journey; the existing evidence does not limit the issue to the initial unfolding.
- `repeat.json` reports 1,078 unique displayed timestamps and a maximum displayed interval of 16.667 ms. Smooth scheduling does not negate the missing-tile events.
- Re-parsing both idle traces confirms zero DrawFrame, displayed-frame, Paint, Layout or UpdateLayoutTree events. The existing layer sweeps retain three drawn paper layers, with a peak calibrated paper estimate of **63.8065 MiB** on phones and a longest edge of **3097.5 device pixels**. The arithmetic headroom is only **0.1935 MiB** under 64 MiB.

## Cause boundary

The immediate diagnostic is a missing raster tile. The application-level root cause remains unproven. The checkerboard events contain a count but no affected layer ID, DOM node, tile coordinates or pixels. The repeat contains no screenshot or paint-invalidation-tracking events that establish a causal chain. Paint and RasterTask entries elsewhere in the trace do not independently identify the missing tile.

The repeat also contains 124 `TileManager::AssignGpuMemory tile violates memory policy` diagnostics without explanatory arguments. They are useful targets for a future focused profile, but do **not** establish that this app exceeded its declared paper-surface estimate, exhausted GPU memory, or caused a physical-device failure.

Source inspection identifies plausible preparation/invalidation seams in `src/scripts/motion.ts`'s `render()`: opposite-face `display` changes and quantized paper-lighting custom properties. `src/styles/global.css` paints grain, gradients and crease treatment into the faces. Neither seam is proven to cause these six misses. The renderer already avoids unchanged lighting writes and removes its GSAP ticker at convergence; measured idle traces support termination.

## Decision and next evidence

Retain the known P3 and its rendering-score deduction. Do not add retained opposite faces, speculative `will-change`, larger paper surfaces, an idle prewarming loop, or less frequent rendering solely to clear the diagnostic. Those changes could consume the small surface margin or degrade material/motion without fixing the cause.

A future correction needs a focused, isolated profile correlating the missing tile with its layer/DOM owner and face exposure or paint invalidation, plus frame-level visual evidence. Then test one identified change against the same cold forward/reverse profile, remeasure all five calibrated layer sweeps, and preserve zero idle work. A new browser run was deliberately outside this investigation; REN-R2-01 is neither fixed nor dismissed as harmless.

Verification here was read-only Node parsing of the three motion traces, two idle traces, `repeat.json`, and `layer-summary.json`, plus source inspection. No app test rerun was needed for this documentation-only disposition. The approved [local workflow](../local-workflow.md) and physical-iPhone verification limit remain in force.
