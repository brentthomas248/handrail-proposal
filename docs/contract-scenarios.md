# Contract scenario acceptance

These scenarios verify the unsigned proposal, not legal enforceability. The final signed agreement supplies actual dates and the time zone. Day 1 is the effective date; day 90 and applicable tail/grace end dates are inclusive. Business days exclude weekends and U.S. federal holidays.

The canonical contract is `src/content/proposal.ts`. HTML, print views and the PDF must use its exports. `docs/proposed-agreement.md` is generated: run `node --experimental-strip-types scripts/generate-contract.ts`, or add `--check` to detect stale content. Edit the typed source rather than the generated document. The scenario examples intentionally state expected values independently so changes to accepted terms require a deliberate test review.

`evaluateActivation` in `src/lib/agreement.ts` accepts relative integer days and optional same-day sequence numbers. It never infers a signed agreement, current expiry or actual employment from a clock. An unknown within-day order follows the proposed 20% tie rule. The executable tests cover activation and source consistency; the remaining scenario table documents contract requirements for human review and later rendering checks.

## Rate and activation

| Scenario | Expected result |
| --- | --- |
| Actual employment day 20; qualifying sale day 25 | 15% build / 5% recurring. |
| Offer day 20, planned start day 30; qualification day 25 | 20% / 5%; employment due within ten business days of qualification. |
| Both events simultaneous, or reliable order cannot be established | Proposed tie rule: 20%. |
| Actual employment starts day 90 before qualification | 15% remains available. |
| Qualification day 90 before employment | 20%; hiring duty survives expiry. |
| Contract approved and signed by both customer and Company day 90; payment clears day 120 | Grace qualifies at 20%; hiring due within ten business days. |
| Same contract, payment clears day 121 | No grace-based hiring duty; assess the prospect tail independently. |
| First signature day 90; second day 91 | No grace eligibility; assess the prospect tail independently. |
| Only a paid pilot, unpaid contract or failed payment | No full-build qualification. |
| First payment clears before final signature | Qualification occurs at the final signature, assuming approval and attribution are satisfied. |
| No activation or eligible grace contract | Hiring duty expires; accrued/protected compensation and expenses survive. |
| Company announces an employment offer after expiry | Does not retroactively select 15%; new agreement needed for a new employment arrangement. |

## Protected late sales

| Scenario | Expected result |
| --- | --- |
| Acknowledged active prospect at expiry; full-build qualification within 90 days after expiry; no employment | Proposed protection: 20% build, 5% recurring for 24 months from qualification; no hiring duty outside payment grace. |
| Qualification exactly on prospect-tail end date | Included. |
| Prospect-tail qualification one day late, no other protection | No commission under this tail. |
| Same sale qualifies under payment grace and prospect tail | One commission only; payment grace still creates the hiring duty. |
| Company internally reassigns an already credited opportunity | Established attribution survives. |
| Proposed split was never agreed in writing before signing | Do not silently reduce commission; resolve and document attribution. |

## Payment and survival

| Scenario | Expected result |
| --- | --- |
| $6,000 build collection on 20% path | $1,200 due within 30 calendar days, or earlier legal deadline. |
| $6,000 build collection on 15% path | $900 due on the same timing rule. |
| $2,000 eligible recurring collection | $100 recurring commission. |
| $72,000 build paid in twelve $6,000 installments on 20% path | Twelve $1,200 commissions following collections; $14,400 total if all installments collected. |
| $72,000 build paid upfront on 20% path | $14,400 follows that collection; no second 12-month deferral. |
| Employment ends before credited signed build is fully paid | Selected build rate survives on remaining collections. |
| Protected recurring service in month 24 collected after protection ends | 5% remains payable. |
| Recurring service entirely after the protected period | No tail commission. |
| Annual recurring payment spans a protection boundary | Allocate by service days unless invoice specifies more precisely; commission only on eligible portion. |
| Account is renewed or serviced by another employee | Existing credited recurring protection survives. |
| Genuine $1,000 refund of a build fee at 20% | At most $200 related commission adjustment, documented and only as lawful. |
| Hosting costs rise, or account moves to an affiliate | No unilateral reduction of the agreed base or evasion of collection. |
| Company announces lower rates or Brent misses a later band | Existing agreement does not automatically change; signed amendment required. |

## Content and legal-completion checks

- HTML and PDF must express the same rates, clocks, triggering conditions and proposed defaults from the eventual typed content source.
- The 90-day discount must never become 30 days; the 20% rate must never be limited to the first client; recurring protection must never be presented as lifetime.
- The first payment must be cleared, not merely invoiced or promised. Both signatures and written Company approval are required.
- No countdown begins before execution. No interaction with the public site accepts or signs an agreement.
- Missing benefits, work state, legal names, legal entity, status or pay requirements must remain visible completion items; no fabricated defaults.
- “No negotiated base” must preserve mandatory wage/payroll obligations in both phases. Do not label remote phone/internet selling automatically exempt outside sales.
- Employment activation is a commitment to start, not a guaranteed employment duration or guaranteed benefit eligibility date.
- The no-hire tail, tie rule, anti-revocation term and administrative deadlines must be presented as proposed terms, not previously accepted Company concessions.
- Public content contains no private company finances, client details, correspondence or personal income floor.

## Official legal background

The draft preserves mandatory rights without choosing a work-state classification. Actual duties and the working relationship matter; a contractor label or remote arrangement is insufficient.

- [U.S. Department of Labor: outside-sales exemption](https://www.dol.gov/agencies/whd/fact-sheets/17f-overtime-outside-sales)
- [Internal Revenue Service: contractor or employee](https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee)
- [U.S. Department of Labor: FLSA reference guide](https://www.dol.gov/agencies/whd/compliance-assistance/handy-reference-guide-flsa)

Reviewed September 26, 2026. State-specific implementation and current legal requirements must be resolved for the completed agreement; these tests do not establish enforceability.
