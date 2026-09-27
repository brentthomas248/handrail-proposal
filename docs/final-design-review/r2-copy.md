# Independent final design review — commercial copy and information grouping

**Score: 98/100. No P0, P1 or P2 findings.** Two minor clarity refinements remain. This is an independent design assessment of the rendered candidate, not a release certification.

## Candidate and scope

- Reviewed 27 September 2026 with headed Chromium 153.0.8010.12 against `http://127.0.0.1:4321/handrail-proposal/`.
- Fresh browser captures at desktop 1440×1000, phone 390×844, short phone 390×664 and small phone 320×740. Tour chapters were operated through their actual buttons. Ordinary reading, proposal notes and resume routes were captured independently. Original representative frames were inspected individually, not through a contact sheet.
- Both linked PDFs were fetched from the running candidate, every page rendered with Poppler and visually inspected. Both are two pages. A separate text comparison found all 28 expected notes blocks and all 57 expected resume blocks. Initial layout-mode PDF extraction interleaved resume columns; logical-order extraction resolved that extraction artifact. No missing resume text was found.
- Candidate HTML and both PDF hashes match `qa-artifacts/final-design/candidate/identity.json`. Main HTML SHA-256: `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33`; notes PDF: `f7877c9339e02c0ab48758a4b467381a1d7b304f830451b365b8a0b4c6d692ac`; resume PDF: `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.
- Brief sources: `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, `docs/local-workflow.md`, and the neutral final-review brief. No prior review reports or scores were read. Canonical proposal/resume content was inspected to verify the rendered wording. No app, build, publication or commit changes were made.
- Evidence root: `qa-artifacts/final-design/r2/copy/`. Capture records, version, text and hashes are in `capture-evidence.json`; copy comparison is in `pdf-copy-verification.json`.

## Scores

| Criterion | Score | Exact basis |
| --- | ---: | --- |
| Immediate proposition | 19/20 | The first reading scene promptly connects Handrail, a working relationship, new business, no base salary and collections. **−1 for C-R2-01:** the stationary folded introduction is less explicit, particularly on a short phone. |
| Compensation precision | 19/20 | The build/recurring distinction, 15%/5% versus 20%/5%, future credited-sale scope, requested benefits, installment timing, conditional full-build totals and before-costs qualification are correct. **−1 for C-R2-02:** the $500 comparison sentence omits what increases. |
| Concise persuasive language | 20/20 | The proposal supplies a reason for the higher rate without overstating financial benefit. The opening and closing leave room for a broader contribution; the notes list concrete questions for agreement without invented boilerplate. No actionable deduction. |
| Hierarchy and related-copy spacing | 20/20 | Both phone rate scenes retain the rate, recurring rate, triggering rationale, credited-sale scope and shared benefits/no-salary terms. The complete 90-day sequence and closing idea fit on short phones. Ordinary reading uses clear section breaks. PDF headings stay with their supporting text. No active commercial idea was clipped in inspected original frames. No actionable deduction. |
| Proposal/resume/notes consistency | 20/20 | Notes and PDF preserve all seven sections and the exact economics. Resume web/PDF preserve the 2025 bachelor's year, graduate coursework wording and distinction between past work and possible Handrail contribution. Public work is described as contributions, not ownership of the host products. No actionable deduction. |
| **Total** | **98/100** | **Two one-point deductions, neither a release blocker.** |

## Findings

### C-R2-01 — P3: The folded first impression is more evocative than explicit

**Observation and impact:** On the stationary first screen, the dominant words are “A beginning. Room to grow.” The no-base/collected-revenue wording exists but is very small on the 390×664 folded packet, and “new business” is introduced only after entering the first reading scene. An unfamiliar reader can identify a proposal, but needs the next action to understand the practical starting contribution. This is a small first-impression weakness within the deliberately compact reveal, not a demand to make the overview a full reading scene.

