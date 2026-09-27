# Fresh review: commercial copy and information grouping

**Candidate:** candidate-v3, reviewed 27 September 2026. **Score: 100/100.** No actionable commercial-copy or related-text-grouping defect found within this review's scope. This is the assigned category's assessment, not overall release approval.

## Identity and independence

Reviewed the served candidate at `http://127.0.0.1:4321/handrail-proposal/`. Independently fetched and hashed all 28 files listed in `qa-artifacts/final-design/candidate-v3/identity.json`; every served byte hash matched. Main HTML SHA-256: `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`. Identity check time: `2026-09-27T15:36:45.610Z`.

- Proposal PDF: `d9759900f5a67816fe24a4bea3a7118d8700630755befd04ce0e9726bf23c363`.
- Resume PDF: `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.
- Independent receipt: [identity.json](../../qa-artifacts/final-design/r3/copy/identity.json).

Read AGENTS.md, PROJECT.md, DESIGN.md, the approved local workflow and the neutral review brief, plus canonical proposal/resume content and relevant rendering source. Did not read prior reviews, grades, remediation/progress records or other reviewers' findings. Captures are this reviewer's own. No app edits, rebuild, commit, publication or PR creation occurred.

## Scope and evidence

Fresh headed Chromium `153.0.8010.12`, isolated contexts, DPR 1, at desktop **1440×1000**, phone **390×844**, small **320×740**, short **390×664**, and tablet **768×1024**. Captured every tour chapter at each size, ordinary reading, proposal notes and resume routes, with both viewport and full-page document captures. Inspected original individual images, including all desktop and standard-phone reading scenes, small-phone collections/rates/window/closing, short-phone collections/client-first/window/closing, tablet cover/rates, and representative responsive document sections. Full-page captures supported document continuity; individual viewport images supported actual reading-size judgment. No contact sheets were used.

Downloaded both served PDFs after hash verification, extracted text and rendered all four pages through Poppler. Inspected each page, including the complete notes page 2 at original image resolution. Reviewed the public GitHub entry in headed Chromium and read the two linked contribution PRs directly. The profile distinguishes authored work from scoped contributions; the linked [BOXMEOUT-STELLA PR](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) and [Open-Stellar PR](https://github.com/Bitcoindefi/Open-Stellar/pull/430) show merged work consistent with the resume descriptions.

Reproducible evidence: [capture script](../../qa-artifacts/final-design/r3/copy/capture.mjs), [capture metadata and rendered text](../../qa-artifacts/final-design/r3/copy/capture.json), [portfolio capture](../../qa-artifacts/final-design/r3/copy/portfolio-readme.png). No page errors were recorded during the local capture run. The evidence directory is ignored and remains local.

## Scores and exact reasons

| Criterion | Score | Reason and evidence |
| --- | ---: | --- |
| Immediate proposition | **20/20** | The cover joins the growth objective, a proposed working relationship, no base salary and collections-based commission in one reading group. The starting contribution is new business; the closing makes discovery, scoping and pricing concrete while retaining room to grow. The reader does not have to decode the animation to find the offer. See `desktop-tour-1.png`, `phone-tour-1.png`, `tablet-tour-1.png`, `phone-tour-6.png`. Deduction: **0**. |
| Compensation precision | **20/20** | Both paths identify the collected build-fee basis and the separate 5% collected recurring-fee basis. Hire-first explicitly covers future credited sales; client-first explicitly covers the triggering client and all future credited sales. Requested benefits and no base salary remain attached to each phone rate group. The comparison uses the same $10,000 collection, labels retained cash before costs, identifies the hypothetical pricing and states the $500 difference per installment. Notes retain conditional full-build totals, recurring example and unresolved criteria/duration/timing. See `desktop-tour-3.png`, `small-tour-3.png`, `small-tour-4.png`, `short-tour-2.png`, both proposal PDF pages. Deduction: **0**. |
| Concise persuasive language | **20/20** | The commercial argument is short and causal: Handrail's earlier commitment earns the lower build rate; originating the qualifying client first earns the higher rate; commission follows actual collections. The language does not promise profit, certain sales, a completed agreement or an invented future title. The next conversation has concrete questions rather than generic persuasion. Resume examples explain practical work and bounded contributions without inflating ownership. See `desktop-notes-full.png`, `proposal-pdf-1.png`, `proposal-pdf-2.png`, `resume-pdf-1.png`, `resume-pdf-2.png`. Deduction: **0**. |
| Hierarchy and related-copy spacing | **20/20** | Rate labels, fee bases, rationale, scope and common terms remain a coherent unit in the reviewed tour compositions. The complete 90-day sequence and closing contribution remain grouped on small and short screens. Document rules and spacing separate topics while keeping explanations with their headings. The resume distinguishes proposed contribution, supporting foundation and inspectable proof. Neither PDF splits a heading from its essential explanation. See `phone-tour-3.png`, `phone-tour-4.png`, `small-tour-5.png`, `short-tour-6.png`, `phone-notes-2.png`, `small-resume-5.png`, all PDF page renders. Deduction: **0**. |
| Proposal/resume/notes consistency | **20/20** | The flyer, reading mode and notes/PDF express the same two paths and proposed status. Expanded notes clarify open business details without silently introducing a different rate or limit on future credited sales. The resume says how Brent *could* contribute, retains the 2025 bachelor's year, and describes graduate coursework without claiming a completed graduate degree. Its broad possible contribution is consistent with new business as the beginning. The [public profile](https://github.com/brentthomas248) likewise separates projects and contributions. See `desktop-read-full.png`, `desktop-notes-full.png`, `desktop-resume-full.png`, `small-read-3.png`, `small-notes-6.png`, and both PDFs. Deduction: **0**. |
| **Total** | **100/100** | **0 deductions.** The brief's 20-point anchor means exemplary within the assigned brief with no actionable defect found; it is not a claim of universal perfection. |

## Findings and disposition

**No P0, P1, P2 or P3 findings.** No correction or recheck is requested for this category on this frozen candidate. No subjective preference has been promoted into a material defect or a score deduction.

In particular, the all-future-sales term is visible in the client-first tour scene at 390×844, 320×740 and 390×664, in ordinary reading, and in section 3 of the notes/PDF. It is not confined to an off-screen footnote. The rates and benefits request are also visible together. Adjacent-panel print may be cropped at the edge of the tour, but the inspected active commercial reading groups are complete.

The proposal deliberately leaves qualifying-client criteria, credited accounts, recurring duration, reporting/timing, benefits details and deals in progress for discussion. Those are openly identified negotiation items, not defects to fill with invented terms.

## Limits and workflow

- This was a commercial-copy and information-grouping review. Endpoint navigation and responsive document reading were exercised; continuous motion, reversal, frame delivery, keyboard/assistive technology, no-JavaScript and reduced-motion behavior were not certified here. The integration owner performs functional checks separately.
- Viewport simulation in headed desktop Chromium is not physical iPhone, Safari, browser-chrome, touch, high-DPR or assistive-technology certification. Font scaling and text-spacing overrides were outside this specialist pass.
- Resume factual consistency was checked against the approved brief and canonical copy. The two linked merged contributions were independently checked; employment history, education records, customer results and the forecasting experiment were not independently audited.
- The original private MOU/pricing materials were not reopened. Business review used the explicit terms in the neutral brief, PROJECT.md and DESIGN.md; no private financial assumptions were imported.
- Agentic UI lifecycle/QA and PDF inspection guidance were used. The executable router returned a read-only ready result under `narrow-ui-change`; its generic generation classification is not a claim that generation or a full lifecycle certification ran. The assigned read-only review and `docs/local-workflow.md` governed scope. Credentialed Stagehand/Browserbase services remain omitted under the approved local workflow.
- `dev-doctor` initially reported the noninteractive `TERM=dumb` shell issue; the rerun with `TERM=xterm-256color` passed registry, shell, toolchain and Git checks. Existing unrelated contract warnings remained visible debt. No repository configuration was changed.

Only this report and `qa-artifacts/final-design/r3/copy/` were written. Next step: the integration owner applies the complete panel's release gate; this category supplies no blocking finding.
