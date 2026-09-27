# Fold-opening correction: independent motion review

Reviewed 27 September 2026. Scope is the opening sequence only: a genuinely folded starting object, visible accordion unfolding, then the approach to the first reading composition. Later hinge orbits, proposal terms, resume and public profile are outside this correction.

## User intent and acceptance

The user clarified that the trifold must still unfold at the very beginning; the entire three-panel object should remain in view during that unfolding. A compact Z-fold naturally occludes some printed faces while closed. Requiring all three printed faces to be visible at time zero would force an already-open starting pose, repeating the previous mistake. Instead, the review requires a physically folded initial packet, a substantial change at both creases while the whole silhouette remains framed, and a distinct subsequent approach to the cover.

The accepted Handrail identity, native scrolling, reversible path, complete reading groups and existing phone resource budgets remain constraints. The existing [research basis](design-research-round-3.md) supports purposeful and interruptible motion. This bounded review adds no rendering library or decorative motion requirement.

## Before evidence

Independent headed Chromium captures at 1440 × 1000 and 390 × 844 are stored locally under `qa-artifacts/fold-opening/reviewer/` as `before-*.png`, with actual wheel input and transforms in `before.json`. The fresh opening already shows a broad three-panel spread. The camera then approaches the cover while the comparatively small remaining fold change occurs, and the other panels leave the viewport. This confirms that the prior revision solved silhouette visibility at the expense of the intended opening action.

## Candidate decision: accepted

The corrected production build was independently captured in headed Chromium at 1440 × 1000, 390 × 844, 320 × 740 and 390 × 664. There are no unresolved release-blocking opening findings in the inspected candidate. No application or test changes were made by this reviewer.

The new starting packet has both wings at 146 degrees. It visibly opens through seven whole-object camera fits to 38 degrees before focus transfers to the cover. This restores a substantial 108-degree unfold at each crease. The camera keeps the object's free edges inside the stage throughout the inspected unfolding, and only approaches the cover after the spread has opened.

### F1 — Folded start and visible opening: closed

Fresh captures show a compact folded packet with layered edges rather than an already-open spread. During forward input the wings visibly rotate around their connected creases; their brief edge-on and back-to-front transitions are consistent with the physical fold. The rust center remains a useful spatial anchor. The completed spread clearly exposes all three panels and both creases before the reading approach. There is no observed detached edge, mirrored reading arrival, persistent missing face or blank flash in the inspected headed sequence.

### F2 — Whole-object framing and phone scale: closed

Nine sampled forward unfolding states per viewport, before either wing reaches its final 38-degree position, keep the union of all three panel bounds within the viewport and between the actual header and controls. Visual inspection of the intervening captures confirms the composition, rather than relying only on those rectangles.

Near the completed spread, the projected width is about 1,060px at 1440px desktop, 282px at 390px phone, and 226px at 320px phone: approximately 71–74% of viewport width. This is a substantial overview of the wide object. The temporary vertical whitespace on a tall phone is appropriate to showing the entire spread. Requiring one panel to fill 55% of the stage's height during this beat would force the other panels out of view and repeat the user's original complaint. Whole-object visibility and minimum width belong to the opening check; full text-group readability belongs to the subsequent reading check.

The cover's first reading arrival preserves its complete headline, collected-revenue message and partnership statement at all four sizes. Header navigation and controls remain visible. Cropping begins during the deliberate post-unfold approach, rather than while the paper is still opening.

### F3 — Reverse input and settling: closed

Actual wheel input traverses the opening forward and backward. Reverse arrival returns to the exact initial 146-degree packet at all four sizes. Reversing before idle settling visibly starts folding back and completes toward the user's last direction, without a stuck pose or involuntary forward jump in these sessions.

A separate 390 × 844 forward-pause capture begins unfolding, then lets the existing settling behavior finish. It settles on the fully opened overview at native scroll 680px with both wings at 38 degrees, before the cover zoom. Thus a short first gesture can reveal the complete object without immediately losing a wing offscreen.

## Candidate evidence

Ignored local evidence is under `qa-artifacts/fold-opening/reviewer/`:

- `capture-candidate.mjs` and `candidate-1/capture.json`: 32 independently captured frames per viewport, 128 total, including fresh start, navigation landing, continuous small wheel steps, reverse traversal, arrival and reversal before settling. All four sessions reported zero page errors.
- `candidate-1/*-contact.jpg`: forward sequence and representative reverse frames at each viewport. These are contact sheets of actual screenshots, not rendered mockups.
- `candidate-1/videos/`: continuous headed browser recordings from those four sessions.
- `pause.mjs`, `candidate-1/pause.json` and `candidate-1/phone-forward-pause.png`: the completed unfolding overview after a short forward gesture and pause.

The reviewer inspected the original frames and sequence contact sheets. Captures support the scoped visual acceptance, not a numerical frame-rate guarantee.

## Limits

Device emulation and desktop Chromium do not establish physical iPhone stability. Reading-path regression, resource measurements and hosted publication remain the integration owner’s verification responsibilities. Headed capture is required because earlier headless captures exhibited a CSS3D paint anomaly absent from the identical headed pose.
