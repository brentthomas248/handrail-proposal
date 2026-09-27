# Independent review: commercial copy and information grouping

**Score: 98/100.** One minor document-grouping defect; no P0, P1 or P2 finding in this specialty. The proposal communicates the intended commercial structure accurately and keeps complete ideas together in the representative tour layouts. This is a category assessment, not release certification.

## Candidate and independence

Reviewed on 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.

- Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`.
- All 28 served files in `qa-artifacts/final-design/candidate-v8/identity.json` matched before and after browser capture. See `identity-before.json`, `identity-after.json` and final `identity-closeout.json` in the evidence directory.
- Read the assigned neutral brief, AGENTS.md, PROJECT.md, DESIGN.md, local workflow, relevant redesign/brand references and both complete canonical content sources. Did not read earlier reviews, scores, remediation, peer findings or IMPLEMENTATION.md.
- Created independent headed-Chromium captures using the neutral browser helper. All original images cited below were inspected, including all four PDF page renders. No app edit, rebuild, commit or publication. All five isolated browser instances closed.

Evidence directory: [`qa-artifacts/final-design/r8/copy/`](../../qa-artifacts/final-design/r8/copy/). Reproduction: `node qa-artifacts/final-design/r8/copy/review.mjs`. The read-only lifecycle router returned no blockers but classified this bounded review as a tiny change; the actual evidence scope follows the explicit independent-review brief and approved local workflow, not a claim of generation or full lifecycle certification.

## Scope

| CSS viewport | Rendered copy/grouping coverage |
| --- | --- |
| 1440 × 1000 | All five tour reading scenes; full ordinary reading, notes and resume; notes comparison/window and resume contribution details |
| 390 × 844 | All six tour reading scenes; full ordinary reading, notes and resume; targeted document details; native forward/reverse wheel sequences and settled reading groups |
| 320 × 740 | Collections, client-first rate and complete 90-day sequence |
| 390 × 664 | Collections, hire-first rate and closing contribution group |
| 768 × 1024 | Both rates together and complete 90-day sequence |

Phone captures use DPR 3; desktop/tablet DPR 1. Screenshot pixels are not CSS pixels. No quantitative effective-font-size claim is made. Complete text was read from the canonical sources, rendered web extraction and both two-page PDFs. Text checks found all 31 selected canonical notes items on desktop, phone and PDF; all 57 resume items were present on desktop, phone and PDF. Resume PDF column interleaving required comparing both Poppler layout and normal reading-order extraction, corroborated visually; initial extraction-only misses were not product omissions. Receipts: `content-checks.json` and `resume-pdf-content-recheck.json`.

## Scores

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Immediate proposition | 20/20 | The first reading scene plainly names a proposal for working together, then presents growth, no base salary and commission following collected revenue in descending hierarchy. New business is the starting point without defining a permanent sales-only role. The complete statement remains together on desktop and phone. No deduction. |
| Compensation precision | 20/20 | Both build rates and the common recurring rate name collected fees. Client-first scope explicitly includes the triggering client and future credited sales. The notes explain the additional five percentage points without inventing guarantees, a commission tail or an agreed contract. Benefits are requested and separately identified as a company cost. Arithmetic and qualifications are correct. No deduction. |
| Concise persuasive language | 20/20 | The central cash-timing benefit is concrete and economical. The higher-rate rationale explains why the sequence matters. The closing connects commercial work with discovery, scoping and pricing, then leaves future contribution open. The resume supports that breadth through concrete experience and attributed public work instead of speculative titles or unsupported promises. No actionable word-choice defect; no deduction. |
| Hierarchy and related-copy spacing | 18/20 | Rates retain their fee basis, explanation, future-sales scope and common terms as one reading group; the collected-dollar comparison retains its assumption and before-costs qualification. The 90-day steps and partnership closing stay complete in the sampled small/short layouts. **−2 for COPY-01:** the notes PDF separates the final recurring illustration paragraph from section 4, leaving it at the top of page two. This is a noticeable but minor loss of document grouping. |
| Proposal/resume/notes consistency | 20/20 | Web and PDF preserve the same business terms and proposal status. The notes properly expand the flyer with open qualifying-client, credit, duration, timing, benefits and in-progress-deal questions. The resume uses the confirmed 2025 bachelor's year and identifies graduate coursework without claiming a graduate degree; possible Handrail contribution is clearly conditional. No content contradiction found; no deduction. |
| **Total** | **98/100** | **Two points deducted solely for COPY-01.** |

## Finding

### COPY-01 — P3 minor: recurring example is detached by the notes PDF page break

**Observed:** Section 4's heading, assumptions, table, qualifiers and conditional full-build totals occupy page one. Its final recurring-commission example appears alone at the top of page two, immediately before section 5. This is present in both rendered pagination and extracted text, not a CSS3D capture anomaly.

**User impact:** A reader turning or skimming the PDF has to reconnect that unheaded paragraph to the illustration section on the previous page. The paragraph is still clear and correct, so this does not obscure a term or change the economics.

**Evidence:** [`proposal-pdf-1.png`](../../qa-artifacts/final-design/r8/copy/proposal-pdf-1.png), [`proposal-pdf-2.png`](../../qa-artifacts/final-design/r8/copy/proposal-pdf-2.png), and `proposal-pdf.txt`. Compare the uninterrupted web grouping in [`1440x1000/notes-collections.png`](../../qa-artifacts/final-design/r8/copy/1440x1000/notes-collections.png).

**Bounded fix:** Adjust print-only spacing/pagination so the recurring example stays with the rest of section 4. Retain comfortable body type and all qualifications; do not remove content or add contractual terms to solve a layout issue.

**Recheck:** Regenerate through the established PDF process, inspect both pages, verify section 4 remains a coherent group and section 5 starts cleanly, then rerun canonical PDF text consistency. No app change was made by this reviewer.

## Evidence-led assessment

The collection math checks as $120,000 ÷ 12 = $10,000; the alternatives yield $1,500/$2,000 commission and $8,500/$8,000 before company costs. The $500 difference is explicitly per installment. Conditional full-build totals are $18,000/$24,000, with a $6,000 difference; the separate $2,000 recurring collection produces $100 at 5%. The example is visibly illustrative and not Handrail pricing. The copy never equates retained cash with profit or promises company-wide positive cash flow.

The visual information groups are strong. On phones, each rate repeats the shared benefits/no-base terms beneath a rule, while the two-rate desktop scene places those terms once beneath both columns. This repetition serves context rather than creating an inconsistent offer. The comparison's assumption precedes its amount, row labels stay beside or immediately above their figures, and the cost qualification remains in the same tour scene. The 90-day sequence keeps each short heading close to its explanation. The contribution paragraphs precede a distinct discussion/final-contract note and notes link. Representative proof: `1440x1000/the-two-paths.png`, `390x844/client-first.png`, `320x740/cash-flow.png`, `390x664/grow-together.png` and `768x1024/the-window.png`.

The resume's proposed contribution headings and foundation paragraphs distinguish possible work from established experience. Its public proof links describe scoped contributions. The [GitHub profile](https://github.com/brentthomas248) uses the same workflow-oriented positioning, and the two linked PRs display merged status and matching scope: [BOXMEOUT-STELLA #44](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) and [Open-Stellar #430](https://github.com/Bitcoindefi/Open-Stellar/pull/430). These primary pages were checked live; this does not independently audit every resume employment fact.

The relevant grouping principle is the relationship between whitespace and content: headings should remain closer to the material they introduce, and spacing should distinguish groups without breaking their internal connections. This review used that principle from [USWDS typography](https://designsystem.digital.gov/components/typography/), with judgment appropriate to short tour passages rather than mechanically imposing a long-document measure. The [public Handrail sample MOU](https://handrail-daas.com/careers/sample-mou.html) was read via a direct HTTP fetch after the web reader could not load it. It informs document tone/provenance, not authority to replace the user's explicitly proposed terms with its different commercial plan.

## Limits and closeout

This is bounded copy/grouping evidence. No physical iPhone, manual VoiceOver, assistive-technology certification, alternate-browser certification, audience conversion study or financial/legal due diligence is claimed. The phone native wheel sequence confirms forward/reverse navigation reached readable groups; no continuous-video or frame-performance assessment is inferred. The folded overview itself was not separately captured in this specialty. Small/short/tablet coverage is representative rather than every scene in every viewport. The full private brand documents were not accessed. No broad tests were run and no previous passing suite was used as aesthetic evidence.

Poppler emitted Type 3 glyph bounding-box warnings during rendering; all four original page images were inspected without corresponding visible missing or corrupted text. The initial resume extraction misses were explained by reading-order/column behavior and cleared with the alternate extraction plus visual inspection. Neither protocol behavior incurred a score deduction. Five browser console/page-error logs were empty.

The frozen candidate was unchanged at closeout; all 28 hashes matched. Only this assigned report and its ignored evidence directory were written. COPY-01 is the only actionable residual in this category.
