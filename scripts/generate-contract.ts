import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderAgreementMarkdown } from '../src/lib/agreement.ts';

const path = fileURLToPath(
  new URL('../docs/proposed-agreement.md', import.meta.url),
);
const content = renderAgreementMarkdown();

if (process.argv.includes('--check')) {
  const saved = await readFile(path, 'utf8');
  if (saved !== content) {
    console.error(
      'Proposal notes are stale. Regenerate it from src/content/proposal.ts.',
    );
    process.exitCode = 1;
  } else {
    console.log('Proposal Markdown matches the canonical typed content.');
  }
} else {
  await writeFile(path, content, 'utf8');
  console.log(
    'Generated docs/proposed-agreement.md from the canonical typed content.',
  );
}
