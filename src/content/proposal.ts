/** Canonical business proposal. The flyer, notes and PDF read this source. */
export const proposal = {
  name: 'Handrail and Brent Showalter',
  title: 'Growth partnership proposal',
  notesTitle: 'Proposal notes',
  status: 'For discussion',
  version: '2026-09-26',
  parties: { company: 'Handrail', representative: 'Brent Showalter' },
  rates: { employmentFirst: 15, clientFirst: 20, recurring: 5 },
  activationDays: 90,
  paths: { agreement: 'agreement/', pdf: 'handrail-proposed-agreement.pdf' },
} as const;

export const flyerCopy = {
  cover: {
    eyebrow: 'A proposal for working together.',
    headlineLines: ['Let’s grow', 'Handrail.'],
    statement: 'No base salary. Commission follows collected revenue.',
    description: 'A partnership built around Handrail’s growth.',
  },
  cash: {
    headline: 'Commission follows collections.',
    intro: 'No base salary. Customer money arrives before commission.',
  },
  paths: {
    sharedTerms: 'Both paths: no base salary and a requested benefits package.',
    scope: 'The selected rate covers all my future credited sales.',
    clientReason: `The ${proposal.rates.clientFirst}% build rate rewards bringing the qualifying client first and applies to that client and my future credited sales.`,
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
} as const;

export const dealPathCopy = {
  employment: {
    label: 'Hire first',
    description: 'Bring me on before I land the qualifying client.',
    note: 'On my credited sales from the start.',
  },
  client: {
    label: 'Client first',
    description: 'I bring the paying client that makes hiring possible.',
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
  recurringCommission:
    (illustrationAssumptions.recurringCollection * proposal.rates.recurring) /
    100,
} as const;

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const money = (amount: number): string => dollars.format(amount);

/** Visible comparison copy shared by the flyer, notes and portable documents. */
export const collectionComparison = {
  assumption: `Illustration: ${money(collectionIllustration.buildTotal)} build, ${collectionIllustration.installments} equal monthly installments.`,
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
      label: 'Handrail remaining before costs',
      amounts: [
        money(hireFirst.remainingBeforeCosts),
        money(clientFirst.remainingBeforeCosts),
      ],
    },
  ],
  difference: `${money(collectionIllustration.commissionDifference)} more commission per collected installment under client first.`,
  rule: 'Customer payment arrives before the related commission is paid.',
  qualifier:
    'Before delivery, benefits and other costs. Illustration only; not a forecast or Handrail pricing.',
  total: `If all ${collectionIllustration.installments} illustrated installments are collected, total build commission is ${money(hireFirst.totalCommission)} under hire first or ${money(clientFirst.totalCommission)} under client first—a ${money(collectionIllustration.totalCommissionDifference)} difference.`,
  recurring: `At either path’s ${proposal.rates.recurring}% recurring rate, a ${money(collectionIllustration.recurringCollection)} recurring collection produces ${money(collectionIllustration.recurringCommission)} of commission.`,
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
    title: `Hire first: ${proposal.rates.employmentFirst}% build + ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If Handrail brings me on before I originate the qualifying client, the proposed rate is ${proposal.rates.employmentFirst}% of collected build fees and ${proposal.rates.recurring}% of collected recurring fees on my credited sales.`,
      'This is the lower build rate in exchange for Handrail making the commitment first. There is still no base salary in this proposal.',
    ],
  },
  {
    id: 'client-first',
    title: `Client first: ${proposal.rates.clientFirst}% build + ${proposal.rates.recurring}% recurring`,
    paragraphs: [
      `If I bring the qualifying client first, Handrail brings me on at ${proposal.rates.clientFirst}% of collected build fees and ${proposal.rates.recurring}% of collected recurring fees. That rate applies to the triggering client and all future credited sales under our relationship.`,
      `The additional ${proposal.rates.clientFirst - proposal.rates.employmentFirst} percentage points are proposed for bringing in the qualifying client before the hire. The higher rate still follows collections.`,
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
    title: `A ${proposal.activationDays}-day opportunity`,
    paragraphs: [
      `Agree on the structure now, with a ${proposal.activationDays}-day window to bring in the qualifying client. Handrail can bring me on earlier at the hire-first rate. If I bring the qualifying client first within the window, the client-first rate applies.`,
      'If neither happens, Handrail can walk away without an obligation to hire. We should settle the qualifying-client criteria and treatment of deals in progress before starting.',
    ],
  },
  {
    id: 'support',
    title: 'A starting point with room to grow',
    paragraphs: [
      `${flyerCopy.closing.startingPointBody} ${flyerCopy.closing.partnershipBody}`,
      'My request includes a benefits package when I join. We should confirm coverage where I live, the start date and my contribution, along with the tools and support I need and a practical policy for approved travel and selling expenses.',
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
