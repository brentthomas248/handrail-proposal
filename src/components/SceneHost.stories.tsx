import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import SceneHost from './SceneHost';

const meta = {
  title: 'Proposal/Scene host',
  component: SceneHost,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          height: 600,
          maxWidth: 900,
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    const previous = document.documentElement.dataset.motion;
    document.documentElement.dataset.motion = 'off';
    return () => {
      if (previous === undefined)
        delete document.documentElement.dataset.motion;
      else document.documentElement.dataset.motion = previous;
    };
  },
} satisfies Meta<typeof SceneHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MotionDisabled: Story = {
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('[data-scene-state]')).toHaveAttribute(
        'data-scene-state',
        'static',
      ),
    );
    await expect(
      canvasElement.querySelector('svg.paper-fallback'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector('canvas')).not.toBeInTheDocument();
  },
};

export const MotionEnabled: Story = {
  beforeEach: () => {
    document.documentElement.dataset.motion = 'on';
  },
  play: async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(
          canvasElement.querySelector('[data-scene-state]'),
        ).toHaveAttribute('data-scene-state', 'ready'),
      { timeout: 10000 },
    );
    await expect(canvasElement.querySelector('canvas')).toBeInTheDocument();
  },
};
