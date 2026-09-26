/** Canonical public proposal. HTML, print views and generated Markdown read this source. */
export const proposal = {
  name: 'Handrail × Brent Showalter',
  title: 'Conditional employment and commission agreement',
  status: 'Unsigned proposal',
  version: '2026-09-26',
  parties: { company: 'Handrail', representative: 'Brent Showalter' },
  rates: { employmentFirst: 15, clientFirst: 20, recurring: 5 },
  activationDays: 90,
  graceDays: 30,
  prospectTailDays: 90,
  recurringTailMonths: 24,
  commissionDueDays: 30,
  hireBusinessDays: 10,
  attributionResponseBusinessDays: 3,
  breachCureBusinessDays: 10,
  expenseDueDays: 30,
  paths: { agreement: 'agreement/', pdf: 'handrail-proposed-agreement.pdf' },
} as const;

export interface AgreementSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export const completionItems: string[] = [
  'Employer legal name and address, and authorized signatory',
  "Brent's legal name and notice address",
  'Effective-date convention and time zone',
  'Actual work state; pre-activation status and lawful pay',
  'Employee title, classification, schedule and required compensation',
  'Benefits plan documents, eligibility, coverage, contributions and start dates',
  'Tools, approved expense budget and approval contact',
  'Account-registration system and initial exceptions',
  'Technical/pricing contacts and response times',
  'Notice addresses and termination/notice terms',
  'Governing law and venue',
  'Agreed intellectual-property exceptions',
];

export const agreementIntro = `This document proposes terms between ${proposal.parties.company} (legal entity to be verified and completed, “Company”) and ${proposal.parties.representative} (legal name to be completed, “Brent”). Nothing on the accompanying website, including viewing, downloading or interacting with it, accepts this proposal or creates a signature. Complete Section 18 and obtain appropriate employment-law review before executing a final agreement. The provisions below are proposed terms, not representations that either party has accepted them.`;

