# Independent review of paper depth and opening

Verdict: **accept the v4 paper/depth candidate within the inspected local scope**. Acceptance follows two rejected material/geometry conditions: repeated pale mottling and a nearly planar held overview. The final surface is quiet, fibrous matte stock; the overview now has a visible Z silhouette and distinct planes. Cold and reverse sequences preserve connected thin edges without a visible face flash. This is not physical iPhone smoothness certification.

Reviewed September 27, 2026. The reviewer is independent of the renderer/material implementation and changes no application or regression-test code. The basis is the original approved Telescope, Igloo, Exat and Stripe Press direction, the current design contract, the local workflow and the paper-material research. No previous aesthetic grades are reused.

## Findings

**PD-01 — repeated mottling, rejected and corrected.** The initial material capture has conspicuous repeated pale blobs, particularly on the rust face. They look patterned or stained rather than like matte stock. The rejected profiler capture remains at `qa-artifacts/paper-rendering/candidate/captures/chromium-680.png`. V3 reduces formation contrast while keeping short irregular fibers. In fresh CSS-scale cream and rust reading captures, the blobs are gone, the surface is perceptibly fibrous, and the ink remains dominant. Do not add more grain to solve a geometric depth problem.

**PD-02 — weak held Z silhouette, rejected in v3 and resolved in v4.** At 390×844, `review/candidate/phone/forward-01-arrival-css.png` shows all three panels, but the outer outline and similar projected plane widths make the overview look nearly planar. The folds are more obvious during the middle of the unfold than at its final resting pose. The new surface does not by itself satisfy the complete depth brief. Test a small final overview-camera change: retain the 38-degree hinges and reading poses, but increase pitch from 10 degrees toward 20–22 degrees and reduce the negative yaw from −24 degrees toward −6 degrees. Blend neighboring opening views so the reveal remains continuous. This should distinguish the opposing planes, top/bottom fold silhouette and diffuse-light response. Those values were a hypothesis requiring a new render, not automatic acceptance. The v4 recheck below establishes the disposition.

**PD-03 — opening and reverse ink, no new visible defect found in v3.** Fresh cold recordings progress from the packet through edge-on wings to the complete three-panel spread. The inspected raw first-four-second sequences retain connected edges, natural self-occlusion and the whole object inside the frame. No blank front-face flash, mirrored reading face or lingering dark grazing-angle bar was found after removal of the decorative back-ink fade. Reverse travel and crease transfers remain coherent. This is a visual judgment within the recorded local scope; rendering cost and callback cadence are assessed separately by the isolated profiler. The physical iPhone complaint must not be declared impossible or fully certified from emulation.

**PD-04 — apparent Cash flow softness, no confirmed new blur defect.** Native DPR 3 current and measured-motion baseline Cash flow PNGs show the same glyph forms and apparent edge softness. The new matte illumination modestly darkens white ink; it does not introduce a confirmed blur/filter regression. CSS-scale downsampling alone is insufficient evidence of a new typography defect. The full-resolution originals are retained.

## V3 method and evidence

Four fresh headed Chromium contexts used 1440×1000 at DPR 1, and 390×844, 320×568 and 390×664 at DPR 3 with mobile/touch emulation. Capture ran alone after the profiler and regression auditor explicitly released the browser lane. Desktop used a one-pixel wheel gesture and phones used a 35px native CDP touch drag. Every size completed the entire forward and reverse journey, an interrupted departure back to Cash flow, and a normal-reading escape.

All 54 arrivals held their native position and camera transform during a further 300ms observation. All 648 measured primary text-line rectangles were inside the actual header/control safe area, with no page error. All four interrupted departures returned to the exact Cash flow pose. Each ordinary-reading check subsequently moved the document by 35px. The folded destination intentionally uses the caption “Scroll to unfold” and the Overview chapter at native position 0; it is not a missing scene.

The reviewer inspected original DPR screenshots, separate CSS-scale screenshots, raw video frame sequences from the actual beginning of each recording, and crease-transfer sequences. Estimated video-offset contact sheets are useful only for locating content; raw-from-start sequences are the evidence for the cold opening. No FPS, physical-device or whole-site numerical grade is inferred from this review recording.

