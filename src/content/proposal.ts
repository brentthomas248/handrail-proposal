/** Canonical business proposal. The flyer, notes and PDF read this source. */
export const proposal = {
  name: 'Handrail and Brent Showalter',
  title: 'Growth partnership proposal',
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
    description:
      'A practical way to bring me on board, with room for my contribution to grow.',
  },
  closing: {
    eyebrow: 'The beginning of a partnership.',
    headlineLines: ['Start here.', 'Grow together.'],
    startingPointTitle: 'Begin with new business.',
    startingPointBody:
      'I help bring in the clients that move Handrail forward, working closely with your team to turn opportunities into results.',
    partnershipTitle: 'Build from there.',
    partnershipBody:
      'As we work together, my contribution can grow with Handrail’s needs. We align on priorities, support and where I can add the most value.',
    proposalNote:
      'This is a starting point for discussion. We can shape the partnership together; Handrail prepares the final contract.',
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

export interface AgreementSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export const agreementIntro =
  'A practical way to begin a partnership: bring me on board without adding a base salary, connect commissions to collected customer revenue, and build from there. I want to help Handrail grow, with room for my contribution to evolve as we work together. These are proposed business terms for us to review and refine.';

export const agreementEndnote =
  'A proposal for discussion. Handrail will prepare the final agreement after we align on the business terms.';

export const agreementSections: AgreementSection[] = [
  {
    id: 'cash-flow',
    title: 'No base salary. Revenue comes first.',
    paragraphs: [
      'I am proposing a commission-led start with no base salary. Handrail receives the customer payment first; my commission follows that collection. There is no upfront commission on money the customer has not paid.',
      'If a customer pays over 12 months, my commission follows those 12 installments. That keeps the sales payout connected to incoming cash instead of creating an upfront commission bill.',
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
      'The additional five percentage points reward me for bringing in the business that makes it possible to bring me on board. The higher rate still follows collections, so the customer cash arrives before the commission is paid.',
    ],
  },
  {
    id: 'collections',
    title: 'A simple example of the cash timing',
    paragraphs: [
      'Illustration: a $120,000 build paid in 12 equal monthly installments brings Handrail $10,000 each month. At the client-first rate, $2,000 is commission and $8,000 remains with Handrail before delivery, benefits and other costs. At the hire-first rate, those amounts are $1,500 and $8,500.',
      `Recurring revenue follows the same principle: ${proposal.rates.recurring}% of a $2,000 recurring payment is $100 of commission, paid as that revenue is collected. These figures illustrate the proposed structure; they are not a forecast or a statement of Handrail's pricing.`,
    ],
  },
  {
    id: 'window',
    title: `A ${proposal.activationDays}-day opportunity`,
    paragraphs: [
      `Agree on the structure now, with a ${proposal.activationDays}-day window to bring in the qualifying client. Handrail can bring me on earlier at the hire-first rate. If I bring the qualifying client first within the window, the client-first rate applies.`,
      'If neither happens, Handrail can walk away without an obligation to hire. Before starting, we should agree on what counts as the qualifying client, how we confirm my credit for the sale, and how to handle a deal already in progress when the window ends.',
    ],
  },
  {
    id: 'support',
    title: 'A starting point with room to grow',
    paragraphs: [
      'I would start by helping bring in new business, working with the team on discovery, scoping and pricing. As we work together, we can shape my contribution around what Handrail needs to grow and agree on the support that makes that work possible.',
      'My request includes a benefits package when I join. We should confirm coverage where I live, the start date and my contribution, along with the tools and support I need and a practical policy for approved travel and selling expenses.',
    ],
  },
  {
    id: 'next-step',
    title: 'Align on the idea. Then write the agreement.',
    paragraphs: [
      'The decision now is how we begin a partnership that helps Handrail grow. This structure offers a starting point: no base salary, commissions tied to collected revenue, and a higher build rate if I bring the business that enables the hire. We can build on that foundation as we learn where I can contribute most.',
      'The next conversation can settle qualifying-client criteria, credited accounts, recurring commission duration, payment reporting and benefits. Handrail can then prepare the final contract. This proposal is open to discussion and adjustment.',
    ],
  },
];
