# Round 2: commercial communication and information design

Reviewed September 26, 2026 (local time). Review only; no application, build, contract, or publication changes.

## Judgment

Replace the current cash graphic with a compact dollar comparison built around one explicit collection schedule. Business readers need to see the consequence of the hiring decision on the same collected money. A more elaborate chart would not automatically make this proposal more credible.

The live page already contains **$10,000 collected, $2,000 commission and $8,000 remaining**. The problem is not a complete absence of dollar amounts. Those numbers describe only client first, the twelve payment markers carry no amounts, and the two-path scene goes back to percentages. The useful comparison exists as prose in the notes, several reading steps away.

The current treatment spends visual attention explaining a percentage split and a repeated event. It should spend that attention showing **$1,500 versus $2,000 commission**, **$8,500 versus $8,000 before costs**, and why the proposed rate differs. Keep the partnership framing, the collection condition, and the requested benefits. Do not imply that the remaining money is profit or that this hypothetical build is booked business.

## Scope and evidence

- Independently inspected the deployed [versioned proposal](https://brentthomas248.github.io/handrail-proposal/?v=16d332d) and [proposal notes](https://brentthomas248.github.io/handrail-proposal/agreement/?v=16d332d) using installed Playwright/Chromium, at desktop 1440 × 1000 and phone 390 × 844.
- Exercised chapter navigation, opened the normal reading path, and inspected rendered cash, rates and notes screenshots. Phone captures are browser emulation, not a physical-device claim.
- Read `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, `IMPLEMENTATION.md`, the canonical content, rendering source, brand sources, redesign research and approved local workflow. Previous design acceptance and test results were treated as history, not proof of communication quality.
- Applied `frontend-design` and the local Agentic UI review approach. The read-only lifecycle router returned no blockers and no mutation authority. Stagehand and Browserbase remain omitted under the existing [approved local workflow](local-workflow.md). This is a bounded independent editorial/design review, not global QA certification.
- Fresh captures and extracted text are in ignored `qa-artifacts/review-round-2/commercial/`; `capture-record.json` records viewports, chapter labels, URL and capture time. The captured browser sessions emitted no page errors; that does not prove design quality.

Evidence keys below refer to files in that directory:

| Key | Rendered evidence                                                  |
| --- | ------------------------------------------------------------------ |
| E1  | `desktop-cash-flow.png`                                            |
| E2  | `phone-as-money-arrives.png`                                       |
| E3  | `desktop-the-two-paths.png`                                        |
| E4  | `phone-hire-me-first.png`, `phone-client-first.png`                |
| E5  | `desktop-notes-collections.png`, `phone-notes-collections.png`     |
| E6  | `desktop-notes-top.png`, `phone-notes-top.png`                     |
| E7  | `desktop-notes-next-step.png`, `phone-notes-next-step.png`         |
| E8  | `phone-revenue-first.png`                                          |
| E9  | `desktop-cash-normal-settled.png`, `phone-cash-normal-settled.png` |

The initial `*-cash-normal.png` captures were taken immediately after the mode change. The desktop frame caught a transient clipped state; the fresh, settled direct reading-route capture is the evidence used here. No persistent reading-mode defect is inferred from that initial frame.

## Ranked findings

Severity describes impact on the proposal's communication: P1 materially obscures the central decision; P2 adds meaningful interpretation or negotiation friction; P3 is editorial polish. These are not production incident levels. Confidence is confidence in the observation and rationale, not measured user-test performance.

| Rank | Finding                                                                                                      | Severity / confidence | Rendered evidence and consequence                                                                                                                                                                                                                                                                         | Recommended disposition                                                                                                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1   | The cash story does not compare the employer's two choices on a common dollar basis.                         | P1 / high             | E1–E4: cash gives only the 20% path; rates gives large 15%/20% figures but no corresponding commission or remaining dollars. On phone the two paths are separate camera stops. Readers must remember values and do arithmetic to assess the commitment.                                                   | Put both dollar outcomes together on the same $10,000 collection. Do not require a toggle or separate stops to compare them.                                                                                                       |
| C2   | The twelve-payment illustration has no explicit total or per-installment unit in the flyer.                  | P2 / high             | E1, E2, E9: `$10,000` is labeled “Customer payment collected,” followed later by “Paid over 12 months?” The flyer never says `$120,000 build` or `$10,000 each month`. A reader could reasonably wonder whether the twelve markers divide that $10,000 or repeat it. E5 resolves this, but only in notes. | State the full assumption immediately above the numbers: “Illustration: a $120,000 build paid in 12 equal monthly installments.” Label $10,000 “Collected per installment.”                                                        |
| C3   | The visual marks require explanation without adding useful business information.                             | P2 / high             | E1, E2: a 20:80 bar repeats three already printed values; twelve identical pairs require two symbol keys plus “Matched events, not equal amounts.” Neither set of marks shows a payment amount, a cumulative obligation, a delayed collection, or a difference between paths.                             | Remove the bar, symbol keys and paired markers. Use aligned amounts and an explicit collection condition. A plain comparison is more informative here.                                                                             |
| C4   | The phone spends a full scene repeating the premise before it reaches the economics.                         | P2 / high             | E8 uses the scene for “Bring me on board. Let revenue lead” and “No base salary… Customer money arrives first,” already stated on the cover. E2 then ends with another general incoming-cash sentence. This creates movement without a comparable increase in understanding.                              | Keep one collection-first sentence with the dollar example. Remove the cash closing sentence. Reclaim the scene budget for the employer's comparison, not more slogans.                                                            |
| C5   | Shared terms and the client-first premium are not arranged around the decision they qualify.                 | P2 / high             | E3/E4: the shared future-sales and benefits text sits beneath the hire-first column, while client first gets a long first-person justification. The premium is not quantified. “With an employment benefits package” is also firmer than the canonical “part of my request.”                              | Put shared terms beneath both choices. Say benefits are requested. Explain five additional percentage points and $500 per illustrated collection once, with the future credited-sales scope nearby.                                |
| C6   | The notes contain the best example but encode a comparison as a long paragraph.                              | P2 / high             | E5: the reader must hold $120,000, 12, $10,000, $2,000, $8,000, $1,500 and $8,500 in sequence. The phone paragraph spans many lines; hire first is expressed as “those amounts.”                                                                                                                          | Use the same compact comparison in the notes, with explicit row and column labels. Keep the recurring example separate. Preserve the canonical-content contract when implementing.                                                 |
| C7   | The next conversation is described, but its outstanding decisions are buried in repeating partnership prose. | P2 / medium-high      | E7: sections 6 and 7 restate growth, role evolution and commission structure before listing qualifying-client criteria, credited accounts, recurring duration, payment reporting and benefits. A reviewer must extract the actual negotiation agenda.                                                     | End with a short “For our next conversation” list of existing unresolved points. Retain room for the contribution to evolve, but do not repeat the entire commercial pitch.                                                        |
| C8   | Repeated branding and general labels delay substantive notes on phone.                                       | P3 / high             | E6: the fixed header logo is repeated by a second large logo, then “For discussion,” “Proposal notes,” “Growth partnership proposal,” tools and a full contents list. At 390 × 844 the substantive introduction barely enters the viewport.                                                               | In the web notes, retain the persistent brand and discussion status; omit the repeated body logo and redundant subtitle. Preserve a body logo in the standalone PDF if needed. Keep contents links, with a more compact treatment. |

The page does correctly put a cost qualifier beside the retained amount, labels the example as illustrative, and keeps proposed/final agreement status in the notes. Those distinctions must survive any simplification. This review does not establish whether the commission rates are financially attractive: no delivery-cost, acquisition-cost, margin or ROI evidence is supplied in the public proposal.

## What the current graph teaches

The 20:80 bar teaches that $2,000 is one fifth of $10,000. The paired markers teach that a commission event corresponds to a collection event. Those are valid propositions, but both are already conveyed by adjacent text. The chart does not answer the employer's more consequential question: **what changes if Handrail commits first?**

The twelve equal marks are event counters, not a quantitative chart. Their equal size and regular spacing invite a monetary/time reading, which the corrective “Matched events, not equal amounts” then disclaims. A graphic that needs that disclaimer has chosen the wrong encoding for this task. Adding axes, animation or more marks would not solve the missing decision comparison.

The collection condition also needs precision. The proposal establishes collection before commission. It does not establish a specific number of days between collection and payout. A time-scaled arrow, marker offset or animation delay must not manufacture a payment cadence. “Commission follows each collection” is accurate; an invented “paid immediately” or fixed payout date is not.

## Three dollar-based alternatives

All alternatives below use only the existing canonical illustration in `src/content/proposal.ts`: a $120,000 build paid in 12 equal monthly installments, with $10,000 collected each month. Totals and differences are arithmetic derived from that illustration, conditional on collecting the entire illustrated amount. They are not forecasts, Handrail pricing or accepted terms.

### A. One collection, two proposed paths — recommended

One shared context line, two columns, two comparable amount rows:

**Illustration: a $120,000 build paid in 12 equal monthly installments.**

**Collected per installment: $10,000**

| Per collected installment       |       Hire first |     Client first |
| ------------------------------- | ---------------: | ---------------: |
| Build commission                | **$1,500** · 15% | **$2,000** · 20% |
| Handrail remaining before costs |       **$8,500** |       **$8,000** |

**Difference: $500 more commission per $10,000 collected under client first.**

“Commission follows each collection. Handrail receives the customer payment first.”

“Remaining amounts are before delivery, benefits and other expenses. Illustration only; not a forecast or Handrail pricing.”

Static presentation: align dollar values by row; keep both path headings, collection assumption and cost qualifier visible together. Avoid a large decorative `$120,000` competing with the two real decision numbers. On phone, retain both columns in the same reading group with short labels and sufficient space; if that cannot be legible, use two adjacent compact outcome blocks inside one scene, each explicitly labeled. Do not hide the second path behind a toggle.

Motion presentation: arrive at a complete, already readable comparison. If motion is useful, move a restrained emphasis once from “Collected” to both commission amounts together; values, labels and qualifiers remain static. Scroll reversal reverses the emphasis, never the money or contractual meaning. Do not count dollars up, animate a balance dwindling, or make information depend on watching the sequence. Reduced motion and normal reading retain the exact complete comparison.

Why this wins: it answers the employer's decision in one view, removes mental arithmetic, and makes the collection condition explicit with fewer marks. Tradeoff: it is less visibly “graph-like.” That is appropriate because the data has two fixed cases, not a trend or distribution needing a chart.

### B. A compact collection schedule

Useful when the reader's main objection is an upfront commission bill. Show one row for “Each of 12 collected monthly installments,” then a clearly conditional total row. A twelve-row table would repeat identical values without adding insight.

| Illustration                      | Collected build fees | Hire-first commission | Client-first commission |
| --------------------------------- | -------------------: | --------------------: | ----------------------: |
| Each collected installment        |              $10,000 |                $1,500 |                  $2,000 |
| All 12 installments, if collected |             $120,000 |               $18,000 |                 $24,000 |

An adjacent remaining-before-costs row or small second table would show $8,500/$8,000 per installment and $102,000/$96,000 after all twelve collections. That extra table makes this too dense for the primary phone scene; it belongs in notes if needed.

Static presentation: a real table, no arbitrary “Month 1 / 6 / 12” selection that looks like sampled performance. Motion: a quiet row emphasis while the collection assumption stays visible; no rolling calendar or automatic monthly progression. Risk: the total can be mistaken for an expected commission budget. Label it “If all 12 installments are collected,” and do not call $6,000 an annual premium.

### C. Cumulative commission steps over collections

If an actual chart is required, use two cumulative step lines with the x-axis labeled “Collected installment 1–12” and y-axis “Illustrative cumulative build commission.” Direct endpoints: hire first $18,000; client first $24,000. First step labels: $1,500 and $2,000. State that each collected installment is $10,000 and that the full illustration totals $120,000. Both series start at $0 before any collection.

Static presentation: both complete series visible, direct labels instead of a legend. Keep remaining-before-costs values in a separate nearby comparison, since commission-only lines otherwise sideline the employer's concern. Motion, if any, uses a user-controlled collection index with exact paired values; no autoplay and no simulated actual collections.

This is the weakest primary choice. It uses much more room to visualize straight-line arithmetic, can resemble a forecast, and cannot show commission plus retained money cleanly without adding more series. The two-line gap makes the premium the story. Reserve this for a specific question about cumulative commission exposure; do not use it merely to appear sophisticated.

## How prominently to state the difference

The **$500 per $10,000 collection** difference is worth showing. It translates the five percentage points into the employer's immediate comparison and makes the proposal transparent. Put it beneath the two equally weighted outcomes, not in a promotional badge. Pair it with the business trigger: the higher rate is proposed when Brent originates the qualifying client before the hire.

The **$6,000 across all twelve collections** difference is valid derived arithmetic, but should be secondary. Leading with it frames the page as an argument over Brent's premium, encourages anchoring on a hypothetical total, and obscures that the selected rate also applies to future credited sales. In supporting notes use exactly: “If all 12 illustrated installments are collected, total build commission is $18,000 under hire first or $24,000 under client first—a $6,000 difference.” Do not say annual earnings, guaranteed savings, profit, or ROI.

Do not add the recurring example into the build amounts. The existing separate illustration is sufficient: “At either path's 5% recurring rate, a $2,000 recurring collection produces $100 of commission.” It does not change $1,500/$2,000 build commission into $1,600/$2,100 without an explicit combined scenario, which is unnecessary here.

## Exact removal and replacement copy

These are recommendations for a subsequent implementation, not edits to agreed commercial terms.

| Current element or copy                                                                                   | Replace with / action                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cash headline: “Bring me on board. Let revenue lead.”                                                     | “Commission follows collections.” This can be the cash scene's only headline.                                                                                                                                                                                                                                  |
| “No base salary. No commission advance on a contract. Customer money arrives first.”                      | “No base salary. Handrail receives the customer payment before the related commission is paid.”                                                                                                                                                                                                                |
| “Client-first example”                                                                                    | “Illustration: a $120,000 build paid in 12 equal monthly installments.”                                                                                                                                                                                                                                        |
| “Customer payment collected”                                                                              | “Collected per installment” with `$10,000`.                                                                                                                                                                                                                                                                    |
| Single-path $2,000/$8,000 receipt                                                                         | Replace with alternative A's two-path comparison. Retain 15% and 20% as supporting rate labels.                                                                                                                                                                                                                |
| 20:80 bar, filled/hollow squares, both symbol legends, twelve pairs, “Matched events, not equal amounts.” | Remove. No replacement visual encoding is necessary.                                                                                                                                                                                                                                                           |
| “Paid over 12 months? My commission follows each payment.”                                                | “Commission follows each collection.” The installment assumption now lives above the table.                                                                                                                                                                                                                    |
| “A way to start working together, with compensation connected to incoming cash.”                          | Remove; it repeats the scene's premise.                                                                                                                                                                                                                                                                        |
| Cost/illustration qualifier                                                                               | “Remaining amounts are before delivery, benefits and other expenses. Illustration only; not a forecast or Handrail pricing.” Keep it directly beneath both outcomes.                                                                                                                                           |
| Shared terms located only under hire first                                                                | Move beneath both paths: “Both paths: no base salary, 5% of collected recurring fees, and a requested benefits package. The selected rate applies to my future credited sales under the relationship.”                                                                                                         |
| Long “business I created and the risk I took” premium explanation                                         | “Client first proposes five additional percentage points for bringing in the qualifying client before the hire. The 20% rate applies to that client and my future credited sales.” Show the $500 example difference nearby, once.                                                                              |
| Notes heading: “A simple example of the cash timing”                                                      | “Illustrative collections and commission.” “Simple” is not inherently disrespectful, but it adds no business information.                                                                                                                                                                                      |
| Notes introduction repeating cover and closing                                                            | “Proposed terms for beginning a partnership: no base salary, commission tied to collected revenue, and a requested benefits package. My contribution can evolve with Handrail's needs. These terms are for discussion; Handrail prepares the final agreement.”                                                 |
| Closing notes' repeated restatement of the economics                                                      | Lead with “For our next conversation,” then the existing open items: qualifying-client criteria; credited accounts; recurring commission duration; payment reporting and timing; benefits; and treatment of deals still in progress when the window ends. Do not supply answers that have not been negotiated. |
| Repeated body wordmark and “Growth partnership proposal” subtitle in web notes                            | Remove from the web notes opening; retain the document title and discussion status. Keep appropriate branding in the standalone PDF.                                                                                                                                                                           |

Implementation should move the illustrative assumptions and derived amounts into the existing typed content boundary and render the flyer/notes/PDF consistently. Do not create a second independently maintained financial example in the UI. No proposed dollar change requires a new compensation term; the amounts above derive from the current rates.

## Thirty-second executive comprehension test

This is a proposed acceptance exercise, not a test already run with business participants. Use a reader who has not seen the proposal. Give them the rendered cash comparison and path explanation for 30 seconds on desktop, and separately on a phone. No hints, source code, notes search, or walkthrough by the designer. Then hide the page and ask:

1. What is the hypothetical build value, how is it collected, and how much is each illustrated collection? **$120,000; 12 equal monthly installments; $10,000 each.**
2. If Handrail hires first, what commission follows that collection and how much remains before costs? **$1,500; $8,500.**
3. If Brent brings the qualifying client first, what changes? **$2,000 commission; $8,000 before costs; $500 difference on that collection.**
4. Is commission advanced on an unpaid contract, and is the remaining amount profit? **No to both.** A reader must not infer an agreed payout date.
5. Is client first a one-client bonus, and is this an accepted agreement? **No. Its proposed rate includes the triggering client and future credited sales; the proposal is for discussion.**

Acceptance: all five answers materially correct without a calculator; a wrong forecast/profit/accepted-agreement inference is a failure even if the arithmetic is right. Separately ask what remains to discuss. Expect benefits, credited/qualifying business and recurring duration/payment details, not a claim that every employment detail is settled.

Then ask a non-leading preference question: “What, if anything, did the graphic help you decide?” If the answer is only that 20% leaves 80%, the revised information design still has not addressed the user's criticism.

## Review closeout

Created this review and local rendered evidence only. No app source, proposed terms, generated PDF, tests, build, commit or deployment changed. Static/motion prescriptions above remain unimplemented and untested. The next step is to select the comparative presentation, compose it at actual desktop/phone reading sizes, and run the comprehension exercise before polishing motion.
