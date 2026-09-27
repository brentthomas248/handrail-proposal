# Round-three review: narrative, hiring credibility and portfolio

Independent review, September 27, 2026. Scope: the candidate's decision narrative, resume claims, evidence hierarchy and public GitHub presentation. This is an expert inspection, not a user study or a guarantee of hiring results.

## Basis and method

[NN/g's visual-hierarchy guidance](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) connects intended reading order to scale, contrast and grouping. For this project, that means the commercial premise and the candidate's strongest relevant evidence should be easy to find before supporting detail. [GitHub's profile README documentation](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) and [pinning guidance](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile) identify the public surfaces available for presenting selected work.

I independently rendered the current candidate at 1440 × 1000 and 390 × 844, opened every chapter through its controls, inspected both complete resume pages in web form, and captured the published GitHub profile while logged out. I compared the public wording with the private resume claim map and directly checked the author, merged state, body and changed files of BOXMEOUT-STELLA PR 44. No private evidence details are reproduced here.

I read the accepted reference and Handrail-brand records, then independently opened Telescope, Stripe Press, Exat and Igloo. Telescope's sparse message and Stripe Press's identifiable physical objects remain relevant. Exat loaded a typographic composition. The fresh Igloo capture remained at its loading scene, so it supplies no new visual evidence for this review. These are art-direction references, not proof of usability or permission to reproduce assets.

Evidence: `qa-artifacts/round-3/narrative/review.json`, desktop/phone opening and chapter captures, full resume captures, `github-profile.png`, and `references.json`. The screenshots capture the candidate before the findings below were addressed. GitHub bio and pins were being revised by the root agent, so their earlier state is not reported as a final defect.

## Findings

### N1 — P2: Put the strongest measurable resume result before its method

The NASGW bullet starts with rebuilding evaluation, then introduces XGBoost and the error comparison. In the rendered resume this requires reading into a dense multi-line bullet before discovering the strongest quantified result. This is an evidence-hierarchy improvement, not a false-claim or accessibility defect.

Suggested bounded correction: “Reduced holdout forecasting error by 24.1% relative to a seasonal-naive baseline (14.12% vs. 18.60% MAPE) using XGBoost and temporal train/validation/test splits.” Keep the exact baseline, holdout qualification and relative-error framing; do not imply revenue improvement, customer deployment or a 24.1-percentage-point improvement.

Verification: independently re-render the paragraph at desktop and phone widths, check the unchanged approved figures, and ensure the first clause makes the result discoverable without stripping the methodological qualification.

Status: **closed after implementation and independent rendered re-review.** The rebuilt bullet now leads with the 24.1% relative holdout-error result while retaining both MAPE figures, the baseline and temporal split qualification. Fresh desktop and phone captures show complete, readable text: `desktop-result-recheck.png` and `phone-result-recheck.png`.

### N2 — P2: Explain what the public invariant-testing contribution accomplished

The resume's second proof item says the merged contribution covers “contract invariants.” That names a technique but omits the specific refund/payout accounting issue it helped expose and fix. The public GitHub profile already communicates the concrete result, making the resume unnecessarily weaker than its evidence destination.

Suggested bounded correction: “Merged property-based tests and fixes for refund and payout accounting in BOXMEOUT-STELLA.” Keep the exact [merged PR](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) as the destination and preserve the word “contribution.” Do not claim authorship of the full platform or verified production financial impact.

Verification: match the revised wording to the merged PR body/files and re-render the proof item without adding a fourth dense evidence card.

Status: **closed after implementation and independent rendered re-review.** The proof item now names the refund and payout accounting work, preserves merged-contribution attribution and still links to PR 44. Fresh desktop and phone captures show the full revised text: `desktop-proof-recheck.png` and `phone-proof-recheck.png`.

## What withstands this review

- The visible opening states no base salary and commission following collections. The rust collection scene shows the same $10,000 installment under both rate choices, clearly labels money retained before costs, and disclaims the example as a forecast or Handrail pricing. It does not promise company-wide positive cash flow.
- The hire-first/client-first distinction, 15%/20% build rates, common 5% recurring rate, requested benefits and future-sales scope remain consistent. The closing makes contribution growth possible without asserting a settled future position.
- Resume and GitHub links are prominent in desktop and phone headers. Their placement is peripheral to the paper; they do not replace the primary commercial story.
- The resume clearly says “Prepared for Handrail.” Its subtle wordmark does not present Brent as a current Handrail employee. Education uses the confirmed 2025 bachelor's year and does not claim an earned master's degree.
- Proposed sales, engineering, customer support and forward-deployed contributions are separated from past experience. The text does not invent enterprise-sales performance, account ownership, customer counts, leadership titles or production scale.
- The public profile groups owned work separately from scoped contributions. Direct PR links, live work samples and honest AI-assisted development wording are more credible than a badge wall or an unsupported claim of broad platform ownership.
- The current composition does not need another visual reskin to fix N1 or N2. Those findings are local editorial changes with existing evidence.

## Boundary and disposition

No P0/P1 narrative or credential defect was found in the inspected candidate. N1 and N2 are implemented and independently verified in the rebuilt web resume. A fresh logged-out GitHub capture also confirms the revised business-workflow bio and the selected Handrail, DFB and forecasting pins in that order; scoped third-party contributions remain separately labeled in the README. See `qa-artifacts/round-3/narrative/recheck.json` and `github-profile-recheck.png`.

No narrative-review finding remains open. This review does not certify motion continuity, physical iPhone stability, manual assistive technology, PDF extraction order or the final hosted publication; the other specialists and root own those checks. Final approval of the visual result remains with the user.
