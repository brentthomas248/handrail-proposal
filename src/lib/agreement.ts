import {
  agreementIntro,
  agreementSections,
  proposal,
} from '../content/proposal.ts';

/** Day 1 is execution day. Sequence orders actual events within one day, if known. */
export interface EventTime {
  day: number;
  sequence?: number;
}

export interface SaleEvents {
  kind: 'full-build' | 'pilot';
  credited: boolean;
  approvedAt?: EventTime;
  companySignedAt?: EventTime;
  customerSignedAt?: EventTime;
  firstPaymentClearedAt?: EventTime;
}

export interface ActivationInput {
  /** Actual commencement only; offers and planned starts must not be passed here. */
  actualEmploymentStart?: EventTime;
  sale?: SaleEvents;
}

export interface ActivationResult {
  path: 'employment-first' | 'client-first' | 'not-activated';
  buildRate: number | null;
  recurringRate: number | null;
  qualification: EventTime | null;
  withinPaymentGrace: boolean;
  hireWithinBusinessDays: number | null;
}

function validateTime(time: EventTime): void {
  if (!Number.isSafeInteger(time.day) || time.day < 1) {
    throw new RangeError(
      'Event day must be a positive safe integer; execution is day 1.',
    );
  }
  if (
    time.sequence !== undefined &&
    (!Number.isSafeInteger(time.sequence) || time.sequence < 0)
  ) {
    throw new RangeError(
      'Event sequence must be a nonnegative safe integer when supplied.',
    );
  }
}

function qualifyingTime(sale: SaleEvents | undefined): EventTime | null {
  if (!sale || sale.kind !== 'full-build' || !sale.credited) return null;
  const {
    approvedAt,
    companySignedAt,
    customerSignedAt,
    firstPaymentClearedAt,
  } = sale;
  if (
    !approvedAt ||
    !companySignedAt ||
    !customerSignedAt ||
    !firstPaymentClearedAt
  )
    return null;

  const times = [
    approvedAt,
    companySignedAt,
    customerSignedAt,
    firstPaymentClearedAt,
  ];
  const day = Math.max(...times.map((time) => time.day));
  const lastDayEvents = times.filter((time) => time.day === day);
  const sequences = lastDayEvents.map((time) => time.sequence);
  if (
    sequences.every((sequence): sequence is number => sequence !== undefined)
  ) {
    return { day, sequence: Math.max(...sequences) };
  }
  return { day };
}

function strictlyEarlier(first: EventTime, second: EventTime): boolean {
  if (first.day !== second.day) return first.day < second.day;
  return (
    first.sequence !== undefined &&
    second.sequence !== undefined &&
    first.sequence < second.sequence
  );
}

/**
 * Selects the proposed path from recorded events, not from the wall clock.
 * Inclusive relative days avoid timezone guesses before the execution schedule exists.
 * Not-activated does not imply expiry: the caller may supply an incomplete event record.
 * This is an explanation model; it does not determine legal employment or create assent.
 */
export function evaluateActivation(input: ActivationInput): ActivationResult {
  const { actualEmploymentStart, sale } = input;
  const suppliedTimes = [
    actualEmploymentStart,
    sale?.approvedAt,
    sale?.companySignedAt,
    sale?.customerSignedAt,
    sale?.firstPaymentClearedAt,
  ];
  for (const time of suppliedTimes) if (time) validateTime(time);

  const qualification = qualifyingTime(sale);
  const withinPaymentGrace = Boolean(
    qualification &&
    sale?.approvedAt &&
    sale.companySignedAt &&
    sale.customerSignedAt &&
    qualification.day > proposal.activationDays &&
    qualification.day <= proposal.activationDays + proposal.graceDays &&
    sale.approvedAt.day <= proposal.activationDays &&
    sale.companySignedAt.day <= proposal.activationDays &&
    sale.customerSignedAt.day <= proposal.activationDays,
  );
  const qualifiesInWindow =
    qualification !== null &&
    (qualification.day <= proposal.activationDays || withinPaymentGrace);
  const employmentFirst =
    actualEmploymentStart !== undefined &&
    actualEmploymentStart.day <= proposal.activationDays &&
    (qualification === null ||
      strictlyEarlier(actualEmploymentStart, qualification));

  if (employmentFirst) {
    return {
      path: 'employment-first',
      buildRate: proposal.rates.employmentFirst,
      recurringRate: proposal.rates.recurring,
      qualification,
      withinPaymentGrace,
      hireWithinBusinessDays: null,
    };
  }
  if (qualifiesInWindow) {
    return {
      path: 'client-first',
      buildRate: proposal.rates.clientFirst,
      recurringRate: proposal.rates.recurring,
      qualification,
      withinPaymentGrace,
      hireWithinBusinessDays: proposal.hireBusinessDays,
    };
  }
  return {
    path: 'not-activated',
    buildRate: null,
    recurringRate: null,
    qualification,
    withinPaymentGrace: false,
    hireWithinBusinessDays: null,
  };
}

/** Mirrors the complete content source; no separate contract prose is maintained. */
export function renderAgreementMarkdown(): string {
  const sections = agreementSections.map(
    (section, index) =>
      `## ${index + 1}. ${section.title}\n\n${section.paragraphs.join('\n\n')}`,
  );
  return (
    [
      '<!-- Generated from src/content/proposal.ts. Run node --experimental-strip-types scripts/generate-contract.ts. -->',
      `# ${proposal.title}`,
      `**${proposal.status} · ${proposal.version} · For discussion**`,
      agreementIntro,
      ...sections,
    ].join('\n\n') + '\n'
  );
}
