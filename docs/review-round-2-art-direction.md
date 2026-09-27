# Round 2 — independent editorial and art-direction review

Reviewed September 26, 2026 (local date), against the live source edition `16d332d` at <https://brentthomas248.github.io/handrail-proposal/?v=16d332d>.

**Verdict: do not approve the current whole proposal as a finished design.** The warm identity and folded-document idea are appropriate. The reading sequence, explanatory graphics, hierarchy and ending are not yet one authored presentation. The issue is not a need for more visual effects or more complicated charts.

This is an independent editorial/art-direction judgment, not implementation, release approval, accessibility certification or physical-iPhone certification. Previous approvals and test totals were not used as aesthetic evidence. No application, build, commit or publication changes were made.

## Evidence inspected

- Fresh installed-Playwright captures of every chapter: six desktop stops at 1440 × 1000; nine stops including overview at both 390 × 844 and 320 × 740. Exact labels/positions are in `qa-artifacts/review-round-2/art/capture.json`.
- Fresh forward-scroll samples through the entire journey, final frames, full normal-reading documents, and individual normal-reading sections at all three sizes. Capture scripts and images are under `qa-artifacts/review-round-2/art/` and remain ignored.
- Fresh proposal-notes pages at all three sizes. Their clearer argument and ending informed the editorial recommendations below. PDF visual QA was outside this review.
- Actual captured references: Telescope `telescope-deep-4.png`; Stripe Press `stripe-select-settled.png`; Exat `ref-exat-0.png`; Igloo `ref-igloo-2.png`; Handrail careers `ref-careers-0.png`. The original private Handrail one-pager was inspected without copying it into the repository. Igloo's damaged headless text limits that evidence to scene/object composition.
- `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, `IMPLEMENTATION.md`, `docs/local-workflow.md`, approved reference/brand research, rendered content and surrounding source. The frontend-design and lifecycle/QA instructions were applied. Read-only lifecycle routing and required Storybook-readiness checks returned `ok: true`. This uses the explicitly approved local workflow; Stagehand and Browserbase were omitted. No global certification is claimed.

## Ranked findings

Priority here describes the effect on visual/editorial signoff. An observed inconsistency is distinguished from the design judgment about its effect.

### 1. P1 — normal reading rearranges the argument and ends on the wrong idea

**Observed defect; high confidence.** All three normal-reading documents place the complete partnership ending and notes link directly after “Let's grow Handrail,” before cash and rates. They then end on the 90-day lapse: “the hiring commitment ends.” The tour puts the partnership ending last. This is a real difference in narrative order, not a font preference.

Evidence: `desktop-read-full.png`, `phone-read-full.png`, `small-read-window.png`. Cause is visible in `src/pages/index.astro:60`: `#together` precedes the cash/rates/window panels in semantic document order, while `data-camera-order="5"` places it last in the tour.

**Revision:** make the logical reading order proposition → collected revenue → two starting paths → 90-day window → contribution/discussion in every presentation. Preserve canonical content and accessible semantics; do not merely hide a second closing inside the fallback. The final document should end on the conversation and proposal-notes action, with the lapse condition retained in its proper preceding section.

**Tradeoff:** the physical imposition of a trifold and linear semantic order need deliberate separation. That is justified; the object must serve the proposal's argument.

### 2. P1 — the phone ending is a disclaimer parked on empty paper

**Observed composition; design judgment, high confidence.** At both phone sizes, stop 7 presents the contribution story in a narrow column. Stop 8 leaves most of the viewport empty, isolates a muted discussion paragraph/link near the paper's lower edge, and at 390 exposes ghosted fragments of the previous body at right. It does not read as an intentional resolution. Desktop stop 5 has the converse problem: oversized closing prose fills the cropped paper with little object context. All essential current words are present in the selected frames; the failure is the hierarchy and composition, not a claim of missing terms.

Evidence: `phone-stop-7.png`, `phone-stop-8.png`, `small-stop-7.png`, `small-stop-8.png`, `desktop-stop-5.png`.