**Evidence:** `short-first-ten-seconds.png` and `first-ten-seconds.json` record a fresh visit after ten seconds with no scrolling. Compare `phone-1-overview.png` and `small-1-overview.png` with the much clearer `phone-2-the-beginning.png` and `small-2-the-beginning.png`.

**Bounded correction:** Consider changing the packet's dominant printed phrase to foreground “New business” or the proposal's working-together purpose while preserving the compact folded object and the existing reveal. Do not add a new role or more contract copy.

**Recheck:** At 390×664, the initial stationary frame should communicate the practical beginning in its dominant text without zooming, then retain the existing clear first reading scene. Confidence: medium; this is an editorial refinement, not observed user-study failure.

### C-R2-02 — P3: Name commission in the $500 difference sentence

**Observation and impact:** “Client first: $500 more per collected installment” follows a table with two different amounts: commission and cash Handrail keeps. The arithmetic is correct, but a skimming reader must infer that “more” refers to commission even though the immediately preceding row is retained cash, which decreases. Surrounding labels resolve the meaning; the sentence itself could be more precise.

**Evidence:** `desktop-3-cash-flow.png`, `phone-3-cash-flow.png`, `short-3-cash-flow.png`, `small-3-cash-flow.png`, and notes PDF page 2 (`notes-pdf-2.png`). The same wording is in the notes route and canonical `collectionComparison.difference`.

**Bounded correction:** “Client first: $500 more commission per collected installment.” Retain the before-costs qualification and collected-dollar basis.

**Recheck:** Inspect the updated sentence on the smallest cash-flow frame and notes PDF page 2; it must remain fully visible and explicitly identify commission. Confidence: high.

## Evidence supporting the score

- `desktop-4-the-two-paths.png`, `phone-4-hire-first.png`, `phone-5-client-first.png`, and the corresponding short/small frames show that 20% applies to the triggering client and all future credited sales. The 5% rate is clearly attached to recurring fees. Requested benefits are not presented as free to Handrail.
- `phone-6-the-window.png` and `short-6-the-window.png` keep the three related steps together. The final condition is no client **and** no hire by day 90; it ends the hiring commitment, not commission already earned or the whole working relationship.
- `phone-7-grow-together.png` and `short-7-grow-together.png` preserve the new-business starting point, room for contribution to evolve, invitation to discuss and Handrail's ownership of the final contract.
- `notes-pdf-1.png` and `notes-pdf-2.png` retain an explicit proposal status, separate benefits/company costs, illustrative pricing, conditional $18,000/$24,000 full-build totals, and the $2,000 recurring/$100 commission example. Page 1 has generous remaining space because the complete illustration begins page 2; that is an acceptable grouping choice, not lost content.
- `resume-pdf-1.png`, `resume-pdf-2.png`, `small-resume-top.png`, and `github-entry.png` present a coherent business-workflow engineering story. The profile's live rendered entry introduces selected authored work separately from public contributions. The linked [Rust testing PR](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) and [Playwright PR](https://github.com/Bitcoindefi/Open-Stellar/pull/430) show merged contributions by the named account. This check supports attribution and merge status, not an independent audit of every past employment or product claim.

## Principles and limits

[USWDS typography guidance](https://designsystem.digital.gov/components/typography/) informed the assessment of clear headings, comfortable effective size and whitespace that groups related content. It was used as contextual design guidance, not as a blanket font-size requirement for the folded overview. [WCAG text-spacing guidance](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) distinguishes author styling from resilience to user overrides; this review does not claim an independent text-spacing conformance test.

Tablet 768×1024 was omitted from this copy-focused pass. Continuous forward/reverse motion quality, runtime performance, reduced-motion/no-JavaScript behavior, keyboard/assistive-technology conformance and field behavior were not independently certified here. Physical iPhone and manual VoiceOver remain explicitly untested. No claim is made about the public deployment matching this local candidate. Credentialed Stagehand and Browserbase remain omitted under the approved local workflow.
