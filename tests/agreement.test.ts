import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  agreementEndnote,
  agreementIntro,
  agreementSections,
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
    const installment = 120_000 / 12;
    const clientFirst = (installment * proposal.rates.clientFirst) / 100;
    const hireFirst = (installment * proposal.rates.employmentFirst) / 100;
    expect(clientFirst).toBe(2_000);
    expect(installment - clientFirst).toBe(8_000);
    expect(hireFirst).toBe(1_500);
    expect(installment - hireFirst).toBe(8_500);
    expect((2_000 * proposal.rates.recurring) / 100).toBe(100);
  });
});
