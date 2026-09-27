import {
  agreementEndnote,
  agreementIntro,
  agreementSections,
  collectionComparison,
  proposal,
} from '../content/proposal.ts';

function renderCollectionComparisonMarkdown(): string {
  const comparison = collectionComparison;
  return [
    comparison.assumption,
    `**${comparison.collectedLabel}: ${comparison.collectedAmount}**`,
    [
      `| ${comparison.tableColumnLabel} | ${comparison.paths.map((path) => `${path.label} · ${path.rate}`).join(' | ')} |`,
      '| --- | ---: | ---: |',
      ...comparison.rows.map(
        (row) => `| ${row.label} | ${row.amounts.join(' | ')} |`,
      ),
    ].join('\n'),
    comparison.difference,
    comparison.rule,
    comparison.qualifier,
  ].join('\n\n');
}

/** Mirrors the same business terms used by the HTML and PDF. */
export function renderAgreementMarkdown(): string {
  const sections = agreementSections.map((section, index) =>
    [
      `## ${index + 1}. ${section.title}`,
      ...(section.comparison ? [renderCollectionComparisonMarkdown()] : []),
      ...section.paragraphs,
      ...(section.items
        ? [section.items.map((item) => `- ${item}`).join('\n')]
        : []),
    ].join('\n\n'),
  );
  return (
    [
      '<!-- Generated from src/content/proposal.ts. Run pnpm contract:generate. -->',
      `# ${proposal.notesTitle}`,
      `**${proposal.status} · ${proposal.version}**`,
      agreementIntro,
      ...sections,
      agreementEndnote,
    ].join('\n\n') + '\n'
  );
}
