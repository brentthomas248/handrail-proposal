# Round 2 — consolidated adversarial review

Reviewed September 26, 2026, against the [published proposal at source `16d332d`](https://brentthomas248.github.io/handrail-proposal/?v=16d332d). This is a review and implementation brief. No application changes or new deployment accompany it.

## Verdict

**Do not approve the current whole experience as finished.** The heading issue is a reproducible rendering defect, not just a matter of emphasis. The cash illustration contains dollars, but spends too much attention explaining a payment split and too little comparing the employer's choices. The audit also found failures in reverse scrolling, keyboard traversal and the fallback reading sequence.

Keep the Handrail identity, matte paper, Z-fold and useful unfolding. The next improvement needs better information hierarchy, consistent motion behavior and a composed ending. More effects or a more elaborate chart would leave the central problems intact.

The earlier review accepted a bounded opening-to-cash prototype. That acceptance does not cover the full experience. This round also challenges that prototype's payment diagram: the twelve event pairs recommended in the earlier review add decoding work without enough decision value. That recommendation is superseded by the dollar comparison below.

## Independent review coverage

Three fresh reviewers received separate briefs, the approved reference materials and the unchanged live release. Root independently reproduced the heading defect and examined the source/test boundary. The commercial and art reviewers then challenged each other's cash treatment and converged on the recommendation below.

| Reviewer                        | Primary responsibility                                                                                            | Durable report                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Commercial / information design | Employer decision, financial units, proposal status, amount comparison and unnecessary explanation                | [Commercial review](review-round-2-commercial.md)       |
| Editorial / art direction       | All chapters, typography, composition, material, source-brand fit and closing                                     | [Art-direction review](review-round-2-art-direction.md) |
| Interaction / failure review    | Intermediate motion, reversal and pauses, keyboard entry, fallback order, small/short phones and test blind spots | [Interaction review](review-round-2-interaction.md)     |
| Root synthesis                  | Independent heading measurements, cause, coverage gap, competing recommendations and release priorities           | This report                                             |

Fresh live Chromium evidence covers desktop 1440 × 1000, phones 390 × 844 and 320 × 740, plus 390 × 664 for heading/motion constraints. Captures include every chapter, actual forward/reverse input, intermediate states and normal reading. The interaction report separately covers reduced motion and no JavaScript. The art reviewer inspected captured Telescope, Stripe Press, Exat, Igloo and Handrail references; its report records the specific source artifacts and limitations. These sources guide composition, not asset copying.

Raw screenshots/scripts/measurements remain ignored under `qa-artifacts/review-round-2/`. This is local browser evidence, not a physical iPhone test or a claim of global UI certification. The [approved local workflow](local-workflow.md) still applies.

## Fix before the next release

Priorities here describe the next release's acceptance order. Objective defects and design judgments are separated deliberately.

| Priority                    | Finding and evidence                                                                                                                                                                                                                                                                                                                                                                                      | Required outcome                                                                                                                                                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — correctness             | **The shared rates heading is dimmed and cropped on phones.** At 390 × 844, its 487px-wide line extends from x82 to x569 in Hire first, then x−177 to x310 in Client first. Its color is approximately `#b7b6b3` while the active rate title is `#1a1816`. Root evidence: `root/heading.json`, `root/phone-hire-me-first.png`, `root/phone-client-first.png`; also reproduced at 320 × 740 and 390 × 664. | Treat the associated heading and qualifiers as part of the complete reading idea. Prefer the concrete heading “Two ways to begin.” Changing only its color is insufficient: its framing and semantic ownership also need repair.                                  |
| 1 — correctness             | **Settling undoes an intentional reverse scroll.** From Client first at y4147, one −280 wheel input reaches y3867. With no further input, the application starts moving forward about 671ms later and returns to y4147. This reverses a movement covering roughly 42% of the gap to Hire first.                                                                                                           | Respect the latest user direction after a pause. Hold the released position or settle in the intended direction; do not undo it. Exercise pause/reverse/resume, not just uninterrupted traversal.                                                                 |
| 1 — correctness             | **Ordinary keyboard traversal does not reach the chapter controls.** After Tab reaches Read normally, the next Tab changes presentation and focuses the notes action. The chapter test bypasses real traversal with `.focus()`.                                                                                                                                                                           | Preserve deliberate mode choice. Make chapter navigation reachable through an actual Tab sequence; provide a clear reading escape without changing modes merely because the next control is requested.                                                            |
| 1 — narrative / semantics   | **Reading mode changes the argument.** Physical panel order puts the complete partnership close and notes action before cash/rates/window. The tour separately sorts sections and closes with partnership. The ordinary document ends with the lapse condition.                                                                                                                                           | Use proposition → collections → paths → window → contribution/discussion in visual reading and semantic order, including no-JavaScript and reduced-motion presentations. CSS ordering alone cannot repair screen-reader order.                                    |
| 2 — commercial design       | **The cash graphic has the wrong comparison.** It shows only the client-first dollars; the later paths return to percentages. The twelve paired marks and their legend/disclaimer repeat the collection relationship without clarifying the employer's decision.                                                                                                                                          | Replace them with the same-collection dollar comparison below. Keep assumptions, collection basis and before-costs qualifier visible together.                                                                                                                    |
| 2 — meaning / grouping      | **Common conditions look path-specific.** Future credited sales and benefits are inside Hire first's group. Benefits also sound settled in the flyer but remain requested in the notes.                                                                                                                                                                                                                   | Visually and semantically associate shared conditions with both choices. Keep benefits requested and the client-first triggering-client/future-sales scope explicit.                                                                                              |
| 2 — whole-experience design | **Later scenes use a different visual language.** Whole groups change to gray as focus thresholds are crossed; later closeups and distant resets break the restrained opening's continuity. The last phone scene isolates a discussion paragraph/link on mostly empty paper.                                                                                                                              | Recompose the remaining print and camera positions, with stable ink and purposeful surrounding paper. Close on one complete contribution/discussion/action group. Do not solve this by making all text smaller or forcing all three panels into each phone frame. |
| 3 — orientation             | **Some chapter labels describe the preceding idea after the next one dominates.** Intermediate desktop rates frames still say Cash flow; phone Client first frames can still say Hire me first. The interaction report records exact positions in I-05.                                                                                                                                                   | Give transitions an honest label or use consistent scene-ownership intervals in both directions. Do not couple every frame to an assistive announcement.                                                                                                          |
| 3 — editorial polish        | **Repeated begin/grow statements and notes branding dilute the content.** Similar headlines occupy multiple stops while the specific contribution and open discussion points are less prominent.                                                                                                                                                                                                          | Remove redundant slogans, colophons and web-note branding. Use the existing discovery/scoping/pricing contribution once, keep room to evolve, and make the next conversation's unresolved points easy to find.                                                    |

The selected desktop closing frame contains its essential text; its cropped surrounding paper is a composition finding, not evidence that the closing terms are missing. The rates heading, reverse-settle behavior and keyboard traversal are independently reproduced functional failures.

## Heading diagnosis and why the current checks missed it

`src/pages/index.astro:257` places `.rates-heading` outside both `.rate-group` elements. `src/scripts/motion.ts:232` chooses each `data-camera-mobile` child as a phone stop, so the shared heading is not owned by either active mobile reading group. `src/styles/global.css:1943` explicitly includes `.rates-heading` in the secondary-ink rule during every later context hold. The mobile rule at line 1836 also removes its authored line break, leaving one long line across both columns.

This is not a timing problem that can be repaired with a longer highlight animation. The structure, camera target and styling disagree about which content belongs together.

`tests/e2e/proposal.spec.ts:129` requires rate cards and associated paragraphs but omits the shared heading from those reading groups. The additional assertion at line 1105 checks only its text, not its color or whether it fits. Consequently the selected-element tests can pass while the section's actual heading fails.

The next regression must enumerate the complete idea, including any associated heading and shared conditions, then verify its rendered lines and semantic association. A shorter replacement heading still needs that coverage; renaming it must not hide the faulty grouping model.

## Selected cash treatment: one collection, two proposed paths

Use the existing canonical illustration: **a $120,000 build paid in 12 equal monthly installments**. This is illustrative arithmetic, not Handrail pricing, an expected sale or a forecast. The per-installment numbers are the useful decision, so the total should be a small context caption, not the headline.

**Commission follows collections.**

**$10,000 collected per installment**

| Per collected installment       | Hire first · 15% | Client first · 20% |
| ------------------------------- | ---------------: | -----------------: |
| Build commission                |       **$1,500** |         **$2,000** |
| Handrail remaining before costs |       **$8,500** |         **$8,000** |

Supporting line: **$500 more commission per collected installment under client first.** Give it normal supporting emphasis, not another headline or promotional badge. Explain the client-first contribution/reward in the path section; do not frame the proposal primarily as a discount negotiation.

Collection rule: “Handrail receives the customer payment before the related commission is paid.”

Qualification immediately below both outcomes: “Remaining amounts are before delivery, benefits and other expenses. Illustration only; not a forecast or Handrail pricing.”

### Composition and motion

- Desktop can use a compact ruled comparison with aligned values and balanced path headings.
- On 320px phones, use two numeric columns with shared full-width row labels. Do not squeeze a long-label three-column table into the existing narrow frame. Both outcomes, assumptions and qualifier must remain in one complete reading group.
- Replace the current single-path receipt, 20/80 bar, twelve paired marks, legend and encoding disclaimer. Remove the extra cash-closing sentence and repeated premise before shrinking typography or adding another stop.
- Keep all amounts and labels stable in print. If an emphasis is retained, it may move once from the collected amount to both outcomes together and reverse naturally. No count-up, invented transaction timing, autoplay or toggle is needed.
- Normal reading, reduced motion and no JavaScript must expose the complete static comparison.

If all twelve illustrated collections arrive, commission totals are $18,000 versus $24,000, a $6,000 difference. Keep that conditional total secondary in the notes; do not call it annual earnings or a guaranteed saving. Keep the separate 5% recurring example separate from build amounts.

The two reviewers initially disagreed: art favored one simpler client-first receipt; commercial favored a two-path comparison. After cross-review, both preferred the comparison because it answers the employer's decision without making the reader remember a preceding scene. They agreed that the $500 difference should be secondary and that the replacement must remove existing content rather than increase density. Actual 320px rendering remains an implementation acceptance requirement, not a result of this review.

## Directed implementation order

1. **Repair interaction and narrative structure.** Add reproductions for reverse-pause settling and real Tab traversal before implementation. Establish logical document order independently of physical trifold imposition, while preserving one content source and no-JavaScript reading. Fix heading ownership alongside this structural work.
2. **Set the static print.** Replace the graphic with the dollar comparison; compose both paths and their shared terms; combine the closing into one contribution/discussion/action. Keep 15/5, 20/5, no base, collection basis, proposed benefits, future credited sales and the 90-day window intact. Render stills before authoring more motion.
3. **Complete the camera language.** Extend the opening's local fold travel through paths/window/closing. Maintain reading scale and purposeful paper margins; remove scene-based gray ink as a framing crutch. Motion should reveal a finished printed composition.
4. **Review the whole candidate.** Repeat independent business, art and interaction review on the same candidate. Review a complete contact sheet and uninterrupted forward/reverse travel, not just chapter-button endpoints. Publish only after the defects and composition findings have explicit dispositions.

No new animation library is proposed. The observed failures are in grouping, information selection, event behavior and choreography; another renderer would not itself resolve them.

## Evidence required for acceptance

| Concern                  | Required evidence                                                                                                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heading and rate meaning | Active heading, trigger, rates, scope and shared conditions fit and remain legible at 320 × 740, 390 × 664, 390 × 844 and desktop. Test related content, not only a selected card.                                                                         |
| Reverse and pause        | Reproduce the exact y4147 → y3867 negative input; observe beyond the settle delay. No automatic positive motion that undoes reversal. Add forward, touch-release and keyboard variants where they exercise the same owner.                                 |
| Keyboard                 | Start from the document and use Tab/Shift+Tab without programmatic focus. Reach mode choice and chapter navigation, activate a chapter, and retain predictable focus.                                                                                      |
| Reading order            | Assert the order of actual headings/sections in DOM and rendered normal/reduced/no-JavaScript documents. Partnership and the notes action follow the window.                                                                                               |
| Dollar comparison        | Verify arithmetic from typed canonical values, labels/units and visible qualification. Render the complete comparison on the smallest phone; no horizontal swipe/toggle or memory between scenes.                                                          |
| Commercial understanding | A new reader should identify no base, collection before commission, both dollar outcomes, the before-costs limit, requested benefits and discussion status. The proposed 30-second comprehension exercise has not yet been run with business participants. |
| Motion and ending        | Fresh intermediate forward/reverse frames, pause/restart input, no global ink jump, coherent object context, one complete closing. Independent critic signs off the complete candidate, not a partial slice.                                               |
| Device stability         | Keep the existing rendering budget and focused browser regression suite. Physical iPhone scrolling remains a separate unverified requirement; desktop emulation and Lighthouse do not settle it.                                                           |

## Review closeout

The explicit `full-product-qa` lifecycle route returned `ok: true`, no routing blockers and read-only live QA authority. The separate professional-readiness validator returned `ok: false`: visual/accessibility/performance evidence remains incomplete, manual assistive/device checks are absent, and the existing static-app autonomy schema mismatch remains. These are recorded workflow/certification gaps, not a substitute for the reproduced product findings above. No global certification or release approval is claimed, and no credentialed service was retried.

The financial arithmetic was independently recomputed: $10,000 × 15% = $1,500; × 20% = $2,000; before-costs remainders are $8,500/$8,000; twelve commissions total $18,000/$24,000. Review-document links and whitespace were checked. Application tests were not rerun for documentation-only changes; fresh live reproductions, rather than an unchanged endpoint suite, are the evidence for this audit.

No defects are marked fixed in this report. The reports and implementation checkpoint are the deliverables of this review; the public application remains unchanged.
