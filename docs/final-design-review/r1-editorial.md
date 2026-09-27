# Round 1 — Editorial typography and spacing

**Score: 91/100. Disposition: revise the three P2 findings before release.**

## Candidate and scope

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.
- Frozen application: `33f64ef7e648ec740cf443120663faba0d39d218`; current repository HEAD `a499369a8629c3007de53760b0345446b6e77476` contains subsequent documentation. No application edit, build, publication or PR was performed.
- Independently captured headed Chromium at 1440×1000, 390×844, 320×740, 390×664 and 768×1024, device scale factor 1. Captures cover every tour endpoint, normal reading, notes and résumé HTML at every size. Inspected original viewport captures rather than relying on a contact sheet or existing screenshots.
- Independently rendered and inspected both pages of each distributed PDF using Poppler. Both documents are two pages; proposal notes are A4, résumé is US Letter.
- Evidence directory: [`qa-artifacts/final-design/r1/editorial/`](../../qa-artifacts/final-design/r1/editorial/). Capture commands: `node qa-artifacts/final-design/r1/editorial/capture.mjs`, `node qa-artifacts/final-design/r1/editorial/measure.mjs`; PDF renders use `pdftoppm -scale-to 1600 -png` against the two `dist` PDFs. Both browser scripts exited 0. No page errors were recorded. This is a specialist editorial judgment, not a full automated release gate.
- Read the neutral brief, AGENTS.md, PROJECT.md, DESIGN.md and approved local workflow. AGENTS.md also required IMPLEMENTATION.md; that checkpoint was read for candidate identity. No other reviewer's findings, scores or existing capture images were read. Agentic UI lifecycle/QA and PDF skills informed the evidence procedure; the local workflow explicitly omits credentialed services.

## Scorecard

| Criterion | Score | Exact deduction and rationale |
| --- | ---: | --- |
| Type hierarchy | 20/20 | No deduction. The serif introduction, compact bold cover, primary rates, recurring rates, labels and qualifications form a clear hierarchy. Notes and résumé headings remain readily distinguishable from their bodies. |
| Line measure and rhythm | 18/20 | −2, ED-03: small/short cash-flow text has a noticeably compressed reading rhythm at approximately 12.2–12.4 effective pixels. |
| Microspacing and wrapping | 19/20 | −1, ED-04: the desktop/tablet collections caption strands “first.” after a long line, separating the path name and giving a prominent caption a weak final line. |
| Macro composition and whitespace | 17/20 | −3, ED-01: the complete 90-day copy consumes the lower paper inset, leaving essentially no box clearance on phones and only a few visible pixels above the desktop footer rule. |
| Responsive/document consistency | 17/20 | −3, ED-02: mobile ordinary reading hides the hire-first future-sales scope paragraph that is present in the tour and desktop/tablet reading. |
| **Total** | **91/100** | **Nine points deducted. No P0/P1 found; three P2 findings require correction or evidence-backed disposition.** |

## Findings

### ED-01 — P2: The 90-day group has no lower print inset

**Observed / user impact.** At the window endpoint, the phone's last sentence finishes against the physical sheet edge. The surrounding scene has abundant empty space, but the printed group looks cut off at the bottom. It remains readable; this is an optical print-margin defect, not a claim that the controls hide the sentence. Desktop/tablet have a similar tight finish above the colophon rule. The closing scene has a real lower inset, so the two adjacent narrative conclusions feel inconsistently finished.

**Evidence.** [`phone-tour-5.png`](../../qa-artifacts/final-design/r1/editorial/phone-tour-5.png), [`small-tour-5.png`](../../qa-artifacts/final-design/r1/editorial/small-tour-5.png), [`short-tour-5.png`](../../qa-artifacts/final-design/r1/editorial/short-tour-5.png), [`desktop-tour-4.png`](../../qa-artifacts/final-design/r1/editorial/desktop-tour-4.png). [`reading-metrics.json`](../../qa-artifacts/final-design/r1/editorial/reading-metrics.json) records the 390×844 final paragraph box ending at y=430.109 and the face at y=430.175: about 0.07px box clearance. At 320×740 the corresponding values are y=373.723 and y=373.777. Visible glyph clearance is only approximately 4–6px. Compare [`phone-tour-6.png`](../../qa-artifacts/final-design/r1/editorial/phone-tour-6.png), whose closing group has a deliberate lower paper margin.

**Bounded correction.** Give the right panel a real lower print inset after the full window group, accounting for the hidden mobile colophon. Preserve the existing restrained zoom, complete idea and surface-memory budget. A modest intrinsic content inset is preferable to enlarging a short paragraph into a new scene. On desktop/tablet, also separate the final window lines from the footer rule.

**Recheck.** Capture this endpoint at all five sizes. Show a consistent intentional lower inset, with roughly one body line of visible clearance before the paper edge/rule, while every line still fits within header/control safe areas. Recheck the right panel's rate scenes and high-DPR surface budget because its intrinsic height may change.

### ED-02 — P2: Mobile ordinary reading drops the hire-first scope line

