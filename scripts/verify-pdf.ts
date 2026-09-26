import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  agreementEndnote,
  agreementIntro,
  agreementSections,
  proposal,
} from '../src/content/proposal.ts';

const pdfPath =
  process.argv[2] ??
  fileURLToPath(new URL(`../public/${proposal.paths.pdf}`, import.meta.url));
const footer = `${proposal.parties.company} / ${proposal.parties.representative} — ${proposal.status}`;

function normalize(text: string): string {
  return (
    text
      .normalize('NFKC')
      .replace(/\u00ad/g, '')
      // Layout extraction preserves real hyphens at wrapped line ends.
      .replace(/([\p{L}\p{N}]-)[\t ]*\r?\n[\t ]*(?=[\p{L}\p{N}])/gu, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

let extracted: string;
try {
  extracted = execFileSync('pdftotext', ['-layout', pdfPath, '-'], {
    encoding: 'utf8',
  });
} catch (error) {
  console.error(
    `PDF extraction failed. Ensure pdftotext is installed and ${pdfPath} exists.`,
  );
  throw error;
}

const document = normalize(
  extracted
    .split(/\r?\n/)
    .filter((line) => {
      const content = normalize(line);
      if (content.startsWith(footer)) {
        const remaining = content.slice(footer.length).trim();
        if (remaining === '' || /^\d+\s*\/\s*\d+$/.test(remaining))
          return false;
      }
      return !/^\d+\s*\/\s*\d+$/.test(content);
    })
    .join('\n'),
);
const chunks = [
  { label: 'Introduction', text: agreementIntro },
  ...agreementSections.flatMap((section, index) => [
    {
      label: `Section ${index + 1} heading`,
      text: `${index + 1}. ${section.title}`,
    },
    ...section.paragraphs.map((text, paragraph) => ({
      label: `Section ${index + 1}, paragraph ${paragraph + 1}`,
      text,
    })),
  ]),
];

if (
  !document.includes(normalize(proposal.title)) ||
  !document.includes(proposal.status)
) {
  throw new Error('PDF is missing the canonical title or discussion status.');
}

let cursor = document.indexOf(normalize(agreementIntro));
if (cursor < 0)
  throw new Error('PDF introduction does not match canonical content.');

for (const chunk of chunks) {
  const expected = normalize(chunk.text);
  while (document[cursor] === ' ') cursor += 1;
  if (!document.startsWith(expected, cursor)) {
    const observed = document.slice(cursor, cursor + expected.length);
    let difference = 0;
    while (
      difference < expected.length &&
      expected[difference] === observed[difference]
    )
      difference += 1;
    const start = Math.max(0, difference - 35);
    throw new Error(
      `${chunk.label} differs from canonical content near character ${difference}.\n` +
        `Expected: ${expected.slice(start, difference + 100)}\n` +
        `Observed: ${observed.slice(start, difference + 100)}`,
    );
  }
  cursor += expected.length;
}

const expectedEndnote = normalize(agreementEndnote);
const remainder = document.slice(cursor).trim();
if (remainder !== expectedEndnote) {
  throw new Error(
    'PDF contains missing or unexpected content after the canonical proposal.',
  );
}

console.log(
  `PDF verified: introduction, ${agreementSections.length} ordered sections, ${chunks.length - agreementSections.length - 1} complete paragraphs and discussion status match canonical content.`,
);
