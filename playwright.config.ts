import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  webServer: process.env.PROPOSAL_BASE_URL
    ? undefined
    : {
        command: 'node scripts/serve.mjs',
        url: 'http://127.0.0.1:4321/handrail-proposal/',
        reuseExistingServer: !process.env.CI,
      },
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL:
      process.env.PROPOSAL_BASE_URL ||
      'http://127.0.0.1:4321/handrail-proposal/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