**Observed / user impact.** The tour's hire-first group states “The selected rate covers all my future credited sales.” It disappears from ordinary reading below the mobile breakpoint. A reader who chooses the more conventional format receives a less complete hire-first explanation, while the client-first scope remains visible.

**Evidence.** Compare [`phone-tour-3.png`](../../qa-artifacts/final-design/r1/editorial/phone-tour-3.png) with [`phone-normal-paths.png`](../../qa-artifacts/final-design/r1/editorial/phone-normal-paths.png) and [`small-normal-paths.png`](../../qa-artifacts/final-design/r1/editorial/small-normal-paths.png). [`tablet-normal-paths.png`](../../qa-artifacts/final-design/r1/editorial/tablet-normal-paths.png) shows the scope line in ordinary reading. In `src/styles/global.css`, the mobile rule `html[data-presentation='read'] .rate-scope { display: none; }` suppresses it; both `DealPath` instances are rendered with `showScope={false}`, so there is no component-level substitute.

**Bounded correction.** Keep the existing canonical `.rate-scope` paragraph visible in mobile ordinary reading and apply the same secondary-body spacing used in tablet/desktop reading. No new copy is necessary.

**Recheck.** At 320px and 390px, verify the hire-first label, percentage, recurring percentage, description, scope and shared terms in ordinary, reduced-motion and no-JavaScript reading. Confirm the tour remains unchanged and client-first scope is not duplicated.

### ED-03 — P2: Small/short financial copy is markedly smaller than the surrounding reading experience

**Observed / user impact.** At 320×740 and 390×664, the full cash-flow explanation fits but supporting text reads like compact annotation. The table's labels, $500 comparison, payment-order sentence and before-costs qualifier are all visually small. These explain the financial example and deserve comfortable reading size. This is a visual editorial assessment, not a claim that WCAG mandates a particular authored font size.

**Evidence.** [`small-tour-2.png`](../../qa-artifacts/final-design/r1/editorial/small-tour-2.png), [`short-tour-2.png`](../../qa-artifacts/final-design/r1/editorial/short-tour-2.png), compared with [`phone-tour-2.png`](../../qa-artifacts/final-design/r1/editorial/phone-tour-2.png). `reading-metrics.json` measures screen-effective supporting type at **12.16px** on 320×740 and **12.384px** on 390×664, versus **14.82px** at 390×844. The cash-flow print rules use the same effective size for row labels and material qualifiers. The 320px window body also falls to approximately 12.51px, reinforcing the abrupt size change from ordinary reading.

**Bounded correction.** Tune the small/short printed composition so financial supporting text is closer to the 14–15px effective size already achieved on the regular phone. Rebalance native type size, line measure and inter-block gaps within the complete group. Preserve all explanatory copy and safe-area clearance; do not split it into isolated sentence crops. Assess the small-window body alongside the same scale policy.

**Recheck.** Inspect original headed images at 320×740 and 390×664. Confirm an evidently comfortable supporting size, preserved hierarchy, complete labels/qualifiers, and no tighter text-edge or control clearance. Retain the numerical effective-size receipt, but judge the resulting paragraph rhythm visually as well.

### ED-04 — P3: The desktop collections caption leaves a single-word last line

**Observed / user impact.** In the otherwise well-aligned cash panel, “$500 more commission per collected installment under client first.” wraps only “first.” onto the final line. This visually breaks the path name and adds a weak extra line to an important comparison caption.

**Evidence.** [`desktop-tour-2.png`](../../qa-artifacts/final-design/r1/editorial/desktop-tour-2.png); the same print measure appears at tablet. The ordinary desktop layout has enough width for the complete sentence, so this is specific to the tour's printed measure.

**Bounded correction.** Keep “client first” together and tune this caption's measure or balanced wrapping so the final line has a meaningful phrase. Avoid a global nowrap rule that would overflow phones.

**Recheck.** Inspect the desktop/tablet caption and all phone cash endpoints. No one-word tail, no overflow, and no new line that compresses the safe-area fit.

## Successful editorial decisions and limits

The approved trifold and complete reading groups are retained as strengths. The 390×844 rate scenes keep heading, two percentages, explanation and common terms together; the window and closing groups avoid giant sentence crops. Normal reading uses a clear document rhythm, and the notes' seven sections are legible. The résumé's hierarchy, experience grouping and education/skills columns transfer well to HTML and both PDF pages. Neither PDF displayed clipped text, overlapping copy or missing visual sections in the independent renders. Proposal-notes page 1 ends early because section 4 begins a new page; this is conspicuous whitespace, but its compensation-first grouping is defensible and receives no deduction. Exact PDF line measurements also confirm ordinary gaps before sections 5–7; a suspected tight section-7 gap was not sustained by inspection and is not a finding.

Poppler emitted Type 3 glyph bounding-box warnings, but no visible glyph defect was observed. Physical iPhone viewing, native browser chrome, assistive technology, user text-spacing overrides and print on paper were not tested by this reviewer. This review uses desktop Chromium viewport simulations, not physical-device certification. Continuous forward/reverse choreography and performance are not scored here. No-JavaScript/reduced-motion mode content is a required recheck for ED-02, not completed evidence in this packet. This report does not establish repository test, deployment, full lifecycle or external-service readiness.
