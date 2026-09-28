# Independent review of the closing fold

Verdict: **accept candidate v4 within the inspected local scope**. The actual flyer folds into a compact packet with the requested phrase and quiet official watermark. Acceptance follows rejection of v2 and an incomplete v3 correction for a real desktop occlusion defect. V4 restores both primary and adjoining printed surfaces without changing the reading camera or sacrificing the connected paper treatment. Physical iPhone playback remains unverified.

## Scope and basis

The existing proposal was accepted by the user. This pass adds only a final return to the actual reverse of the flyer, an accordion fold into a compact packet, and the line **Let’s do this!** with the official Handrail watermark below it. The approved Telescope, Igloo, Exat and Stripe Press references remain the basis for camera continuity, typographic intent and convincing printed-object treatment. Handrail's existing cream/rust/ink identity and exact wordmark remain the brand authority.

The reviewer is independent of application and regression-test implementation. The review follows the approved local workflow, with actual interaction, screenshots and video. It does not claim physical iPhone playback, field rendering performance or global credentialed-service certification.

## Adversarial acceptance criteria

- The closure belongs to the same continuous paper object. Opposite hinge relationships remain physically legible; no detached edge, teleport, interpenetration, blank-face flash, mirrored ink or corrective camera pop is acceptable.
- The camera makes the return to the reverse understandable, frames the complete folded packet, and ends at a firm hold. A short gesture should commit immediately while preserving the accepted deliberate travel duration. Reversing during or after closure must return coherently to the preceding reading group.
- The final phrase and watermark are clearly readable in their entirety between the actual header and controls at desktop, standard phone, narrow/short phone and short phone sizes. The watermark is below the phrase and reads as restrained printed identity rather than a floating interface logo or large advertisement.
- The packet retains matte stock, fine fibers, connected thin edges, coherent crease light and a believable shadow. Grain cannot be intensified to camouflage weak geometry; folding paper cannot become a thick glossy card.
- The previous “Grow together” reading composition remains complete and quiet before departure. The addition must not obscure proposed terms, add unrequested financial promises, or imply a signed agreement.
- Ordinary and reduced-motion reading retain the closing phrase in natural document order. Decorative reverse faces do not become the only accessible source of essential content.

## Evidence and findings

Four fresh Chromium contexts ran sequentially and alone at 1440×1000 at DPR 1, and 390×844, 320×568 and 390×664 at DPR 3. Desktop used a one-pixel wheel gesture; phones used a native 35px touch drag. Each captured the preceding “Grow together” hold, closure, held packet, full reverse, interrupted departure/reversal and ordinary-reading escape. All eight measured arrivals stayed at the exact position and transform for a further 350ms. All four full reversals and all four interrupted reversals returned to the exact preceding pose. All 56 primary text-line rectangles fit the nominal header/control safe region and no page error occurred. Those bounds failed to detect CF-01.

**CF-01 — desktop reading occlusion, rejected in v2 and resolved in v4.** At 1440×1000 and DPR 1, a large opaque cream plane covers nearly all of “Grow together” from approximately y=160 to y=690. Only the top of the heading remains visible. It occurs before the closing face is first exposed, and after both complete and interrupted reversals. It is present in original screenshots and the recorded video, so it is not contact-sheet padding. The front-facing approach is readable until the exact held pose. Nominal text rectangles and computed face visibility remain insufficient evidence: the ink is occluded despite correct layout. Investigate physical edge/back-face compositing at the exact yaw −38° / hinge +38° reading orientation before changing typography or camera framing. The reviewer did not edit application code. Evidence: `candidate-v2/desktop/00-grow-css.png`, `reverse-arrival-css.png`, `interrupt-return-css.png` and `sequence-02.png` under the review evidence directory.

**CF-02 — closing object and printed message, accepted visual treatment within the rejected candidate.** All four final views show a complete folded packet, the requested two-line phrase, and the unchanged official wordmark below it. The watermark is faint and subordinate; the phrase stays clearly readable at 320×568. The paper retains quiet fibers, a thin connected stock edge and restrained dimensional light. Forward contact sequences show the three-panel object retreat, pass through its open position, turn through the edge-on wings and gather into the packet. The rust interior sliver progressively narrows as the printed reverse turns toward the reader. No substituted floating sign, mirrored closing text, detached hinge, large material flash, glossy bevel or new mottled grain was found. Reverse motion follows the same connected object. This visual finding does not waive CF-01.

**CF-03 — ordinary reading, inspected.** The final phrase and watermark appear naturally after the partnership section and before the footer on all four screenshots. Existing copy remains unchanged. The source's semantic finale is mounted on `.panel-back.closing-back` during the tour; it returns to ordinary document flow on reading escape. Reduced motion, no-JavaScript and assistive-technology behavior remain the independent test owner's additional evidence.

The reviewer inspected all four complete closure/reverse contact sequences, interruption/reversal sequences, original and CSS-scale endpoints, and full-resolution phone frames around the edge-on crossing. Video screenshots are visual evidence, not a physical-device frame-rate measurement. No broad numerical design grade is assigned to this bounded addition.

### Candidate v2 identity

