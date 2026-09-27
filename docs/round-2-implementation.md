# Round 2 remediation implementation

## Scope and contract

The user authorized all findings in [the consolidated review](review-round-2.md). This is a cross-cutting UI revision of the static proposal and its reading/notes surfaces, preserving the Handrail identity, paper proportions, canonical proposed terms and existing renderer. The [approved local workflow](local-workflow.md) governs verification; credentialed Stagehand/Browserbase remain omitted under that authorization. Independent rendered review replaces the unavailable semantic service for this delivery, without claiming global certification.

## Batches

| Batch              | Findings and root cause                                                                                                                               | Owner / files                                                                                   | Intended behavior                                                                                                       | Status      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- |
| Interaction        | I-01, I-02, I-04, I-05: header Tab forces mode change; nearest-anchor snapping ignores direction; paint thresholds own semantics; captions lag scenes | Motion specialist: motion.ts, tour-path.ts, unit tests                                          | Native reachable chapter controls, direction-respecting settle, stable print/semantics and accurate transition captions | Implemented |
| Semantic structure | I-03 and rates heading: physical panel membership owns source order and splits related headings                                                       | Root: index.astro, paper-layout.ts, CSS                                                         | Logical no-JS document order; same nodes mount into paper slots only for tour; complete rate ideas                      | Implemented |
| Commercial content | C1–C8 and art findings: repetitive graphic, fragmented comparison, ambiguous shared terms and repeated prose                                          | Content specialist + root: canonical content, comparison component, notes, generators and flyer | One collected-dollar comparison, aligned proposed terms, concise contribution/closing and useful discussion agenda      | Implemented |
| Composition        | Later scenes retain different camera/print rules; weak ending                                                                                         | Root + motion specialist: CSS, page, motion                                                     | Stable ink, local fold travel, readable scale, composed complete ending                                                 | Implemented |
| Verification       | Endpoint tests omit context, real Tab and settle cycle                                                                                                | Regression specialist + independent reviewers                                                   | Reproductions first, meaningful suite updates, complete-journey screenshots and fresh critical review                   | Implemented |

## Verification plan

- Reproduce previous failures using the unchanged public version; save ignored evidence.
- Run focused unit and browser checks during each batch; then `pnpm check`, `pnpm test`, `pnpm contract:check`, `pnpm build:release`, `pnpm pdf:check`, `pnpm test:components`, `pnpm format:check` and the full browser suite.
- Inspect rendered desktop 1440 × 1000, phone 390 × 844, small 320 × 740 and short 390 × 664. Include actual forward/reverse/pause traversal, keyboard, normal/reduced/no-JS, text bounds, material and ending; preserve the 64 MiB/4096px paper budget.
- Independent art/commercial and interaction reviewers must inspect the same candidate against all curated findings before release. Correct rejected frames and rerun affected evidence.
- Publication follows local acceptance. Verify hosted behavior, Pages result and deployed assets. Physical iPhone and manual VoiceOver remain explicit external verification gaps.

## Boundaries

No new animation library, backend, credentials, private financial information, legal boilerplate or changed compensation terms. Preserve existing uncommitted review docs. No source claim of fixed/verified until its evidence is recorded here. Global certification gaps remain separate from product verification.

## Implementation and review disposition

- Heading/shared-terms ownership now follows complete rate groups; stable printed ink replaces the broken highlight/dimming mechanism. On phones each rate owns its context and common terms; desktop has a shared band. No selected-card rectangle is used as a substitute for complete-copy framing.
- Native Tab reaches the header and chapter controls. Settling respects the last deliberate direction; exact 15/40/60 percent interval reversals are covered. Captions distinguish travel from arrival. Camera travel crosses local hinges and gives the window and complete closing a deliberate top alignment.
- One logical section order drives normal, reduced-motion and no-JavaScript reading. The same nodes move into physical panel slots for the tour; mode changes restore them without duplicate terms.
- One typed comparison produces flyer, notes, Markdown and PDF amounts. The $500 difference is per collected installment; the $18,000/$24,000 totals require all twelve illustrated installments to be collected. Benefits are requested, and cash remaining is explicitly before costs. Shared conditions apply to both paths. Closing gives a practical initial contribution and room to evolve. Notes end with six unresolved discussion items.
- The functional desktop source link remains as one engineering/source action. Redundant phone mastheads/colophons were removed. This is an explicit accepted disposition of the art recommendation, not an overlooked deletion.

## Candidate corrections and evidence

The unchanged published baseline failed 12 of 14 new targeted regressions. Candidate 1 then failed seven of 53 integrated browser checks: paper budget, short-phone text scale, desktop cash-heading scale, a notes-table selector, and reading-mode return behavior. Copy/spacing were tightened, the meaningful scale and resource thresholds retained, and the nested notes-table assertion corrected. Candidate 2 passed all 53 checks, but independent reviewers found peripheral text shards and stale keyboard focus overriding later reading gestures. Those were corrected rather than accepting the green suite as design signoff.

Two more regressions capture newly discovered input cases: scrolling away after keyboard focus reaches the notes link, and a held native touch whose movement starts after 450ms. The latter exposed an input-ownership timeout before finger release; ownership now survives held touch and subsequent momentum. The quick-return regression also exposed fractional alignment: a section beginning at 88.09375px was classified above the 88px reading line. The lookup samples one pixel inside the reading line, preserving the intended section after rounded native scroll offsets. The proposal header remains visible in reading mode, making the return control reachable without scrolling to the top.

The independent [design/commercial reviewer](round-2-candidate-design-review.md) accepted the complete composition after rejected iterations and fresh four-viewport captures. The [interaction reviewer](round-2-candidate-interaction-review.md) records the separate behavioral assessment. Raw evidence is ignored under `qa-artifacts/round-2-candidate/` and `qa-artifacts/review-round-2/`; public reports contain conclusions and reproducible checks, not private material.

Two PDF pages were rasterized and visually inspected: comparison columns, section flow, footer numbering and all six discussion items are complete, with no clipping or missing glyphs. The strict text check verifies the introduction, seven ordered sections, full comparison, 13 paragraphs, six items and discussion status. WebKit verified 29 reading positions at five sizes with no errors/failed requests; its known screenshot/backface limitation prevents claiming native visual certification.

Final local browser results and publication receipts are recorded in [IMPLEMENTATION.md](../IMPLEMENTATION.md) and `agentic-ui/local-verification.json` / `deployment-verification.json`. Physical iPhone, manual VoiceOver, field INP and a fresh business-reader comprehension exercise remain unperformed. These limits are not inferred from automated success.
