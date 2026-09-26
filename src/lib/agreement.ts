import {
  agreementEndnote,
  agreementIntro,
  agreementSections,
  proposal,
} from '../content/proposal.ts';

/** Mirrors the same business terms used by the HTML and PDF. */
export function renderAgreementMarkdown(): string {
  const sections = agreementSections.map(
    (section, index) =>
      `## ${index + 1}. ${section.title}\n\n${section.paragraphs.join('\n\n')}`,
  );
  return (
    [
      '<!-- Generated from src/content/proposal.ts. Run pnpm contract:generate. -->',
      `# ${proposal.title}`,
      `**${proposal.status} · ${proposal.version}**`,
      agreementIntro,
      ...sections,
      agreementEndnote,
    ].join('\n\n') + '\n'
  );
}