| File                      | SHA-256                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`   | `cf665f01fa7b360b7412714fb7996cc6c1d00e7350aa125b926fa5a61d931929` |
| `src/styles/global.css`   | `534ffe2c660854d838d15e7b8ceea78fca04c9b7a407a3c45d667fb55e9e2bcc` |
| `src/pages/index.astro`   | `92aa5e0382ebfe3176a0153e6d0034baf4024305b1ae74dc503115928b01e1f4` |
| `src/content/proposal.ts` | `6a174813a211309e0eefd9ffd32e9962736ffc64b05ff583097acac041804173` |
| `public/paper-grain.svg`  | `db5cc6197e90a427b102935630b6f57075e980a198ae908b7b3b1516f5f1a620` |
| `dist/index.html`         | `6f32b96137f03838f75a8aa176f49261a3edcc1daa36fa69ea9950e5daf54b91` |

All before/after source and built-HTML hashes matched. Capture and extraction completed with exit 0:

- `node qa-artifacts/closing-fold/review/capture.mjs candidate-v2`
- `node qa-artifacts/closing-fold/review/extract.mjs candidate-v2`

Ignored evidence is under `qa-artifacts/closing-fold/review/`, including full videos, endpoint PNGs, frame sequences, per-frame transforms and `candidate-v2/results.json`. Browser contexts were closed before compatibility tests began. Offline extraction paused during the test owner's isolated opening run. A corrected current render must resolve CF-01 before publication.

## V3 edge-culling recheck

The owner identified the bottom stock edge through isolated layer toggles and added CSS backface culling to stock edges. A fresh four-size capture additionally inspected every desktop reading chapter. Primary copy is now visible in all five desktop reading holds. However, the exact “Grow together” pose still shows the same opaque beige artifact over the adjacent rust center panel from approximately x=1185 onward, y=160–690. The previous paper-depth reference retains continuous rust and its peripheral ink there. This is a partial correction of CF-01, not final acceptance: the physical paper still visibly loses a portion of its printed center face. Evidence is `candidate-v3/desktop/reading-05-css.png` and the same phase's `00-grow-css.png` under the review evidence directory. The owner subsequently isolated the remaining intersecting printed planes; no reviewer application edit was made.

## V4 correction and final independent review

The owner replaced the opposing offset printed planes with one two-sided print plane at the physical fold surface, while retaining outward-facing thin stock edges and the existing light, grain and crease treatment. This prevents adjacent offset faces intersecting at a shared hinge. The review checks the rendered result; detailed causal toggles, pixel regressions and paint/budget measurements belong to the implementation and test records.

**CF-01 is resolved.** Fresh 1440×1000 screenshots show complete primary ink at all five reading chapters. “Grow together” retains its heading, paragraphs, notes link and the continuous rust center panel alongside it. The same full composition returns after closure and after an interrupted departure. Original and CSS-scale images agree. The reviewed correction does not use an arbitrary camera offset to avoid the failing pose.

**The closure is accepted.** All four sizes retain the actual Z-fold object through the pullback, orbit, flat crossing and accordion closure. The printed reverse appears on the physical right wing and the interior rust sliver narrows as the packet closes. The stock edges stay thin and attached in the inspected grazing-angle frames; no floating edge, detached printed face, blank-face flash, mirrored message or visible change of material was found. Forward and reverse paths remain visually coherent. The final phrase is clearly readable with the official watermark below, including at 320×568. It remains a printed, quiet final gesture with appropriate empty space.

Four new contexts repeat the complete closure, held endpoint, reverse and interrupted reverse. All eight held arrivals remain exact for the additional 350ms observation; all four full reversals and all four interrupted reversals return to the exact preceding pose. All 56 primary line rectangles in these arrival checks are safe. The five additional desktop reading holds include 74 more safe primary lines. The reviewer visually inspected those holds, all four forward/reverse sequences, desktop and phone interruption sequences, original endpoint images, and original-resolution phone frames around the edge-on crossing. There are no page errors. The final phrase and watermark also remain in the ordinary-reading screenshots.

No unresolved P0–P2 visual finding remains within this bounded rendered scope. The opening, other reading-mode recovery behaviors, reduced motion, no-JavaScript, accessibility, renderer budget, paint counts and hosted publication remain separate owner/test gates. This review does not convert desktop Chromium emulation or recorded frames into physical iPhone certification, and it does not reuse historical whole-site numerical scores.

### Candidate v4 identity

| File                       | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `src/scripts/motion.ts`    | `1dd651244ecbbabce9836866a1b02708c995cdc6d1ff4cee1e1ffc950cd0f010` |
| `src/scripts/tour-path.ts` | `04c348e0aa41c96b3c366e533427cb24d33568870501c73e55a3df509ee34817` |
| `src/styles/global.css`    | `2feca704a598dfd1f4334d9627061f2e824c186dcad20b5d5c7f5b323a74bf8c` |
| `src/pages/index.astro`    | `92aa5e0382ebfe3176a0153e6d0034baf4024305b1ae74dc503115928b01e1f4` |
| `src/content/proposal.ts`  | `6a174813a211309e0eefd9ffd32e9962736ffc64b05ff583097acac041804173` |
| `public/paper-grain.svg`   | `db5cc6197e90a427b102935630b6f57075e980a198ae908b7b3b1516f5f1a620` |
| `dist/index.html`          | `aca0ea5656b652b603c76395f917484f43820372586bf31fc8772d1644b7bc70` |

All before/after hashes match. Successful commands:

- `node qa-artifacts/closing-fold/review/capture.mjs candidate-v4`
- `node qa-artifacts/closing-fold/review/extract.mjs candidate-v4`

Current ignored evidence is `qa-artifacts/closing-fold/review/candidate-v4/`, with results, full videos, all original/CSS endpoint images and continuous contact sequences. The browser lane was handed back to the independent tester before offline extraction, and all extraction completed before the next isolated opening run. No application or regression-test file was edited by this reviewer.
