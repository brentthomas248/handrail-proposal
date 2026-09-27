# Fold-out opening correction

## User intent

The user still wants the initial folded-to-open animation. The previous revision began already partly open to show three panels, which removed too much of that reveal. The correction keeps the whole object in view while its two hinges open, then approaches the cover.

## Scope and acceptance

This is one opening-camera change in `src/scripts/motion.ts`, with a browser regression and independent rendered review. Preserve later hinge orbits, reading poses, navigation, resume, commercial copy and the existing renderer budget. No dependency or material-system change is needed.

Start with substantially folded wings, unfold through a sequence of whole-object camera fits, establish the opened three-panel spread, then move toward the first reading group. Test desktop, standard phone, small phone and short phone with native forward/reverse wheel input. All panel extents must stay inside the actual header/control stage throughout the unfolding; complete later reading groups retain their existing bounds. Independent headed captures must establish that the movement visibly reads as a physical unfold, rather than merely zooming an already-open sheet.

## Verification plan

Establish that the new regression fails against the previous published opener and passes against the candidate. Run type/unit/build and the focused opening tests, followed by the existing browser suite and WebKit geometry checks. The independent critic captures actual intermediate states and reversals. After acceptance, publish through the existing GitHub Pages workflow and verify hosted bytes and opening behavior. The approved local workflow remains in force; physical iPhone verification is not inferred.

## Progress

Implemented seven whole-object opening views: both wings rotate from 146° to 38° before the camera approaches the unchanged first reading pose. Each fit accounts for the outer edges. The accepted crease orbits, copy, materials, resume and renderer limits are unchanged.

The new four-viewport regression fails on the published 74° opener and passes on this candidate. Both wings unfold 108°; 1,074 recorded forward/reverse frames in the focused run have no clipped panels. The existing substantial-paper assertion was corrected to measure the complete silhouette: its old requirement for one face to fill 55% of the phone stage height conflicts with fitting a landscape spread. The replacement retains minimum size in both axes and requires substantial width or height. Complete reading-group text and size checks remain unchanged.

All 68 Chromium checks passed in 1.2 minutes, with zero failures/skips/retries. All 27 unit checks, type checks, build and formatting passed. Supplementary WebKit verified 29 reading positions across five viewport sizes with no browser errors or failed requests; five known font-preload warnings remain. Independent headed opening/reversal review passed all four sizes; see [review](fold-opening-independent-review.md). Root inspected the original desktop and phone frames as well.

Published from source `33f64ef` as static `4b11b12`. Pages run 36325370312 succeeded. All 68 hosted browser checks passed in 1.2 minutes; all 28 hosted files match the reviewed build byte for byte. The task-owned publishing worktree was removed after the clean/pushed/no-process checks. Physical iPhone stability remains unverified.
