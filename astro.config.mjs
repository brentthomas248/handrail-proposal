import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({
  site: 'https://brentthomas248.github.io',
  base: '/handrail-proposal',
  trailingSlash: 'always',
  integrations: [react()],
  output: 'static',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
