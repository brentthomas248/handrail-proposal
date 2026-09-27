# Round 4 — Commercial copy and information grouping

**Score: 100/100. No actionable finding in this category.** This is the independent commercial assessment of the frozen local candidate, not a whole-product release approval or a certification.

## Candidate and independence

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.
- Served main HTML SHA-256: `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82`.
- The main HTML, notes HTML, resume HTML and both PDF responses were HTTP 200 and matched `qa-artifacts/final-design/candidate-v4/identity.json`. The main hash was checked again after the review and remained unchanged. [Identity receipt](../../qa-artifacts/final-design/r4/copy/identity-verified.json), [final identity and paragraph receipt](../../qa-artifacts/final-design/r4/copy/paragraph-consistency.json).
- Read the neutral brief, project instructions, PROJECT, DESIGN and approved local workflow. No earlier review, score, remediation record, progress record or peer finding was read. All visual evidence below was captured independently in headed Chromium; no prior screenshots were reused.
- No application source edits, rebuilds, commits or publication. Changes are limited to this report and `qa-artifacts/final-design/r4/copy/`.

## Coverage and method

Inspected every reading scene at 1440×1000, 390×844, 320×740, 390×664 and 768×1024. The desktop and tablet present both rate paths together; each phone presents them separately. Reviewed the folded first impression at desktop and phone. Used actual chapter controls, then entered ordinary reading with the visible control. This specialty evaluates readable destinations and information grouping, not motion quality between them.

Inspected ordinary reading, notes and resume at desktop and phone, using full-page originals for document structure and targeted phone viewport originals for practical reading. Inspected both pages of each linked PDF after rendering the downloaded served bytes with Poppler. Checked complete document text, each illustration and the relationship between headings, paragraphs, qualifications and lists. The browser-to-PDF check matched 25/25 proposal paragraphs/leaf list items and 32/32 resume items. This comparison removes whitespace because raw PDF extraction joins some positioned display text; visual inspection separately verifies actual spacing and layout.

Evidence: [capture script](../../qa-artifacts/final-design/r4/copy/capture.mjs), [viewport manifest](../../qa-artifacts/final-design/r4/copy/captures.json), [document check](../../qa-artifacts/final-design/r4/copy/check-documents.mjs), [rendered document text and actual link targets](../../qa-artifacts/final-design/r4/copy/documents-and-references.json).

## Scored criteria

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Immediate proposition | **20/20** | The first reading composition says who the proposal is for, invites a working relationship, and gives the economic premise before supporting detail: no base salary and commission following collected revenue. Starting with new business is explicit without promising a fixed future job. The folded packet is appropriately an invitation to open the document; the first readable face delivers the proposition. **Deduction: 0.** Evidence: `desktop-tour-0/1.png`, `phone-tour-0/1.png`, `small-tour-1.png`, `short-tour-1.png`, `tablet-tour-1.png`, `phone-reading-top.png`. |
| Compensation precision | **20/20** | Each path names its trigger, collected build rate, separate 5% recurring rate, scope of credited sales, and shared benefits request. Client first expressly covers the triggering client and future credited sales. The collections comparison uses the same $10,000 installment, accurate $1,500/$2,000 commissions and $8,500/$8,000 before-cost balances. The $500 difference is per installment. The notes condition the full-build totals on all 12 collections and keep the recurring example separate. The 90-day window and unresolved qualifying/credit/payment/benefit questions are explicit. **Deduction: 0.** Evidence: `desktop-tour-2/3/4.png`, `phone-tour-2/3/4/5.png`, `proposal-pdf-1/2.png`, `phone-agreement-open-questions.png`. |
| Concise persuasive language | **20/20** | The argument proceeds from shared growth, to payment timing, to two choices, to a bounded beginning, to the next conversation. Short claims are supported immediately by plain explanations. The client-first premium is tied to originating the enabling business. The closing asks for discussion without asserting agreement, manufacturing urgency, exposing company finances, or promising profit. The resume backs potential contributions with concrete work rather than superlatives. **Deduction: 0.** Evidence: `desktop-tour-1/5.png`, `phone-tour-5/6.png`, `desktop-agreement.txt`, `resume-pdf-1/2.png`. |
| Hierarchy and related-copy spacing | **20/20** | Each active reading group retains its heading and complete explanation, including both rate labels, future-sales scope, common benefits line, cash-flow qualifications, and all three parts of the 90-day sequence. This remains true at 320×740 and 390×664. The two rate columns compare directly at desktop/tablet; the phone split repeats the common terms so either scene is intelligible alone. Notes use numbered sections and attached paragraphs; resume separates demonstrated experience from proposed contribution areas and attaches the supporting evidence to each. **Deduction: 0.** Evidence: `small-tour-2/3/4/5/6.png`, `short-tour-2/3/4/5/6.png`, `tablet-tour-3.png`, `phone-agreement-collections.png`, `phone-resume-contribute.png`. |
| Proposal/resume/notes consistency | **20/20** | Ordinary reading preserves the proposal sequence and terms. The notes and two-page proposal PDF agree; web and PDF resume content also agree. The resume retains the 2025 bachelor's year, labels graduate study as coursework, and describes Handrail responsibilities as potential contributions. It supports the proposal's room-to-grow premise without claiming prior Handrail employment or an agreed future title. Public proof is explicitly described as scoped contributions rather than ownership of other teams' projects. **Deduction: 0.** Evidence: `desktop-reading-full.png`, `desktop-agreement-full.png`, `desktop-resume-full.png`, `phone-resume-education.png`, `phone-resume-proof.png`, all four PDF page renders, `github-entry.png`, `paragraph-consistency.json`. |
| **Total** | **100/100** | **100 − 0 = 100.** The five criteria earn full marks within the stated commercial brief; this does not extend the assessment to untested behavior or other specialties. |