**Revision:** author one closing composition with one headline, one concrete contribution paragraph, a short discussion status and one notes action. The existing notes already authorize a better, specific paragraph: “I would start by helping bring in new business, working with the team on discovery, scoping and pricing.” Follow it with one sentence about shaping contribution around Handrail's needs. This is more credible than “turn opportunities into results.” Fit the full closing idea together on phones by editing and rearranging the print, not by creating a second macro shot of the disclaimer.

**Tradeoff:** less ceremonial repetition and fewer camera beats; a stronger final decision point. Keep the future role open and Handrail's ownership of the final contract explicit.

### 3. P1 — the payment graphic adds decoding without strengthening the commercial point

**Design judgment grounded in the rendered encoding; high confidence.** The 20/80 split is mathematically clear and its before-costs qualifier is present. But it mainly re-demonstrates arithmetic already stated as $2,000 and $8,000. The twelve connected pairs then introduce a new legend and the sentence “Matched events, not equal amounts.” That sentence explains the designer's marks, not the proposal. On the 320 view it is particularly compressed. Neither static graphic makes payment-before-commission sequencing as immediate as the prose does. This is not evidence that the arithmetic is false.

Evidence: `desktop-stop-2.png`, `phone-stop-3.png`, `small-stop-3.png`, `small-read-cash-flow.png`; `src/pages/index.astro:157–220`.

