import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import PaperScene from './PaperScene';

const meta = {
  title: 'Proposal/Folding paper scene',
  component: PaperScene,
  tags: ['autodocs'],
  args: {
    progress: 0,
    reducedMotion: false,
    onReady: fn(),
    onUnavailable: fn(),
  },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onReady).toHaveBeenCalled(), {
      timeout: 10000,
    });
    await expect(args.onUnavailable).not.toHaveBeenCalled();
  },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    reducedMotion: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: 600, maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A demand-rendered decorative scene. Its public API exposes timeline progress and motion preference; readiness and unavailable callbacks let the host preserve the static fallback.',
      },
    },
  },
} satisfies Meta<typeof PaperScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Folded: Story = { args: { progress: 0 } };
export const Opening: Story = { args: { progress: 0.5 } };
export const Unfolded: Story = { args: { progress: 1 } };
export const ReducedMotion: Story = {
  args: { progress: 1, reducedMotion: true },
};
