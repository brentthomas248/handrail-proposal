import type { Preview } from '@storybook/react-vite';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: {
      options: {
        paper: { name: 'Paper environment', value: '#EDF0F2' },
        white: { name: 'White paper', value: '#FFFFFF' },
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'paper' } },
};

export default preview;
