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

// Reading-order extraction keeps wrapped column headings together.
// Raw extraction separately proves punctuation that Poppler may dehyphenate.
const extracted = execFileSync('pdftotext', [path, '-'], {
  encoding: 'utf8',
});
const pages = extracted.split('\f').filter((page) => page.trim());
const rawPages = execFileSync('pdftotext', ['-raw', path, '-'], {
  encoding: 'utf8',
})
  .split('\f')
  .filter((page) => page.trim());
const glyphs = (text: string) => normalize(text).replace(/\s/g, '');
const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

if (pages.length !== resumePrintPages.length)
  throw new Error(`Expected two resume pages; found ${pages.length}.`);

for (const [index, chunks] of resumePrintPages.entries()) {
  let remaining = normalize(pages[index]);
  for (const chunk of chunks) {
    const expected = normalize(chunk);
    let matched = expected;
    let position = remaining.indexOf(matched);
    if (
      position < 0 &&
      expected.includes('-') &&
      glyphs(rawPages[index]).includes(glyphs(chunk))
    ) {
      // Only tolerate lost line-end hyphens when the raw glyph stream proves
      // the complete canonical phrase including every authored hyphen.
      const found = remaining.match(
        new RegExp(expected.split('-').map(escapeRegex).join('-?')),
      );
      if (found?.index !== undefined) {
        matched = found[0];
        position = found.index;
      }
    }
    if (position < 0)
      throw new Error(
        `Page ${index + 1} is missing complete canonical text: ${chunk}`,
      );
    remaining =
      remaining.slice(0, position) + remaining.slice(position + matched.length);
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
