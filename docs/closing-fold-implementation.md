# Closing the proposal

Status: published and verified. Candidate v4 passed independent rendered review and final local/hosted checks; all earlier failures remain recorded below.

## Requested addition

After “Grow together,” one final scroll gesture pulls back from the print, follows the accordion folding into a packet, and settles on a real exterior face reading “Let’s do this!” with the official Handrail watermark underneath. Existing proposal copy, opening, magnetic input, reading poses and material remain the foundation.

The finale is a semantic final section and concrete tour stop, with its own fragment and reading-mode position. Mount it on the existing right back face; fold through flat into a negative accordion so that face becomes the visible exterior. Never simulate it with a screen overlay, swapped print, z-index override or separate animation owner. Keep the watermark static in the existing painted paper surface and maintain the inclusive 64 MiB/4096-pixel material budget.

## Plan and acceptance

1. Add canonical closing copy, same-document semantic section and optional back-face mounting. Extend the existing camera path with a fitted pullback, linked folding/orbit and readable final hold.
2. Use a deliberate closing duration only for the added scene. Preserve existing scene timing and first-opening curves. Negative hinges reverse concave/convex crease illumination without repainting faces.
3. Independently test the terminal anchor, native short gestures, interrupted reversal, reading/reduced/no-JS paths, resizing, fragment/history restoration and complete closing ink/watermark visibility. Update only existing expectations that intentionally gain a final chapter.
4. An independent reviewer inspects actual desktop and mobile captures, including the short/narrow phone. Challenge pacing, self-occlusion, edge connections, legibility and watermark spacing. Require current rendered acceptance before publication.
5. Run relevant type, unit, format, content and browser checks; preserve cold paper-paint regressions and the expanded material budget. Publish and verify actual hosted files and focused live interactions.

Large captures and test logs remain under ignored `qa-artifacts/closing-fold/`. Physical iPhone performance and full global/cloud certification remain unverified. The existing approved local workflow applies; no new external service or credential is required.

## Implementation and corrections

The invitation is canonical flyer copy and a normal semantic section. Tour mounting places that same node on the existing right reverse; the camera-independent transcript and ordinary-reading restoration retain it. The existing path pulls back, crosses flat, folds both hinges toward −174°, and finishes at yaw −6°/pitch 5°. The camera holds its safe sweep scale before approaching the compact packet. Adjacent closing travel lasts about 2.8 seconds and reverses through the same path; the opening and prior reading timings remain.

The first 13-case candidate run passed four cases and failed nine. Those failures exposed two application details: pitch 6° fell just outside the existing facing threshold, and fractional scroll range could leave a phone's terminal fold fractionally incomplete. Pitch now settles at 5°, and integer native-scroll range represents the exact final path endpoint. Tests retain their orientation and exact-arrival thresholds. Two fixture corrections were also necessary: validate the two display-span strings plus accessible heading label, and start the native touch outside the proposal-notes link, whose native interaction is deliberately protected. The baseline missing-section failure and all initial candidate failures remain in ignored evidence.

The corrected 13-case run passes: real reverse mounting, 2.782–2.804 second closure, complete intermediate folded-object bounds at four sizes, final text/watermark framing, terminal hold, forward/reverse gestures, interrupted reversal, height refitting, reading round trip, fragment/history and three reading fallbacks. The newly exposed printed back paints once. The separately passing DPR3 surface check explicitly includes any promoted closing watermark: zero independent watermark backings were observed, and the inclusive estimate remains 63.8768 MiB with a 3177-device-pixel maximum edge. Surface estimates are not measured GPU memory.

Candidate v2 main HTML: `6f32b96137f03838f75a8aa176f49261a3edcc1daa36fa69ea9950e5daf54b91`. Its 28-file manifest is frozen under ignored evidence; 24 files, including both PDFs, remain byte-identical to the prior release.

## Independent review correction

The independent reviewer rejected v2 despite passing complete-text bounds. At the exact desktop partnership reading angle, the back of a thin bottom-edge quad painted an opaque cream polygon over the printed text. Controlled screenshots established causality: hiding the edges removed it; hiding lights, printed backs or the closing section did not. Correct outward-only edge rendering with `backface-visibility: hidden` restored the same camera composition. No camera offset, face overlay or changed reading typography conceals the problem. A new screenshot-based paragraph-ink regression fails v2 with zero visible ink, preserving that failure as evidence.

