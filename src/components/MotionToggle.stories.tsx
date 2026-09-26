import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import MotionToggle from './MotionToggle';

const meta = {
  title: 'Proposal/Motion preference',
  component: MotionToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native toggle button. It respects reduced-motion at startup and persists an explicit preference when browser storage is available. aria-pressed reports whether animation is enabled.',
      },
    },
  },
  beforeEach: () => {
    const previous = localStorage.getItem('proposal-motion');
    localStorage.setItem('proposal-motion', 'off');
    return () => {
      if (previous === null) localStorage.removeItem('proposal-motion');
      else localStorage.setItem('proposal-motion', previous);
      delete document.documentElement.dataset.motion;
    };
  },
} satisfies Meta<typeof MotionToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SavedMotionOff: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: /^Motion /,
    });
    await waitFor(() =>
      expect(toggle).toHaveAttribute('aria-pressed', 'false'),
    );
    await expect(toggle).toHaveTextContent('Motion off');
  },
};

export const KeyboardToggle: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: /^Motion /,
    });
    await waitFor(() =>
      expect(toggle).toHaveAttribute('aria-pressed', 'false'),
    );
    toggle.focus();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(localStorage.getItem('proposal-motion')).toBe('on');
    await expect(document.documentElement.dataset.motion).toBe('on');
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(localStorage.getItem('proposal-motion')).toBe('off');
    await expect(document.documentElement.dataset.motion).toBe('off');
  },
};

export const SystemReducedMotion: Story = {
  beforeEach: () => {
    const original = window.matchMedia;
    localStorage.setItem('proposal-motion', 'on');
    window.matchMedia = (query: string) => {
      const result = original.call(window, query);
      if (query === '(prefers-reduced-motion: reduce)')
        Object.defineProperty(result, 'matches', { value: true });
      return result;
    };
    return () => {
      window.matchMedia = original;
    };
  },
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: /^Motion /,
    });
    await waitFor(() => expect(toggle).toBeDisabled());
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAttribute(
      'title',
      'Motion is disabled by your system preference',
    );
  },
};
