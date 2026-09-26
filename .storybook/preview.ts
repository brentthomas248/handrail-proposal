import type { Preview } from '@storybook/react-vite';
import '@fontsource-variable/inter';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: {
      options: {
        paper: { name: 'Paper environment', value: '#ebe4d8' },
        white: { name: 'White paper', value: '#fbfaf7' },
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'paper' } },
};

export default preview;
