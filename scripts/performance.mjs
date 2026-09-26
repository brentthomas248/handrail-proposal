import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
const base =
  process.env.PROPOSAL_BASE_URL || 'http://127.0.0.1:4321/handrail-proposal/';
await mkdir('qa-artifacts', { recursive: true });
for (const device of ['mobile', 'desktop']) {
  const path = `qa-artifacts/lighthouse-${device}.json`;
  const args = [
    'exec',
    'lighthouse',
    base,
    '--chrome-flags=--headless --no-sandbox',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--output=json',
    `--output-path=${path}`,
    '--quiet',
  ];
  if (device === 'desktop') args.push('--preset=desktop');
  await new Promise((done, reject) => {
    const child = spawn('pnpm', args, {
      stdio: 'inherit',
      env: { ...process.env, CHROME_PATH: chromium.executablePath() },
    });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? done() : reject(new Error(`Lighthouse exited ${code}`)),
    );
  });
  const report = JSON.parse(await readFile(path, 'utf8'));
  console.log(
    JSON.stringify({
      device,
      scores: Object.fromEntries(
        Object.entries(report.categories).map(([key, value]) => [
          key,
          value.score * 100,
        ]),
      ),
      lcpMs: report.audits['largest-contentful-paint'].numericValue,
      tbtMs: report.audits['total-blocking-time'].numericValue,
      cls: report.audits['cumulative-layout-shift'].numericValue,
    }),
  );
}
