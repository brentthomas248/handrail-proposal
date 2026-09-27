# Paper prototype: independent design review

Scope: opening → beginning → cash flow. The redesign of rates, the activation window, and the ending is intentionally deferred.

Status: **Candidate 2 accepted for the bounded prototype.** The first candidate was rejected and revised. The accepted slice is clearer, gives the paper more coherent physical presence, and makes the cash-flow explanation more memorable than the preceding release. This is acceptance of the prototype direction, not a claim that the full site has reached the user's final visual standard.

## Reference and review basis

This review follows the findings in [the design director review](design-director-review.md), [approved research](redesign-research.md), and [Handrail brand sources](brand-sources.md). The reviewer read the frontend-design skill and inspected the locally captured references: Stripe Press's selected-book composition, Exat's display and editorial typography, Igloo's intact and exploded object, and Telescope's contrasting text and image compositions. Reference inspection in this pass used prior captured images; it was not a fresh live-site review.

The useful principles are persistent object identity, purposeful spatial movement, distinct display and reading scales, and material cues that agree with one another. The target is a considered Handrail proposal, not a reproduction of another site's assets or visual language.

## Acceptance contract

| Criterion                           | Required rendered evidence                                                                                                                                                                                           | Rejection condition                                                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paper remains the subject           | Opening, half-unfolded, beginning, and cash reading frames retain an intelligible edge, fold, margin, or silhouette.                                                                                                 | A reading scene becomes an enlarged text rectangle whose connection to the brochure is apparent only from memory.                                               |
| The opening has presence            | The initial object is substantial and recognizable. First scroll travels through its hinge into the proposal.                                                                                                        | The paper first becomes a small object in a large blank field, or the route loses spatial orientation.                                                          |
| Type and spacing express hierarchy  | Desktop has a deliberate distinction between display and reading text. Phone scenes contain complete ideas with purposeful peripheral context.                                                                       | Large type is used for every sentence; active text is cramped, cropped, or tiny; surrounding paragraphs look like disabled UI.                                  |
| The cash diagram explains the offer | Stable, labeled amounts show a collected $10,000 build payment divided into $2,000 commission and $8,000 retained before costs. Twelve paired markers explain collection/commission correspondence for installments. | The graphic is decorative, implies profit or a sales forecast, omits cost qualifications, or needs animation to be understood.                                  |
| Motion makes the argument clearer   | One hinge-led route establishes collection before the commission split, with an immediate and comprehensible reverse route.                                                                                          | Every transition repeats the same distant orbit, amounts disappear or count through invented values, or reverse travel suggests commission precedes collection. |
| Light describes form                | The opening, partial unfold, and reading scenes maintain a plausible light direction, fold ridge/valley, restrained edge thickness, and ground relationship.                                                         | Unexplained halos, floating-board shadows, excessive grain, shimmer, or gloss substitute for physical cues.                                                     |
| The existing quality floor survives | Complete reading groups fit at desktop, narrow phone, and short phone sizes. Normal reading and reduced motion retain the full static message.                                                                       | Primary content is hidden by chrome, performance cost is expanded with large filtered surfaces, or readability is sacrificed for a whole-object screenshot.     |

Functional checks support this review. They cannot establish that the visual story is distinctive, materially credible, or memorable.

## Review method

- Independently drive the built local preview at 1440 × 1000, 390 × 844, 320 × 740, and 390 × 664 CSS pixels.
- Inspect opening, intermediate unfold, beginning, the passage across the hinge, collection, split, and installment states.
- Capture real forward and reverse input, including intermediate frames and settled states; chapter-button screenshots alone are insufficient.
- Compare the new slice with the prior release images in `qa-artifacts/design-director-review/`.
- Store independent captures under `qa-artifacts/paper-prototype/critic/` and record an explicit verdict with actionable blockers.

## Candidate 1 review

Reviewed the integrated local build made at 20:33 on September 26, 2026. Independent evidence is in `qa-artifacts/paper-prototype/critic/candidate-1/`: opening and reading stills at all four planned viewport sizes, 18 intermediate forward/reverse frames per viewport, four continuous recordings, and `capture.json` with provenance. The reviewer drove the page using actual wheel input in isolated browser contexts. No application source was edited by the reviewer.

### Improvements worth keeping

- The proportional payment split and paired installment markers explain the proposal more clearly than the previous thin rule and unequal bars. The static diagram preserves the exact amounts and cost qualifications; the short phone and narrow phone versions remain readable.
- The adjacent beginning-to-cash camera passage is easier to follow than repeatedly returning to a distant orbit.
- The compact rule-based navigation gives the brochure more space and is better related to the printed document.
- Desktop reading scale is calmer. The beginning scene exposes a real paper margin and fold instead of relying entirely on texture.

### Required revisions