All abbreviated evidence filenames above are under `qa-artifacts/final-design/r4/copy/`. Originals were inspected individually; no contact-sheet-only conclusions.

## Findings and disposition

**No P0, P1, P2 or P3 finding. No deductions, bounded corrections or defect rechecks are warranted in this category.** There is no commercial-copy blocker to send for remediation.

The following distinctions informed that conclusion:

- Open qualifying-client criteria, recurring duration, attribution, payment timing and benefits details are negotiation topics expressly identified by the document. Leaving them open is faithful to the brief; inventing answers would make the proposal less accurate.
- The current official Handrail careers page and sample MOU use a different commercial structure. This document visibly proposes a negotiated alternative. That difference is not a copy inconsistency or a reason to import the sample MOU's legal terms.
- On some tablet/desktop tour views, portions of neighboring print enter the periphery. The active idea remains intact. The approved physical-sheet brief permits neighboring context; it is not evidence of missing main copy.
- Short-phone and small-phone collections text is more compact than the full-height phone view, but the compared amounts, labels and before-cost qualification remain readable together. Ordinary reading offers a larger flowing document. There is no evidenced grouping failure that justifies an arbitrary font-size deduction.
- Alternative choices of headline, pronouns or synonymous wording would be stylistic preferences. No such preference is scored as a policy or precision defect.

## Reference basis and limits

The [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) was checked live for readable measure, hierarchy and related-content spacing. It informs this judgment rather than imposing an identical body size on every camera composition. The official [Handrail careers page](https://handrail-daas.com/careers) and [sample MOU](https://handrail-daas.com/careers/sample-mou.html) were inspected in the browser after the web reader could not access them; own originals are `handrail-careers-reference.png` and `handrail-mou-reference.png`. They establish identity and document context, not authorization to change proposed terms. The accepted Telescope/Igloo/Exat/Stripe Press direction was taken from DESIGN and the reference provenance; this commercial specialty does not regrade their motion or material treatment. The public [GitHub entry](https://github.com/brentthomas248) was inspected for consistency of positioning and contribution attribution.

This is local headed Chromium coverage with emulated CSS viewport sizes. It does not establish physical iPhone stability, native touch or address-bar behavior, manual VoiceOver/screen-reader usability, PDF tagging, cross-engine fidelity, performance, memory consumption, field INP, or continuous forward/reverse animation quality. No private employment or forecasting evidence was re-audited; résumé claims were assessed for presented consistency and careful attribution, not independently recertified. No public deployment was tested as this frozen candidate.

Agentic UI lifecycle/QA and PDF inspection workflows were used within the approved local scope. Stagehand, Browserbase and credentialed generation services remain intentionally omitted by the recorded authorization. This report does not claim full global lifecycle certification. The integration owner should apply the separate overall release gate after the remaining independent specialties and behavior checks.
