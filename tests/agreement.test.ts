import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  agreementEndnote,
  agreementIntro,
  agreementSections,
  collectionComparison,
  collectionIllustration,
  proposal,
} from '../src/content/proposal.ts';
import { renderAgreementMarkdown } from '../src/lib/agreement.ts';

describe('one public proposal source', () => {
  it('keeps the generated notes identical to the HTML and PDF content source', () => {
    const saved = readFileSync(
      new URL('../docs/proposed-agreement.md', import.meta.url),
      'utf8',
    );
    expect(saved).toBe(renderAgreementMarkdown());
  });

  it('preserves all proposal paragraphs in order in the portable document', () => {
    const content = renderAgreementMarkdown();
    const chunks = [
      agreementIntro,
      ...agreementSections.flatMap((section, index) => [
        `${index + 1}. ${section.title}`,
        ...section.paragraphs,
      ]),
      agreementEndnote,
    ];
    let cursor = 0;
    for (const chunk of chunks) {
      const position = content.indexOf(chunk, cursor);
      expect(position).toBeGreaterThanOrEqual(cursor);
      cursor = position + chunk.length;
    }
  });

  it('gives each reading section a unique link target', () => {
    expect(new Set(agreementSections.map((section) => section.id)).size).toBe(
      agreementSections.length,
    );
    for (const section of agreementSections) {
      expect(section.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    }
  });

  it('uses the proposed rates consistently in the installment illustration', () => {
    const illustration = collectionIllustration;
    expect(illustration.buildTotal).toBe(120_000);
    expect(illustration.installments).toBe(12);
    expect(illustration.collectedPerInstallment).toBe(10_000);
    expect(illustration.hireFirst).toEqual({
      rate: proposal.rates.employmentFirst,
      commission: 1_500,
      remainingBeforeCosts: 8_500,
      totalCommission: 18_000,
    });
    expect(illustration.clientFirst).toEqual({
      rate: proposal.rates.clientFirst,
      commission: 2_000,
      remainingBeforeCosts: 8_000,
      totalCommission: 24_000,
    });
    expect(illustration.commissionDifference).toBe(500);
    expect(illustration.totalCommissionDifference).toBe(6_000);
    expect(illustration.subscriptionCommissions).toEqual({
      hireFirst: 100,
      clientFirstInitial: 400,
      clientFirstOngoing: 100,
    });
  });

  it('distinguishes the subscription phases without stacking recurring rates', () => {
    expect(proposal.clientFirstSubscriptionMonths).toBe(12);
    const content = renderAgreementMarkdown();
    expect(content).toContain(
      '20% of collected subscription fees for each credited customer’s first 12 service months',
    );
    expect(content).toContain(
      'then 5% of collected recurring fees from service month 13',
    );
    expect(content).toContain(
      'The 5% rate replaces 20%; the rates are not added together.',
    );
    expect(content).toContain(
      'This structure applies to the triggering client and all future credited sales',
    );
    expect(collectionComparison.recurring).toContain(
      'hire first earns $100 (5%) from the start',
    );
    expect(collectionComparison.recurring).toContain(
      'Client first earns $400 (20%) for service months 1–12, then $100 (5%) from service month 13',
    );
  });

  it('preserves comparison labels, amounts and qualification in the portable document', () => {
    const content = renderAgreementMarkdown();
    expect(content).toContain(collectionComparison.assumption);
    expect(content).toContain(
      '| Per collected installment | Hire first · 15% | Client first · 20% |',
    );
    expect(content).toContain('| Build commission | $1,500 | $2,000 |');
    expect(collectionComparison.rows[1].label).toMatch(
      /Handrail.*before\s+costs/i,
    );
    expect(content).toContain(
      `| ${collectionComparison.rows[1].label} | $8,500 | $8,000 |`,
    );
    expect(content).toContain(collectionComparison.difference);
    expect(content).toContain(collectionComparison.rule);
    expect(content).toContain(collectionComparison.qualifier);
    expect(content).toContain(collectionComparison.total);
    expect(content).toContain(collectionComparison.recurring);
    expect(collectionComparison.assumption).toMatch(
      /^Build-only illustration:/,
    );
    expect(collectionComparison.total).toContain(
      'Subscription commissions are separate.',
    );
    expect(collectionComparison.qualifier).toContain('benefits');
    expect(collectionComparison.qualifier).toContain('not profit');
  });

  it('keeps the unresolved discussion points as canonical list items', () => {
    const discussion = agreementSections.find(
      (section) => section.id === 'next-step',
    );
    expect(discussion?.items).toHaveLength(6);
    const content = renderAgreementMarkdown();
    for (const item of discussion?.items ?? []) {
      expect(content).toContain(`- ${item}`);
    }
  });
});