| Priority         | Finding and evidence                                                                                                                                                                      | Required change                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blocker          | The initial cover is severely foreshortened. `desktop-stop-0.png` and `phone-stop-0.png` show a skinny cover with compressed type while the receipt behind it is more visually assertive. | Turn the cover toward the viewer enough to give its short statement presence. The opened Z shape should support the cover, not obscure it.                                          |
| Blocker          | The first phone unfold still retreats to a small, approximately 250-pixel-tall strip before returning to the first reading scene. See `phone-forward-8.png`.                              | Follow the left hinge at a useful distance instead of fitting all three panels into the phone width during the opening. Preserve the coherent adjacent passage into the cash panel. |
| Blocker          | The phone beginning and revenue-introduction scenes still surround the active copy with whole pale, cropped paragraphs. See `phone-stop-1.png` and `phone-stop-2.png`.                    | Recompose printed columns, margins, and camera position so surroundings are deliberate paper context. Remove reliance on blanket gray ink in this slice once the spacing works.     |
| Material concern | A broad brown halo extends well to the right of the opening object. The paper still appears suspended like a board.                                                                       | Reduce the unexplained ground-shadow spread and strengthen restrained fold/edge cues within the existing rendering budget. Reassess with the corrected opening pose.                |

No new primary-text clipping failure or browser exception was observed in these captures. That does not overturn the design rejection above.

## Candidate 2 review and final verdict

Reviewed the integrated local build made at 20:43 on September 26, 2026. The reviewer independently repeated the four-viewport capture, forward travel, reverse travel, and settled-state inspection. Evidence is in `qa-artifacts/paper-prototype/critic/candidate-2/`: 15 opening/reading stills, 72 intermediate frames, four recordings, settled reverse/forward images, and a provenance record. Reduced-motion cash content was also rendered at desktop and phone sizes and inspected in ordinary reading mode.

**Verdict: accept the opening → beginning → cash-flow direction.** No remaining blocker was found in this bounded slice.

| Prior blocker or criterion    | Final finding                                                                                                                                                                                                                                               | Evidence                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Initial cover presence        | The cover faces the reader sufficiently to make its short statement legible and visually primary. A restrained glimpse of the rust panel establishes the folded object.                                                                                     | `desktop-stop-0.png`, `phone-stop-0.png`                                                     |
| Opening retreat               | The phone camera now remains near the paper during unfolding. It proceeds into the cover rather than first shrinking the complete spread into a small strip.                                                                                                | `phone-forward-8.png`, `phone-forward-12.png`, corresponding reverse frames                  |
| Disabled-looking surroundings | The phone beginning and revenue-introduction scenes use normal ink, real paper margins, and the adjacent fold. The earlier full gray paragraphs are absent from these reading compositions.                                                                 | `phone-stop-1.png`, `phone-stop-2.png`, `small-stop-1.png`, `small-stop-2.png`               |
| Explanatory cash diagram      | The stable collected amount, proportional split, labeled retained amount, cost qualification, and paired installment events form an understandable static explanation. The camera connects the revenue proposition to that diagram without a distant reset. | `desktop-stop-2.png`, `phone-stop-3.png`, static cash renders                                |
| Narrow and short screens      | The beginning, revenue proposition, and complete cash example remain readable. No active content is hidden by the fixed controls in the inspected reading holds.                                                                                            | `small-stop-1.png` through `small-stop-3.png`; `short-stop-1.png` through `short-stop-3.png` |
| Material and light            | The revised opening has a less distracting ground shadow. The restrained edges and crease give the paper an identifiable form; the typography remains sharp and grain does not become the main effect.                                                      | Opening, unfolding, and reading images across all four viewports                             |
| Reversible spatial argument   | Forward and reverse travel follow the same adjacent paper structure. The beginning-to-cash crossing is understandable as movement across the brochure rather than a jump between unrelated cards.                                                           | The forward/reverse sequences and recordings in the evidence directory                       |

The memorable element is now tied to the business proposal: money is collected, the applicable share follows, and installment events stay paired. The graphic remains useful without motion. The quieter navigation and improved opening support that explanation rather than competing with it.

The paper remains an intentional HTML illustration, not a physically simulated sheet. The revision is more credible than the rejected opening, but this review does not claim photographic material realism. The later rates, window, and ending scenes still require their separate design pass; visible glimpses of those sections in this prototype are not approval of their full redesign.

## Coverage boundary

Desktop browser emulation can establish the reviewed composition and interaction in that environment. It cannot certify physical iPhone memory behavior or reproduce every mobile browser toolbar condition. The existing renderer and material budget remain constraints, not aesthetic targets to loosen.

The reviewer observed no browser exceptions during the independent capture sessions. This is not a frame-rate certification or a replacement for the separate regression and renderer-budget checks. User visual acceptance of the prototype remains distinct from the critic's bounded acceptance.
