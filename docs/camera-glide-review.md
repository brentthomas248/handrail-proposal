# Camera glide review

## Verdict

Accept the bounded reading-motion correction. The current rendered candidate makes the viewpoint travel across a consistent folded sheet, with a restrained pullback and return. No unresolved finding was observed within this scope. This is an independent review of the current render, not a new full-site numeric grade.

## Scope and source findings

The user wants the viewpoint to travel across a stationary trifold, with a slight pullback and return during each transfer. Opening and closing remain actual folding sequences.

The preceding reading bridges animated one hinge from 38° to 62°, added alternating roll and overshot the reading yaw. That combination physically changed the paper while moving the viewpoint, producing the reported turntable impression. Face illumination also used camera-rotated normals, so the matte surface brightness moved with the viewpoint.

The correction holds reading hinges at 38°, keeps reading-transfer roll at zero, bounds camera yaw to the reading faces, and supplies a restrained zoom-out/return for both cross-panel and same-panel transfers. Camera-facing culling remains separate from world-fixed diffuse lighting. The inverse transform on the HTML sheet is compatible with a moving camera; its location in the DOM is not itself the defect.

## Current rendered evidence

Independently captured Chromium video, held screenshots and continuous transform samples at 1440×1000, 390×844 and 320×568. Exercised every forward reading transfer, then reverse travel and an interrupted reversal. Separately inspected initial folded and final closed material at each size. Capture and extraction commands:

```sh
node qa-artifacts/camera-glide/review/capture.mjs
node qa-artifacts/camera-glide/review/material-check.mjs
node qa-artifacts/camera-glide/review/extract.mjs
```

Evidence remains ignored under `qa-artifacts/camera-glide/review/candidate-v1/`; `summary.json` records the scoped measurements.

- All 17 held reading compositions were visually inspected. Their complete primary ideas remain visible, including both mobile rate choices and their common terms. Peripheral neighboring copy during travel is context, not the destination composition.
- The crease stays visually connected as the camera passes it. Both wings remain exactly 38° across all 2,582 sampled reading frames. There is no paper refolding, roll sway or sudden turntable relighting during those transfers.
- Same-panel transfers add a modest retreat before returning to reading distance. Cross-panel transfers preserve a coherent lateral route across the fold. The longer Window → Grow together move passes across the center leaf without the former detour toward the sheet center.
- Forward and reverse sequences show no disappearing paper face, print flash or visible snapping. All three interrupted returns reproduce their starting held transform exactly.
- The measurement helper covers 13 complete groups and 187 text-line rectangles, with none outside the measured header/control safe area. The four mobile rate groups were visually reviewed in their held screenshots; they use separate mobile selectors and were not counted by this helper. The implementer's scoped interaction suite provides separate deterministic coverage.
- Initial folded stock and the closed invitation retain readable print, restrained grain, connected edges and the full-strength Handrail logo. No browser page errors were captured.

Source and build hashes were unchanged before/after the review:

| File                       | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`    | `9b1ccd51c08b0ed17b491d6feb3844cda54b7d46d85f5e2476865141e75c0257` |
| `src/scripts/tour-path.ts` | `ff99b2683ab69a716146575694d59ec8fc9428b692abe7fdd31194a37a80d5f2` |
| `dist/index.html`          | `da305d989bbff61ddbef45fd512a35187113be2f7b3bf67d48092756674f6e10` |

The approved local workflow applies. This review does not certify physical iPhone playback, manual assistive technology, field performance or the omitted cloud tooling. Opening/closing timing, ordinary reading, material budgets and publication are owned by the separate scoped checks and release receipts.
