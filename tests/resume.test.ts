import { describe, expect, it } from 'vitest';
import { resume, resumePrintPages } from '../src/content/resume';

describe('public Handrail resume', () => {
  it('uses the confirmed graduation year and distinguishes coursework from a degree', () => {
    expect(resume.education.degree).toBe(
      'B.S., Management Information Systems, 2025',
    );
    expect(resume.education.graduate).toBe(
      'Graduate coursework in Data Science',
    );
    expect(resume.preparedFor).toBe('Prepared for Handrail');
  });

  it('keeps verifiable experience separate from proposed Handrail contributions', () => {
    expect(resume.contributionTitle).toContain('could contribute');
    expect(resume.experience.map((item) => item.organization)).not.toContain(
      'Handrail',
    );
    expect(resume.profile).toContain('AI-assisted engineering');
    expect(resume.contributions.map((item) => item.id)).toEqual([
      'discovery',
      'engineering',
      'customers',
      'delivery',
    ]);
  });

  it('keeps every canonical experience and contribution paragraph in print', () => {
    expect(resumePrintPages).toHaveLength(2);
    for (const experience of resume.experience)
      for (const bullet of experience.bullets)
        expect(resumePrintPages[0]).toContain(bullet);
    for (const contribution of resume.contributions) {
      expect(resumePrintPages[1]).toContain(contribution.body);
      expect(resumePrintPages[1]).toContain(contribution.foundation);
    }
    for (const proof of resume.proof)
      expect(resumePrintPages[1]).toContain(proof.description);
  });

  it('links to public proof without revealing personal contact details or private repositories', () => {
    const links = [
      resume.github,
      resume.product,
      ...resume.proof.map((p) => p.href),
    ];
    for (const link of links) {
      expect(new URL(link).protocol).toBe('https:');
      expect(link).not.toContain('/inventory-ingestion');
    }
    const publicText = JSON.stringify(resume);
    expect(publicText).not.toMatch(
      /@[a-z0-9.-]+\.[a-z]{2,}|\+?1?\s?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/i,
    );
    expect(publicText).not.toMatch(
      /one semester|closed.won|quota attainment/i,
    );
  });
});
