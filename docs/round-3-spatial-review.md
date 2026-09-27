# Round three: independent spatial-motion and material review

Reviewed 27 September 2026 against the local candidate at `http://127.0.0.1:4321/handrail-proposal/`. The initial independent review made no application, test, build or publication changes. At the integration owner’s subsequent request, this reviewer implemented only the bounded shadow refinement documented in S5; that addition requires the integration owner’s separate visual review. Scope is the proposal's opening, hinged camera travel, material and reading arrivals; the resume and public profile are covered by other specialists.

## Decision

Accept the bounded motion and material revision. The initial view now unmistakably presents three joined panels and two alternating creases. Wheel-driven travel visibly changes viewpoint around those creases and returns to correctly oriented reading faces. No confirmed release-blocking motion or material defect remains in the inspected candidate. A headless rendering anomaly was investigated and rejected as grounds for changing the application after the identical pose rendered correctly in headed Chromium.

This is a design acceptance of the inspected browser candidate, not physical iPhone, Safari, accessibility, performance or publication certification. Final regression and interaction evidence still belong to the integration owner.

## Research and reference basis

The reviewer independently loaded the rendered [Apple Human Interface Guidelines for Motion](https://developer.apple.com/design/human-interface-guidelines/motion). The applicable principles are purposeful motion, consistency with a person's gesture, an optional alternative and cancellation without waiting for an animation to finish. These principles support a scroll-controlled paper object with stable reading destinations; they do not justify adding an orbit to every change of paragraph. The visionOS-specific guidance is not treated as a web requirement.

The accepted local captures of Stripe Press, Telescope, Exat, Igloo and Handrail were also inspected. Stripe Press supplies the physical-object silhouette and quiet reading contrast; Igloo supplies continuous object geometry as viewpoint changes; Telescope supplies changes in composition and scale that follow content; Exat and Handrail inform strong typography, restrained color and editorial structure. These are design references, not blanket claims of conformance or copied implementations.

## Actual browser evidence

Independent scripts and raw captures remain ignored under `qa-artifacts/round-3/spatial/`:

- `capture.mjs` and `capture.json`: 135 frames at 1440 × 1000, 390 × 844, 320 × 740 and 390 × 664. Fresh openings, every chapter destination, small wheel increments, first-crease forward/reverse travel, pause and a reversing input during an idle settle. Four continuous browser recordings are in `videos/`. The four sessions reported no page errors.
- `crossings.mjs` and `crossings.json`: the center-to-right hinge and the two-hinge return from the window to the closing, with intermediate frames and reverse traversal at all four sizes.
- `crossings-headed.mjs`, `headed-crossings.json`, and `headed-desktop-*.png`: a second independent desktop pass in headed Chromium to resolve the headless paint anomaly described below. `crossings-phone-headed.mjs`, `headed-phone-crossings.json` and the headed phone/small/short images repeat both later crossings at all three phone sizes; those complete paper faces also render correctly.
- `clipping-check.mjs`, `clip-state.json`, `clip-mid-original.png`, `clipping-headed.mjs`, `clip-headed-state.json`, and `clip-headed.png`: matched-pose evidence separating a screenshot/rendering-mode artifact from actual panel geometry.
- `apple-motion.txt`: the rendered primary-source research text. Plain web extraction returned a JavaScript shell; browser rendering supplied the usable source.

The initial and reading images alone were not used to approve motion. The reviewer inspected intermediate frames from both directions, including the later two-fold return, and used actual wheel input and navigation. These captures do not establish a measured frame-rate guarantee.

## Findings and dispositions

### S1 — The previously hidden trifold is now established clearly: closed

In all four `*-opening.png` frames, the cream left wing, rust middle and cream right wing form one visible Z-fold. Both shared creases are visible; the first frame is not an edge-on wing or a cropped cover. The full silhouette stays inside the stage. Phone openings appropriately establish the object rather than trying to make every term readable at overview scale.

`*-open-wheel-4.png` through `*-open-wheel-12.png` then approach the cover while the viewpoint and folds change. The opening no longer depends on a reader inferring that a flat page is a folded object.

Acceptance condition met: three visually distinguishable joined panels and two alternating crease directions before the first reading arrival, without clipping the overview on small or short phones.

### S2 — Camera travel now expresses the hinges: closed

The first crossing in `*-hinge-forward-3/5/7/9.png` changes the relative apparent width and angle of the departing cover and arriving cash face around their shared crease. This is a visible orbit, not simply translation of an almost flat spread. The center-to-right crossing and headed desktop return frames show the same physical continuity around the appropriate crease. The two phone rate groups share a panel, so their local movement should remain a reading move rather than acquire an arbitrary extra fold animation.

Reverse samples retrace the same object relationship. No mirrored arrival, detached edge in headed rendering, back-face flash, unexpected full spin or repeated retreat to a distant overview was observed. Pausing and reversing did not create a persistent stuck pose in these sessions. Exact input and timing guarantees remain covered by the deterministic motion tests.

Acceptance condition met: visible change in orientation at real crease crossings, consistent connected geometry, and correctly facing readable destinations.

### S3 — Complete reading groups and restrained material: accepted

Reviewed phone arrivals retain the whole cash comparison, both rate explanations, and the full closing within the header/control stage. The new prominent navigation does not cover the primary copy in these captures. The short phone cash scene retains the assumptions and before-costs qualification. Intermediate travel intentionally crops parts of departing and arriving print; those are transitional compositions, not primary reading stops.

The matte face treatment remains quiet at normal reading distance. Fine grain is visible in closer headed captures, crease shading changes with orientation, and the object has thin edges rather than a glossy card or large shadow halo. There is no need to increase texture contrast, add a new renderer or add decorative effects to demonstrate the fold.

### S4 — Apparent missing center paint in headless capture: evidence limitation, no application fix

At 1440 × 1000, click **The window**, then wheel approximately halfway toward **Grow together**. At native scroll around 4664px, `clip-mid-original.png` shows the rust paint ending near y160 even though the cash face's measured bottom is near y550. Hit-testing at (700,350) still identifies the cash face. Similar missing paint can appear in later headless phone transition captures.

The identical camera pose, panel heights and scroll in headed Chromium render the complete rust face and correctly joined bottom edges (`clip-headed.png`). Fresh headed forward and reverse crossing frames also preserve the center panel. Therefore the headless screenshot alone is not a valid product defect. Runtime experiments with a center-layer transform, a tiny face rotation, paint containment and stage overflow did not repair headless output and are not recommended app changes.

Required disposition: preserve the headed comparison and document the limitation. Do not count the deficient headless image as proof of disconnected geometry; do not hide it or claim headless captures alone certify the material renderer.

### S5 — Overview shadow could be quieter: P3 refinement implemented after review

The overview's faint projected shadow contains a narrow vertical smear below the middle crease, particularly visible in `phone-opening.png` and `short-opening.png`. It is not a content or geometry failure and does not block acceptance. Against the Stripe Press reference's restrained grounding, the shape reads slightly more like a projection effect than a soft contact cue.

After the independent review, the integration owner requested this optional refinement. The reviewer changed only the shadow ellipse projection block in `src/scripts/motion.ts`. A smooth weight applies only to elongated projected pads: no adjustment through a height/width radius ratio of 3, gradually reaching full diffusion at 7. At full diffusion, the ellipse is wider, 35% shorter and 45% lower in opacity. The broad center shadow, camera, face material, geometry and layer count are unchanged. These ratios are authored visual choices, not industry-standard thresholds.

Fresh headed comparisons are `shadow-before-desktop/phone/small/short.png` and `shadow-after-desktop/phone/small/short.png`, with projection values in the matching JSON files. The same camera transform is byte-identical before and after at all four sizes. Visual comparison finds a quieter, shorter shadow under the crease while the broad footprint still grounds the trifold. The change is retained for the integration owner’s independent visual decision. `pnpm exec prettier --check src/scripts/motion.ts` passed; the integration owner owns build and regression checks. No filters or new composited surfaces were added.

## Remaining limits

The reviewer did not test a physical iPhone, manual assistive technology, field performance or the final hosted release. The public profile and resume were outside this packet. Any further camera, paper-size or navigation-height change needs a focused fresh check of the affected framing; this acceptance does not automatically transfer to a materially different build.
