# Bottom sweep review

## Verdict

Accept the bounded Window → Grow together motion correction. The current render crosses the bottom of the spread in one level lateral movement, with one restrained pullback and return. It no longer turns toward the center panel at each crease. No unresolved defect was observed in this reviewed transition or its reverse.

## Evidence

Independently recorded the production build in Chromium at 1440×1000, 390×844 and 320×568. At each size, a short wheel gesture advanced from The window to Grow together; a reverse gesture returned to The window. Reviewed continuous recorded sequences and full-resolution held screenshots, including the short phone composition. Commands:

```sh
node qa-artifacts/bottom-sweep/review/capture.mjs
node qa-artifacts/bottom-sweep/review/extract.mjs
```

Ignored videos, sequences, screenshots and transform samples are under `qa-artifacts/bottom-sweep/review/candidate-v1/`. Its `summary.json` records the following findings:

- Across 853 sampled frames, reading yaw stays at −38°, pitch and roll stay at 0°, and both hinges stay at 38°. The sheet does not bend or tilt twice as the viewpoint passes the creases.
- The view retreats once to approximately 90% of the smaller endpoint scale, then returns to the destination reading distance. The lateral sweep has no visible intermediate pause, face disappearance, print flash or extra turn.
- All six distinct held compositions and their three return captures retain the complete primary idea. All 115 measured text-line rectangles stay within the header/control and viewport bounds. The short phone preserves the notes link and bottom clearance. Neighboring cropped print during travel remains peripheral context.
- Each reverse journey restores the starting transform exactly. No page errors were captured.

The following source and build hashes were identical before and after capture:

| File                       | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `src/scripts/tour-path.ts` | `195da15abaea321db7e555b02eda8ae14f3a43ea75d2f9edabf1ce9b1b1ec9a4` |
| `src/scripts/motion.ts`    | `9b1ccd51c08b0ed17b491d6feb3844cda54b7d46d85f5e2476865141e75c0257` |
| `dist/index.html`          | `1f34a9b978a115023e68d08312676bb490796f47c228f1ff403d33018d6ea2b3` |

The approved local workflow applies. This is a narrow independent rendered review, not a full-site numeric regrade or physical iPhone certification. Opening, closing, touch behavior, accessibility, material budgets and publication remain owned by the implementer's relevant regression and release evidence.
