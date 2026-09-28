/** Canonical business proposal. The flyer, notes and PDF read this source. */
export const proposal = {
  name: 'Handrail and Brent Showalter',
  title: 'Growth partnership proposal',
  notesTitle: 'Proposal notes',
  status: 'For discussion',
  version: '2026-09-27',
  parties: { company: 'Handrail', representative: 'Brent Showalter' },
  rates: { employmentFirst: 15, clientFirst: 20, recurring: 5 },
  initialSubscriptionMonths: 12,
  activationDays: 90,
  paths: { agreement: 'agreement/', pdf: 'handrail-proposed-agreement.pdf' },
} as const;

export const flyerCopy = {
  cover: {
    eyebrow: 'A proposal for working together.',
    headlineLines: ['Let’s grow', 'Handrail.'],
    statement: 'No base salary. Commission follows collected revenue.',
    description: 'Grow through new business, with no upfront commission.',
  },
  cash: {
    headline: 'Commission follows collections.',
  },
  paths: {
    sharedTerms: 'Both paths: no base salary and a requested benefits package.',
    scope: 'These rates cover all my future credited sales.',
    clientReason:
      'These rates apply to this client and all my future credited sales.',
  },
  closing: {
    eyebrow: 'The contribution.',
    headlineLines: ['New business.', 'Room to grow.'],
    startingPointTitle: 'Begin with new business.',
    startingPointBody:
      'I would start with new business, working with your team on discovery, scoping and pricing.',
    partnershipTitle: 'Build from there.',
    partnershipBody:
      'My contribution can evolve with Handrail’s needs as we agree on priorities and support.',
    proposalNote:
      'Let’s discuss the starting terms and open questions. Handrail prepares the final contract.',
  },
  finale: {
    headlineLines: ['Let’s', 'do this!'],
  },
} as const;

const commissionPhaseCopy = {
  rateLabel: `build + first ${proposal.initialSubscriptionMonths} subscription months`,
  recurringPrefix: 'then',
  recurringLabel: `recurring from service month ${proposal.initialSubscriptionMonths + 1}`,
} as const;

export const dealPathCopy = {
  employment: {
    label: 'Hire first',
    ...commissionPhaseCopy,
    description: 'Bring me on before I land the qualifying client.',
    note: 'On my credited sales from the start.',
  },
  client: {
    label: 'Client first',
    ...commissionPhaseCopy,
    description: 'I bring the qualifying client that enables the hire.',
    note: 'On that client and all my future credited sales.',
  },
} as const;

interface CollectionOutcome {
  rate: number;
  commission: number;
  remainingBeforeCosts: number;
  totalCommission: number;
}

const illustrationAssumptions = {
  buildTotal: 120_000,
  installments: 12,
  recurringCollection: 2_000,
} as const;
const collectedPerInstallment =
  illustrationAssumptions.buildTotal / illustrationAssumptions.installments;

function collectionOutcome(rate: number): CollectionOutcome {
  const commission = (collectedPerInstallment * rate) / 100;
  return {
    rate,
    commission,
    remainingBeforeCosts: collectedPerInstallment - commission,
    totalCommission: commission * illustrationAssumptions.installments,
  };
}

const hireFirst = collectionOutcome(proposal.rates.employmentFirst);
const clientFirst = collectionOutcome(proposal.rates.clientFirst);

export const collectionIllustration = {
  ...illustrationAssumptions,
  collectedPerInstallment,
  hireFirst,
  clientFirst,
  commissionDifference: clientFirst.commission - hireFirst.commission,
  totalCommissionDifference:
    clientFirst.totalCommission - hireFirst.totalCommission,
  subscriptionCommissions: {
    hireFirstInitial:
      (illustrationAssumptions.recurringCollection *
        proposal.rates.employmentFirst) /
      100,
    clientFirstInitial:
      (illustrationAssumptions.recurringCollection *
        proposal.rates.clientFirst) /
      100,
    ongoing:
      (illustrationAssumptions.recurringCollection * proposal.rates.recurring) /
      100,
  },
} as const;

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const money = (amount: number): string => dollars.format(amount);