**Revision, after cross-review of [the commercial specialist's recommendation](review-round-2-commercial.md):** a compact comparison on the same $10,000 collection is stronger than retaining the single client-first receipt. Show two equally weighted outcome columns: Hire first, $1,500 commission / $8,500 before costs; Client first, $2,000 commission / $8,000 before costs. Put the collected $10,000 above both, with one adjacent cost/illustration qualifier below. This makes the employer's choice legible without mental arithmetic or a second chart. At 320 pixels, two values stacked within each outcome column should fit better than a three-column table with long row labels; this remains to be composed and verified.

Keep the $500 difference subordinate: one plain line beneath the comparison, or next to the premium rationale in the paths section. It must not become another headline or badge. If retaining the canonical $120,000 build/12-installment scenario, state that assumption in a quiet caption and label $10,000 per collected installment. A more compact valid alternative is explicitly “Illustration: one $10,000 build-fee collection,” with the twelve-month prompt removed entirely and the full schedule retained in notes. Do not mix the single-collection label with an ambiguous twelve-event visual.

Delete the proportion bar, twelve-event comb, two-key legend, encoding disclaimer, generic cash-closing paragraph and redundant revenue-first slogan scene. Keep “Commission follows each collection” beside the example. Do not substitute an elaborate Sankey, pseudo-bank transaction UI, coin animation or forecast chart. The mature treatment is more selective, not more complex, and requires no additional scene.

**Tradeoff:** less visible “graphic work,” substantially less explanation tax. Stripe Press supports keeping the physical object confident while the supporting information stays calm; it does not imply every section needs an illustration.

### 4. P1 — “The commitment sets the rate” overstates an ambiguous abstraction

**Copy/hierarchy judgment, high confidence; one objective grouping defect.** “Commitment” is underspecified: commitment by whom, and is it the later 90-day commitment? The two actual paths are much clearer. Desktop gives this slogan major prominence above very large percentages. On phones it becomes faded, partly cropped peripheral text above each route. A reader sees either an overemphasized abstraction or an apparent disabled heading.

Additionally, the shared scope/benefits paragraph is structurally placed only under Hire first (`src/pages/index.astro:266`). The text says “Both paths,” but its position and phone framing make it look like the left option's condition. The proposal notes correctly identify benefits as a request; the flyer says “with an employment benefits package.” Align this tone with the canonical requested status.

Evidence: `desktop-stop-3.png`, `phone-stop-4.png`, `phone-stop-5.png`, `small-stop-4.png`, `small-read-paths.png`.

**Revision:** delete the commitment headline. Promote the already-existing, concrete “Two ways to begin” to the real heading. Lead each route with its trigger, then rate; retain the client-first premium rationale once. Place common conditions in a full-width shared band for desktop and a properly associated shared paragraph in the phone reading sequence. State benefits as requested. Avoid implying that the higher rate is the default by giving 20% all the color and disproportionate emphasis; keep any premium accent restrained and intentional.

**Tradeoff:** a less slogan-like section that explains the actual decision faster. Preserve 15%/20% build, 5% recurring, collection basis, triggering-client/future-credit scope and the premium rationale.

### 5. P2 — new and old scenes operate under different visual rules

**Observed inconsistency; effect is a design judgment, high confidence.** The beginning and cash frames use solid ink and close hinge movement. From Hire first onward the phone selectively fades surrounding printed text. That makes the same physical sheet behave like a digital spotlight. Desktop later scenes magnify body copy and clip the paper top/bottom; the 90-day condition becomes one of the loudest moments in the presentation. Phone travel around the window/closing also returns to a tiny whole-sheet interlude (`phone-forward-50.png`), unlike the more local opening travel.

Evidence: `phone-stop-2.png` versus `phone-stop-4.png`; `desktop-stop-4.png`; `phone-forward-50.png`; secondary-ink selectors at the end of `src/styles/global.css`.

**Revision:** apply one print and camera policy to the entire document. Use fixed ink colors. Organize the paper so active content fits without fading neighboring paragraphs. Match a stable reading-size range across chapters and use a fold/edge or believable margin as spatial context. Treat 90 days as a bounded practical window, not the climax. The movement specialist should author local transitions into the last scenes, including the eventual return to the closing face.

**Tradeoff:** requires recomposition beyond the first slice. Do not solve this by pulling every scene back until type becomes tiny. Telescope's useful principle is a purposeful change in composition; it does not justify repeated resets to a distant overview.

### 6. P2 — repeated beginnings consume emphasis that should establish contribution

**Editorial judgment; high confidence.** The cover says “A beginning. Room to grow.” The inside says “Let's grow Handrail.” The cash panel says “Bring me on board. Let revenue lead.” The close says “The beginning of a partnership. Start here. Grow together.” “No base salary” and collection timing recur repeatedly. The repetition is factually consistent, but too much headline-scale content says “start/grow” without advancing the argument.

Evidence: all desktop stops, both normal-reading full pages, `src/content/proposal.ts:15–31`.

**Revision:** reserve the strongest display type for the proposition and the closing. Let cash and rates use informational headings. Keep the economic promise on the cover/inside and state the mechanism where the example appears; remove redundant colophons and generic cash-closing copy. Replace the closing's two vague paragraphs with the specific discovery/scoping/pricing starting point already in the notes, plus the open-ended contribution sentence. Use serif prose for a meaningful introduction, not several tiny decorative pre-headlines.

**Tradeoff:** the tour becomes shorter and less rhetorically padded. No invented achievements, financial claims or permanent sales-only role are needed to make it more specific.

### 7. P2 — paper credibility will come from composition and light before additional texture

**Taste/material judgment; medium confidence.** The opening has an intelligible folded silhouette, restrained warm light and a visible edge. That is worth keeping. At later closeups the object becomes a flat, screen-filling rectangle; faint rules, strong cropping and changing ink undermine the material more than a shortage of grain does. Diagonal edge aliasing is visible in these DPR1 browser captures, but is not a physical-device finding.

Evidence: `desktop-stop-0.png`, `desktop-forward-34.png`, `desktop-stop-4.png`, `phone-stop-8.png`; compare Stripe's selected book, which retains its whole object silhouette and reading copy together.

**Revision:** retain quiet matte paper and restrained crease/light response. First restore sensible reading distance, stable print and controlled peripheral paper; only then judge whether surface treatment needs adjustment. Avoid coarse paper noise, more shadow blur, more dramatic metallic light or rigid card thickness as a substitute. Full-panel visibility need not be forced in every phone frame, but a clipped text field alone should not be mistaken for object realism.

## Coherent visual direction

**A concise Handrail business proposal, opened as one continuous printed object.** The identity comes from the unchanged logo and the supplied sheet's heavy sans-serif statement, useful serif introduction, disciplined rules and compact comparison. Warm paper and rust are brand-derived here, not a generic aesthetic justification. Keep the existing palette and type families; a font change would not fix the present hierarchy.

The memorable element is the physical unfolding. Let the print behave like serious business communication. Use a large invitation once, one compact comparison of financial outcomes, a clear explanation of the two path triggers, a modest window and an authored closing. Exat supports intentional display/read-scale contrast, not every section becoming a giant headline. Handrail's supplied sheet supports strong hierarchy and exact comparisons. Stripe supports object presence plus calm reading. Igloo supports scene continuity, not gratuitous orbiting.

Suggested semantic sequence and working headings (copy proposals, not approved new terms):

1. **Let's grow Handrail.** No base salary; commission follows collected revenue. One sentence explains the partnership's starting point.
2. **Commission follows collection.** One shared collection, both commission/remaining-cash outcomes, and one installment sentence.
3. **Two ways to begin.** Hire first / Client first; visible triggers, comparable rates, shared conditions in a shared location.
4. **A 90-day window.** Align on the qualifying client; either path can begin; the hiring commitment expires if neither happens. Keep the existing business meaning.
5. **Start with new business. Build from there.** Concrete initial contribution, room to evolve, discussion status and notes action together.

The existing phone limit is a maximum, not a requirement to fill eight stops. With edited copy, aim for six substantive phone reading frames after overview: proposition, payment, hire first, client first, window, closing. Validate the complete groups before deciding the final count.

## Frame-level acceptance for the next candidate

| Frame           | Desktop acceptance                                                                                                                    | Both phone sizes                                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Folded overview | Intact cover silhouette; invitation recognizable; paper edge and shadow coherent; no extra decorative prop.                           | Cover title recognizable without requiring the tiny supporting text to carry essential meaning. Header/controls stay usable.                                                 |
| Proposition     | One dominant invitation; economic structure and contribution sentence subordinate; complete intentional margin/edge context.          | Logo, invitation and economic statement read together. No extra chapter solely repeating revenue-first copy.                                                                 |
| Payment         | Collection context precedes the two aligned outcomes; commission and remaining-before-costs figures are equally clear for both paths. | Both outcomes, illustrative context and installment rule visible as one authored idea; no toggle, extra stop, or legend/disclaimer needed to decode a decorative graph.      |
| Paths           | Trigger + rate comparisons have equivalent hierarchy; common terms are visibly shared; no commitment slogan.                          | Each route includes trigger, build/recurring basis and applicable sales scope. Shared request/conditions remain clear; inactive fragments are not faded as a framing crutch. |
| Window          | Three linked conditions read at normal body scale, with 90 prominent enough to find but not the page's climax.                        | Whole sequence readable in one frame, with the condition's complete last line above controls; no giant closeup of a single clause.                                           |
| Closing         | One intentionally framed resolution; concrete contribution and notes action; believable paper margin, not clipped surrounding prose.  | One complete closing group including invitation, contribution, discussion status and action. No separate mostly-empty disclaimer stop.                                       |
| Normal reading  | Same logical section order and final action as the tour; complete document stands alone.                                              | Same story, clean numeric/label alignment at 320, and a final partnership/action section after the 90-day condition.                                                         |
| Transitions     | Entry and exit frames maintain one understandable object; no repeated distant reset without a narrative reason.                       | Stable printed ink and readable endpoints; tiny overview interludes are deliberate exceptions rather than defaults.                                                          |

Review the next candidate as a complete contact sheet plus live travel, not only the revised cash frame. Preserve working fallback paths and the canonical terms. Accepting individual bounds or more tests cannot substitute for accepting the resulting composition.
