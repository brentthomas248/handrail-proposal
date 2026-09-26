import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    { name: '@storybook/addon-mcp', options: { endpoint: '/mcp' } },
  ],
  core: { disableTelemetry: true },
};

export default config;