/** Visible comparison copy shared by the flyer, notes and portable documents. */
export const collectionComparison = {
  assumption: `Build-only illustration: ${money(collectionIllustration.buildTotal)} in ${collectionIllustration.installments} equal monthly payments.`,
  collectedLabel: 'Collected per installment',
  collectedAmount: money(collectedPerInstallment),
  tableLabel: 'Build commission per collected installment',
  tableColumnLabel: 'Per collected installment',
  paths: [
    {
      id: 'hire',
      label: dealPathCopy.employment.label,
      rate: `${hireFirst.rate}%`,
    },
    {
      id: 'client',
      label: dealPathCopy.client.label,
      rate: `${clientFirst.rate}%`,
    },
  ],
  rows: [
    {
      id: 'commission',
      label: 'Build commission',
      amounts: [money(hireFirst.commission), money(clientFirst.commission)],
    },
    {
      id: 'remaining',
      label: 'Handrail keeps, before\u00a0costs',
      amounts: [
        money(hireFirst.remainingBeforeCosts),
        money(clientFirst.remainingBeforeCosts),
      ],
    },
  ],
  difference: `Client first: ${money(collectionIllustration.commissionDifference)} more build commission per installment.`,
  rule: 'Collect first. Pay commission second.',
  qualifier:
    'Illustration only. Cash before delivery, benefits and other costs—not profit.',
  total: `If all ${collectionIllustration.installments} illustrated installments are collected, total build commission is ${money(hireFirst.totalCommission)} under hire first or ${money(clientFirst.totalCommission)} under client first—a ${money(collectionIllustration.totalCommissionDifference)} build-only difference. Subscription commissions are separate.`,
  recurring: `On a ${money(collectionIllustration.recurringCollection)} subscription collection for service months 1–${proposal.initialSubscriptionMonths}, hire first earns ${money(collectionIllustration.subscriptionCommissions.hireFirstInitial)} (${proposal.rates.employmentFirst}%) and client first earns ${money(collectionIllustration.subscriptionCommissions.clientFirstInitial)} (${proposal.rates.clientFirst}%). From service month ${proposal.initialSubscriptionMonths + 1}, either path earns ${money(collectionIllustration.subscriptionCommissions.ongoing)} (${proposal.rates.recurring}%). The ${proposal.rates.recurring}% rate replaces the initial rate; the rates are not added together.`,
} as const;

export interface AgreementSection {
  id: string;
  title: string;
  paragraphs: string[];
  comparison?: boolean;
  items?: string[];
}

export const agreementIntro =
  'Proposed terms for beginning a partnership: no base salary, commission tied to collected revenue, and a requested benefits package. These terms are for discussion.';

export const agreementEndnote =
  'A proposal for discussion. Handrail will prepare the final agreement after we align on the business terms.';

function commissionTerms(initialRate: number): string {
  return `${initialRate}% of collected build fees and ${initialRate}% of collected subscription fees for each credited customer’s first ${proposal.initialSubscriptionMonths} service months, then ${proposal.rates.recurring}% of collected recurring fees from service month ${proposal.initialSubscriptionMonths + 1}`;
}

export const agreementSections: AgreementSection[] = [
  {
    id: 'cash-flow',
    title: 'No base salary. Revenue comes first.',
    paragraphs: [
      'I am proposing a commission-led start with no base salary. Handrail receives the customer payment first; my commission follows that collection. There is no upfront commission on money the customer has not paid.',
      'A benefits package is part of my request and a separate company cost. Delivery, operating costs and benefits still need to fit the economics of each sale.',
    ],
  },
  {
    id: 'hire-first',
    title: `Hire first: ${proposal.rates.employmentFirst}% initially, then ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If Handrail brings me on before I originate the qualifying client, the proposed rate is ${commissionTerms(proposal.rates.employmentFirst)}. This structure applies to all my credited sales under our relationship.`,
      'This is the lower initial rate in exchange for Handrail making the commitment first.',
    ],
  },
  {
    id: 'client-first',
    title: `Client first: ${proposal.rates.clientFirst}% initially, then ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If I bring the qualifying client first, the proposed rate is ${commissionTerms(proposal.rates.clientFirst)}. This structure applies to the triggering client and all future credited sales under our relationship.`,
      'Bringing in the client first enables Handrail to hire me. The higher initial rate on credited sales recognizes that commitment and the risk I take before joining. Customer payments still arrive before the corresponding commission.',
    ],
  },
  {
    id: 'collections',
    title: 'Illustrative collections and commission',
    comparison: true,
    paragraphs: [collectionComparison.total, collectionComparison.recurring],
  },
  {
    id: 'window',
    title: `A ${proposal.activationDays}-day window to begin`,
    paragraphs: [
      `Agree on the structure now, with a ${proposal.activationDays}-day window to bring in the qualifying client. Handrail can bring me on before that client arrives, at the hire-first rate. If I bring the qualifying client first within the window, the client-first rate applies.`,
      'If neither happens, Handrail can walk away without an obligation to hire. We should settle the qualifying-client criteria and treatment of deals in progress before starting.',
    ],
  },
  {
    id: 'support',
    title: 'A starting point with room to grow',
    paragraphs: [
      `${flyerCopy.closing.startingPointBody} ${flyerCopy.closing.partnershipBody}`,
      'My request includes a benefits package when I join. Before starting, we should confirm coverage where I live, the start date and my contribution. We should also agree on tools, support and a practical policy for approved travel and selling expenses.',
    ],
  },
  {
    id: 'next-step',
    title: 'For our next conversation',
    paragraphs: ['These points remain open for us to agree:'],
    items: [
      'Qualifying-client criteria.',
      'Credited accounts and how sales credit is confirmed.',
      'Recurring commission duration.',
      'Payment reporting and timing.',
      'Benefits coverage, start date and my contribution.',
      'Treatment of deals still in progress when the window ends.',
    ],
  },
];