| V3 file                  | SHA-256                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`  | `8a17248be6fdcf02b9ead80012665921798e2d2b5c1f1bed5a7e38a4597f0bc6` |
| `src/styles/global.css`  | `92ea2a3477bbf3a769a17ff304b25973520afd46dbf8b4a16e817e41618b0a4c` |
| `src/pages/index.astro`  | `36af4b740a3b483c0acfb2e3a698cad783dc8a1e4b5d7a7cff64f8f7ef0d3f50` |
| `public/paper-grain.svg` | `db5cc6197e90a427b102935630b6f57075e980a198ae908b7b3b1516f5f1a620` |
| `dist/index.html`        | `115c3a0559f4bae9c0ca5df44664bcfa7169a4f76641a642437f0b6b24096b15` |

All hashes remained identical before and after capture. Ignored evidence is under `qa-artifacts/paper-rendering/review/`: the capture and extraction scripts, their successful logs, full videos, original and CSS-scale endpoint PNGs, per-frame transforms, measured line bounds and raw cold contact sheets. The prior baseline remains under `qa-artifacts/measured-motion/review/`. The calmer texture is not a photographic scan or a physical paper simulation; it is a restrained CSS material approximation.

## V4 correction and independent recheck

The owner changed only the final three opening camera views, ending at yaw −6 degrees and pitch 22 degrees while retaining the 38-degree hinges, reading poses, timing and material. Four new fresh contexts repeated the cold unfold, full overview, cover approach, reverse to overview and reverse into the packet. This is a bounded current recheck of the changed opening geometry; it does not re-label all v3 journey captures as v4 captures.

The current held view resolves PD-02. Both the top and bottom outlines visibly change slope at each hinge, including at 320×568. The rust center now faces differently from the cream wings, and directional light reinforces that difference. The object is legible as folded stock rather than one flat diagonal rectangle. All three panels remain inside the frame before the camera approaches the cover. The return follows the same connected geometry without an extra corrective pop or a disconnected edge.

The physical treatment remains restrained: fibers are apparent at CSS reading scale, crease light distinguishes recess from ridge, exposed cut edges remain thin, and the ground shadow supports the folded form. The surface does not have the rejected pale spots, an obvious repeating stain, a glossy streak, an inflated card bevel or floating decorative illumination. Exact front-facing reading views remain intentionally quiet and flat enough for stable text; motion and overview provide the spatial evidence. This is a convincing matte-paper approximation within the existing renderer, not a claim of photographic or physically simulated paper.

All 16 v4 arrivals held their exact native position and camera transform during the additional observation. All 30 measured primary cover text-line rectangles remained inside the safe area; there were no page errors. Both directions returned to the exact overview and folded positions on all four viewports. Current cold and reverse raw-video sequences showed no blank-face flash, lingering grazing-angle ink bar or visible material pop. No remaining P0–P2 visual material/opening finding was identified within this rendered scope.

| V4 file                  | SHA-256                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`  | `2c6c35f85bff889228d7d47e1d9df049698b262915815ca09f00c3cab26698b0` |
| `public/paper-grain.svg` | `db5cc6197e90a427b102935630b6f57075e980a198ae908b7b3b1516f5f1a620` |
| `dist/index.html`        | `f535e8d92e6da628817a099d53c842e62f06be6095b63f4cb736c97aaad463ed` |

All before/after hashes matched. CSS, markup and the path interpolation module retained their v3 hashes. Evidence is in `qa-artifacts/paper-rendering/review/depth-final/`, including four original videos, full-resolution and CSS-scale stills, `cold-raw-0.png`, `cold-raw-1.png`, `reverse-raw.png` and `results.json`. Black unused cells at the end of a tiled reverse contact sheet are extraction padding, not application frames.

Capture commands completed with exit 0:

- `node qa-artifacts/paper-rendering/review/capture.mjs candidate`
- `node qa-artifacts/paper-rendering/review/extract.mjs`
- `node qa-artifacts/paper-rendering/review/capture.mjs depth-final`

Raw-from-start and reverse frame extraction also completed with exit 0. All reviewer browser contexts and extraction processes were closed before the next audit/profile lane began. No application or test edits were made by the reviewer.

## Final disposition

The visual correction is accepted within this evidence. Isolated rendering profiles, surface-budget checks, compatibility tests and hosted release verification remain the owner's separate gates. Physical iPhone Safari, actual mobile address-bar behavior, GPU memory and field performance remain outside this review's evidence. The user's eventual playback report remains decisive for the original device-specific complaint.
