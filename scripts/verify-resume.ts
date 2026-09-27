import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resume, resumePrintPages } from '../src/content/resume.ts';

const path =
  process.argv[2] ??
  fileURLToPath(new URL(`../public/${resume.pdf}`, import.meta.url));

function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/\u00ad/g, '')
    .replace(/([\p{L}\p{N}]-)[\t ]*\r?\n[\t ]*(?=[\p{L}\p{N}])/gu, '$1')
    .replace(/[•●]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Reading-order extraction keeps wrapped column headings together; -layout
// interleaves the heading with the adjacent contribution paragraph.
const extracted = execFileSync('pdftotext', [path, '-'], {
  encoding: 'utf8',
});
const pages = extracted.split('\f').filter((page) => page.trim());
if (pages.length !== resumePrintPages.length)
  throw new Error(`Expected two resume pages; found ${pages.length}.`);

for (const [index, chunks] of resumePrintPages.entries()) {
  let remaining = normalize(pages[index]);
  for (const chunk of chunks) {
    const expected = normalize(chunk);
    const position = remaining.indexOf(expected);
    if (position < 0)
      throw new Error(
        `Page ${index + 1} is missing complete canonical text: ${chunk}`,
      );
    remaining =
      remaining.slice(0, position) +
      remaining.slice(position + expected.length);
    remaining = normalize(remaining);
  }
  if (remaining)
    throw new Error(
      `Page ${index + 1} includes unexpected or repeated content: ${remaining}`,
    );
}

console.log(
  `Resume verified: two pages, ${resume.experience.length} experience records, ${resume.contributions.length} Handrail contribution areas, ${resume.proof.length} public work samples and complete education/tools text match canonical content.`,
);
