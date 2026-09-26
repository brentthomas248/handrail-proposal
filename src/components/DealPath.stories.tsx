import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import DealPath from './DealPath';

const meta = {
  title: 'Proposal/Deal path',
  component: DealPath,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['employment', 'client'],
      description:
        'The order of employment and the qualifying client determines the build commission path.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DealPath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmploymentFirst: Story = {
  args: { variant: 'employment' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('15', { exact: true })).toBeVisible();
    await expect(canvas.getByText('+ 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText(/any time in the 90-day window/),
    ).toBeVisible();
  },
};

export const ClientFirst: Story = {
  args: { variant: 'client' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('20', { exact: true })).toBeVisible();
    await expect(canvas.getByText('+ 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText(/triggering sale and all future credited sales/),
    ).toBeVisible();
  },
};

export const NarrowLayout: Story = {
  args: { variant: 'client' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