export const agreementSections: AgreementSection[] = [
  {
    id: 'purpose',
    title: `Purpose and effective date`,
    paragraphs: [
      `The parties propose a defined opportunity to begin employment through either an employment-first or client-first path. The effective date is the date the last party signs the completed agreement. That date is day 1. The activation window ends at 11:59 p.m. on day ${proposal.activationDays} in the time zone specified in Section 18. “Business day” means Monday through Friday, excluding U.S. federal holidays.`,
    ],
  },
  {
    id: 'employment-first',
    title: `Employment-first path — ${proposal.rates.employmentFirst}% build / ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If actual employment begins within the activation window and strictly before a qualifying sale, Brent receives ${proposal.rates.employmentFirst}% of collected credited build fees and ${proposal.rates.recurring}% of collected credited recurring fees. This option remains available throughout all ${proposal.activationDays} days. An offer, proposed start date or retroactively dated payroll entry does not establish an earlier actual start. Employment begins when Brent actually starts the agreed employee duties with the Company's authorization.`,
    ],
  },
  {
    id: 'client-first',
    title: `Client-first path — ${proposal.rates.clientFirst}% build / ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If a qualifying sale occurs first within the activation window or the payment grace in Section 5, the Company must begin Brent's employment within ${proposal.hireBusinessDays} business days after qualification. The rate is ${proposal.rates.clientFirst}% of credited build collections for the triggering sale and all future credited sales under this relationship, plus ${proposal.rates.recurring}% of credited recurring collections. The triggering collection is commissionable immediately under these terms; late onboarding does not postpone or reduce commission rights.`,
      `Proposed tie rule: if qualification and actual employment start simultaneously, or reliable records cannot establish that employment started first, the ${proposal.rates.clientFirst}% path applies. A later performance band or year-end result does not automatically change the selected rate. Employment is not deemed to have begun merely because a qualification condition has occurred.`,
    ],
  },
  {
    id: 'qualification',
    title: `Qualifying sale and attribution`,
    paragraphs: [
      `A qualifying sale requires all of the following: an opportunity registered and credited to Brent in writing; Company approval of the full-build scope, pricing and payment schedule; a customer contract signed by both customer and Company; and clearance of the first scheduled customer payment. The qualification time is when the last condition occurs. Pilots, demonstrations, letters of intent and unpaid contracts do not qualify. No additional minimum deal price is implied.`,
      `Brent registers the prospect, introduction and relevant work in the agreed system. The Company identifies any existing ownership or proposed split within ${proposal.attributionResponseBusinessDays} business days. Splits require written agreement before the customer contract is signed. Silence is not approval, but the Company must resolve attribution promptly and give reasons for rejection. Internal reassignment, account renaming or changing the delivery team does not remove established credit.`,
    ],
  },
  {
    id: 'window-and-grace',
    title: `Payment grace and expiry`,
    paragraphs: [
      `An approved full-build contract signed by both parties by day ${proposal.activationDays} may qualify if its first scheduled payment clears within ${proposal.graceDays} calendar days after window expiry. This grace does not extend the employment-first discount or cover contracts missing a signature at expiry.`,
      `If neither path activates, the hiring commitment expires, subject only to that payment grace. No later sale revives the hiring duty outside the grace. Earned and protected commissions, approved expenses and other expressly surviving rights remain payable. The Company must not deliberately delay approval, signing, invoicing or collection to defeat established credit or an otherwise satisfied trigger.`,
    ],
  },
  {
    id: 'protected-prospects',
    title: `Protected prospects when employment never begins`,
    paragraphs: [
      `Proposed protection: a registered, Company-acknowledged active prospect at expiry is protected for ${proposal.prospectTailDays} calendar days after expiry. Brent supplies a written pipeline record at expiry, and the Company promptly identifies disputed entries with reasons. A prospect qualifies for this protection only if it satisfies the full-build sale conditions during that ${proposal.prospectTailDays}-day tail.`,
      `If employment never begins, such a sale earns ${proposal.rates.clientFirst}% of collected build fees and ${proposal.rates.recurring}% of recurring fees attributable to the ${proposal.recurringTailMonths} months beginning at its qualification. Later collection of those protected fees remains commissionable. This commission protection creates no obligation to hire outside Section 5. Duplicate protections never generate duplicate commission.`,
    ],
  },
  {
    id: 'collections',
    title: `Commission base and payment`,
    paragraphs: [
      `“Build fees” are approved implementation or development charges; “recurring fees” are ongoing subscription, service or support charges. Their allocation is recorded in the approved customer order. Commission applies to cash actually received and retained for credited fees, excluding separately stated sales taxes and actual refunds of the corresponding charges. Internal labor, hosting, overhead and delivery costs do not reduce the base. Any separately billed third-party pass-through exclusion requires written agreement before sale.`,
      `Pay each commission within ${proposal.commissionDueDays} calendar days after collection, or earlier when mandatory law requires. A 12-month customer installment schedule produces proportional commission payments as installments arrive; it does not permit a second 12-month deferral after an upfront customer payment. Collection through an affiliate, successor or payment processor counts when received on the Company's behalf.`,
      `Provide a monthly statement showing credited accounts, invoices, fee allocation, collections, adjustments, rate and payment. Brent may request supporting records reasonably necessary to verify compensation, subject to customer confidentiality. A genuine refund adjustment is limited to the commission on the refunded fee, documented, and applied only as permitted by law; no penalty or unrelated setoff applies.`,
    ],
  },
  {
    id: 'recurring-and-deferred-rights-after-employment',
    title: `Recurring and deferred rights after employment`,
    paragraphs: [
      `On credited accounts, ${proposal.rates.recurring}% recurring commission applies from the qualifying collection through employment and for ${proposal.recurringTailMonths} months after separation, regardless of who services the account. Protection includes renewals and recurring price changes on those accounts. Separate new builds require their own attribution; this clause does not authorize post-separation selling.`,
      `The underlying service period determines recurring eligibility. Allocate payments spanning a protection boundary proportionally by service days unless the invoice specifies a more precise allocation. Fees for protected periods remain payable when collected later. Fees attributable entirely to periods after protection ends do not qualify. Deferred build collections on credited signed contracts retain the selected build rate after separation, without an arbitrary collection cutoff. Section 6 governs when employment never begins.`,
    ],
  },
  {
    id: 'responsibilities',
    title: `Duties, support and authority`,
    paragraphs: [
      `Brent's role covers prospecting, discovery, relationship development, proposal coordination and closing. The Company supplies a named technical/scoping partner, approved sales materials, pricing authority and an account handoff process. Delivery, implementation and continuing support remain Company responsibilities unless a separate written scope assigns duties to Brent. Material changes to those duties require discussion and written agreement.`,
      `Only authorized Company representatives may approve customer scope, discounts, contractual promises or security commitments. Brent cannot bind the Company or make unsupported technical claims. The parties establish practical response times and escalation contacts in Section 18.`,
    ],
  },
  {
    id: 'lawful-compensation',
    title: `Status, pay requirements and availability`,
    paragraphs: [
      `No negotiated base salary is proposed. This does not waive any applicable minimum wage, overtime, payroll, recordkeeping, expense-reimbursement or other mandatory rights. The Company implements compliant compensation for the actual work location and duties; commissions cannot substitute for legally required payments when insufficient.`,
      `Before work begins, the parties complete the pre-activation status and compensation arrangement. A contractor label does not determine legal status. No exclusive full-time unpaid trial is required. Before employment, Brent controls availability and may pursue unrelated work consistent with confidentiality. Any employee schedule or outside-work limits must be lawful and stated in Section 18.`,
    ],
  },
  {
    id: 'benefits-and-expenses',
    title: `Benefits, remote work and expenses`,
    paragraphs: [
      `Employment is remote, with sales travel as agreed. The Company's benefits package accompanies employment subject to the completed eligibility, contribution and commencement schedule. No particular insurance plan, coverage territory, employer contribution or waiting period is represented here. Complete those details before signing; “benefits” alone is insufficient.`,
      `The Company reimburses reasonable, documented, preapproved selling expenses within ${proposal.expenseDueDays} calendar days of submission, subject to any earlier mandatory deadline. The budget, approval contact, travel rules and required tools are completed in Section 18. Brent is not required to fund unapproved Company travel.`,
    ],
  },
  {
    id: 'termination',
    title: `Duration and ending the relationship`,
    paragraphs: [
      `Proposed commitment: the Company may not revoke the ${proposal.activationDays}-day conditional hiring commitment for convenience. A material breach may end it after written notice and ${proposal.breachCureBusinessDays} business days to cure where curable, subject to mandatory law. Brent may withdraw by written notice. Withdrawal ends prospective hiring rights but does not erase accrued or expressly protected compensation; the agreed termination date substitutes for expiry when applying Section 6.`,
      `After employment begins, no minimum employment duration is promised. Termination and notice requirements must conform to the completed employment terms and applicable law. Neither separation nor an alleged breach automatically forfeits earned compensation. Sections governing compensation survival, records, approved expenses, confidentiality, ownership and dispute resolution survive as relevant.`,
    ],
  },
  {
    id: 'confidentiality',
    title: `Confidentiality and existing relationships`,
    paragraphs: [
      `Each party protects the other's nonpublic business information, uses it only for this relationship and returns or securely deletes it when reasonably requested, except legally required records. Public information, independently developed information and lawfully received information are excluded. Nothing restricts legally protected disclosures or reporting. Existing clients and unrelated work remain Brent's, subject to avoiding misuse of Company information and agreed conflicts.`,
    ],
  },
  {
    id: 'ownership',
    title: `Work product and pre-existing materials`,
    paragraphs: [
      `Company-specific work created within paid duties belongs to the Company to the extent permitted by law. Brent retains pre-existing code, tools, methods and unrelated projects. If those materials are knowingly incorporated into deliverables with written approval, the Company receives a nonexclusive license sufficient to use the deliverable; ownership does not transfer. Third-party licenses remain applicable. Any broader IP assignment requires a separate written agreement.`,
    ],
  },
  {
    id: 'notices',
    title: `Records, notices and disagreements`,
    paragraphs: [
      `Use the designated written notice addresses in Section 18. The parties first discuss a disputed attribution, statement or obligation promptly and in good faith; undisputed payments continue. No internal discussion requirement waives statutory deadlines or access to agencies or courts. Governing law and venue are completion items and cannot remove mandatory protections applicable to the work. No mandatory arbitration is created by this draft.`,
    ],
  },
  {
    id: 'amendments',
    title: `Changes, transfer and entire agreement`,
    paragraphs: [
      `After execution, this agreement replaces the prior MOU and compensation-band/salary ladder only for this relationship, without releasing already accrued rights. Amendments require both parties' written signatures. No unilateral policy changes a commission rate or protected account right. A successor taking the business must assume outstanding obligations; a transfer does not erase them. If a provision is unenforceable, the remaining provisions continue to the extent lawful.`,
    ],
  },
  {
    id: 'execution',
    title: `Execution`,
    paragraphs: [
      `The final agreement may be signed in counterparts through an agreed signature process. It becomes effective only after Section 18 is completed and both authorized parties sign. This website and its downloadable proposal provide no acceptance or signature facility. Execution fields must identify the verified employer, authorized signatory, Brent's legal name and each signature date.`,
    ],
  },
  {
    id: 'completion',
    title: `Completion schedule`,
    paragraphs: [
      `Complete before execution: ${completionItems.join('; ')}. No blank item is treated as agreed, waived or supplied by the website.`,
    ],
  },
];
