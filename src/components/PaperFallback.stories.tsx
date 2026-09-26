import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import PaperFallback from './PaperFallback';

const meta = {
  title: 'Proposal/Static paper',
  component: PaperFallback,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Decorative, local SVG scene used before WebGL loads and when motion or WebGL is unavailable. All agreement information is supplied separately as semantic HTML.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 600,
          position: 'relative',
          aspectRatio: '760 / 780',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaperFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StaticFallback: Story = {
  play: async ({ canvasElement }) => {
    const graphic = canvasElement.querySelector('svg');
    await expect(graphic).toHaveAttribute('aria-hidden', 'true');
    await expect(graphic).toHaveAttribute('viewBox', '0 0 760 780');
  },
};