The initial compatibility run passed 106/118. Two full out-and-back journeys exceeded their former 30-second test budget after adding the 2.8-second close in each direction; they now receive a scoped 45-second budget while preserving per-scene limits. Six older pause tests assumed over 40 native-scroll pixels by 120ms; both representative directions also fail the immutable previously accepted release at 24px. The fixture preserves over 40px and uses the existing 200ms response deadline before the unchanged 1.8-second no-backslide observation. Three narrative fixtures now place the notes link within the partnership section before the new invitation. The remaining phone reading-bottom failure was real: a fully visible short final section could lose to the taller preceding section. Reading recovery now recognizes that fully visible final section at the document end.

Candidate v3 main HTML: `f0da3afb17a9d4180a99c58429d7d6c923918f98634f3d9b22ad645d9984c192`. Outward-only edges restored the primary paragraph, but the reviewer found the adjacent center rust surface still clipped. The expanded pixel regression confirms this: body ink passes at 12.039%, while the center patch contains zero rust instead of the required majority. Both rejections and their evidence remain preserved.

Further controlled ablations isolated intersecting printed planes: removing all edges, backs, lighting and shadows did not restore the center; hiding or flattening the left front did, even though a transparent left front still clipped it. The ±1-unit front/back offsets overlap neighboring print about 0.344 paper units beyond the 38° crease. Half-depth still failed. Sharing each leaf's fold midsurface restored both visible panels and retained the closing reverse; inset faces also worked but unnecessarily rescaled print. V4 therefore uses two-sided, backface-culled print at z=0 with the separate outward-facing stock edges and existing hinge hierarchy retained. Camera focus matches the same midsurface. This changes the unstable geometry rather than hiding it with a camera offset. The fresh rendered review and targeted rechecks below validate this correction.

## Final candidate identity and static checks

Candidate v4 main HTML is `aca0ea5656b652b603c76395f917484f43820372586bf31fc8772d1644b7bc70`; the full 28-file manifest remains frozen in ignored evidence. Both PDF files, the official logo and deterministic paper grain remain unchanged. Typecheck reports 51 files with zero issues; all 34 unit tests pass. Formatting, three-route build, canonical Markdown, texture reproducibility, both complete PDF content checks and diff whitespace checks pass. A scoped scan of the 16 changed public files found no private company figures, client identifier, local machine path or credential pattern.

The independent source audit accepts consistent midsurface camera geometry, outward cut-edge normals, single-owner closing navigation and complete semantic/read/history behavior. This source result does not substitute for current rendered inspection or browser regressions.

The final independent rendered review accepts v4 at 1440×1000, 390×844, 320×568 and 390×664. All five desktop reading holds retain visible primary ink and the adjacent center rust. The reviewer finds connected thin stock edges, coherent forward/reverse closure and complete phrase/watermark framing with no remaining material finding. Eight terminal holds, four complete reversals and four interrupted reversals remain exact; all 130 measured primary text lines are safe. Current broad numerical design grades are not inferred from this bounded review.

## Final local browser verification

The current v4 runs pass without retries: 14 closing cases, 21 affected compatibility cases, 17 isolated opening/rendering cases, 22 supplementary WebKit cases and one inclusive DPR3 material-budget case. The pixel regression records 12.039% paragraph ink and 100% rust in the adjoining center patch, both before and after closing. The exposed closing back paints once. The original 106/118 compatibility result and all rejected-candidate failures remain historical evidence; these targeted current passes do not relabel that earlier run.

## Publication

Source `4443b6b38a8377f9a62a846a4c1411d9714ab1c0`; static `1c2c9816f93920b2cc266c1ce9913180c18b4c3b`. [GitHub Pages run](https://github.com/brentthomas248/handrail-proposal/actions/runs/36368465198) succeeded. All 28 hosted files match the frozen reviewed candidate byte for byte; all 14 hosted closing checks pass without retries. Both PDFs remain unchanged. Physical iPhone playback, manual assistive-technology review and actual GPU memory remain unverified.
