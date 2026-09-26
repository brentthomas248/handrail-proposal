import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { agreementSections, proposal } from '../src/content/proposal.ts';
import {
  evaluateActivation,
  renderAgreementMarkdown,
  type SaleEvents,
} from '../src/lib/agreement.ts';

function fullBuild(paymentDay: number, signedDay = paymentDay): SaleEvents {
  return {
    kind: 'full-build',
    credited: true,
    approvedAt: { day: signedDay, sequence: 0 },
    companySignedAt: { day: signedDay, sequence: 1 },
    customerSignedAt: { day: signedDay, sequence: 2 },
    firstPaymentClearedAt: { day: paymentDay, sequence: 3 },
  };
}

describe('proposed activation paths', () => {
  it('selects 15% for actual employment before the qualifying sale', () => {
    expect(
      evaluateActivation({
        actualEmploymentStart: { day: 20 },
        sale: fullBuild(25),
      }),
    ).toMatchObject({
      path: 'employment-first',
      buildRate: 15,
      recurringRate: 5,
      hireWithinBusinessDays: null,
    });
  });

  it('keeps the employment-first option available through day 90', () => {
    expect(
      evaluateActivation({ actualEmploymentStart: { day: 90 } }).buildRate,
    ).toBe(15);
    expect(
      evaluateActivation({ actualEmploymentStart: { day: 91 } }).path,
    ).toBe('not-activated');
  });

  it('selects 20% for a client first even when a later actual employment date exists', () => {
    expect(
      evaluateActivation({
        actualEmploymentStart: { day: 30 },
        sale: fullBuild(25),
      }),
    ).toMatchObject({
      path: 'client-first',
      buildRate: 20,
      recurringRate: 5,
      hireWithinBusinessDays: 10,
    });
  });

  it.each([
    { employmentSequence: 2, expected: 'employment-first' },
    { employmentSequence: 3, expected: 'client-first' },
    { employmentSequence: 4, expected: 'client-first' },
    { employmentSequence: undefined, expected: 'client-first' },
  ])(
    'uses actual same-day ordering and gives ties to the client-first path: $employmentSequence',
    ({ employmentSequence, expected }) => {
      const start =
        employmentSequence === undefined
          ? { day: 25 }
          : { day: 25, sequence: employmentSequence };
      expect(
        evaluateActivation({
          actualEmploymentStart: start,
          sale: fullBuild(25),
        }).path,
      ).toBe(expected);
    },
  );

  it('treats uncertain qualification ordering on the final day as a tie', () => {
    const sale = { ...fullBuild(25), customerSignedAt: { day: 25 } };
    expect(
      evaluateActivation({
        actualEmploymentStart: { day: 25, sequence: 0 },
        sale,
      }).path,
    ).toBe('client-first');
  });

  it('includes a qualifying sale on day 90', () => {
    expect(evaluateActivation({ sale: fullBuild(90) })).toMatchObject({
      path: 'client-first',
      withinPaymentGrace: false,
    });
  });

  it('includes day 120 collection for an approved fully signed day-90 contract', () => {
    expect(evaluateActivation({ sale: fullBuild(120, 90) })).toMatchObject({
      path: 'client-first',
      withinPaymentGrace: true,
    });
  });

  it('does not activate employment on collection after the grace period', () => {
    expect(evaluateActivation({ sale: fullBuild(121, 90) }).path).toBe(
      'not-activated',
    );
  });

  it.each(['companySignedAt', 'customerSignedAt', 'approvedAt'] as const)(
    'requires %s by day 90 to use payment grace',
    (field) => {
      const sale = { ...fullBuild(95, 90), [field]: { day: 91 } };
      expect(evaluateActivation({ sale }).path).toBe('not-activated');
    },
  );

  it('does not extend the discount into the grace period', () => {
    expect(
      evaluateActivation({
        actualEmploymentStart: { day: 91 },
        sale: fullBuild(95, 90),
      }),
    ).toMatchObject({ path: 'client-first', buildRate: 20 });
  });

  it('allows an actual day-90 hire to precede a grace-period qualification', () => {
    expect(
      evaluateActivation({
        actualEmploymentStart: { day: 90 },
        sale: fullBuild(95, 89),
      }).buildRate,
    ).toBe(15);
  });

  it.each([
    'approvedAt',
    'companySignedAt',
    'customerSignedAt',
    'firstPaymentClearedAt',
  ] as const)('does not qualify with missing %s', (field) => {
    const sale = fullBuild(25);
    delete sale[field];
    expect(evaluateActivation({ sale }).path).toBe('not-activated');
  });

  it('does not qualify pilots or uncredited opportunities', () => {
    expect(
      evaluateActivation({ sale: { ...fullBuild(25), kind: 'pilot' } }).path,
    ).toBe('not-activated');
    expect(
      evaluateActivation({ sale: { ...fullBuild(25), credited: false } }).path,
    ).toBe('not-activated');
  });

  it('qualifies at the last required condition rather than an early payment', () => {
    const sale = { ...fullBuild(20), customerSignedAt: { day: 25 } };
    expect(
      evaluateActivation({ actualEmploymentStart: { day: 23 }, sale }),
    ).toMatchObject({ path: 'employment-first', qualification: { day: 25 } });
  });

  it('does not mistake an empty record for a signed or expired agreement', () => {
    expect(evaluateActivation({})).toMatchObject({
      path: 'not-activated',
      buildRate: null,
      qualification: null,
    });
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid relative day %s',
    (day) => {
      expect(() =>
        evaluateActivation({ actualEmploymentStart: { day } }),
      ).toThrow(RangeError);
    },
  );

  it('rejects negative event sequence instead of silently choosing a rate', () => {
    expect(() =>
      evaluateActivation({
        sale: { ...fullBuild(25), approvedAt: { day: 1, sequence: -1 } },
      }),
    ).toThrow(RangeError);
  });
});

describe('one public agreement source', () => {
  it('keeps generated Markdown identical to the complete HTML/print content source', () => {
    const saved = readFileSync(
      new URL('../docs/proposed-agreement.md', import.meta.url),
      'utf8',
    );
    expect(saved).toBe(renderAgreementMarkdown());
    expect(agreementSections).toHaveLength(18);
    expect(new Set(agreementSections.map((section) => section.id)).size).toBe(
      18,
    );
  });

  it('keeps approved non-activation terms in the canonical source', () => {
    expect(proposal).toMatchObject({
      recurringTailMonths: 24,
      prospectTailDays: 90,
      commissionDueDays: 30,
    });
    const content = renderAgreementMarkdown();
    expect(content).toContain('all future credited sales');
    expect(content).toContain('does not permit a second 12-month deferral');
    expect(content).toContain('No negotiated base salary');
    expect(content).toContain('No blank item is treated as agreed');
  });
});
