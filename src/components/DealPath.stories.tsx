import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import DealPath from './DealPath';

const meta = {
  title: 'Proposal/Deal path',
  component: DealPath,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A proposed commission path printed directly on the flyer. Both rates apply to collected customer revenue. This component presents terms; it does not select or accept them.',
      },
    },
  },
  argTypes: {
    showScope: {
      control: 'boolean',
      description:
        'Omit the scope note only when the enclosing proposal group supplies its complete credited-sales scope.',
    },
    variant: {
      control: 'radio',
      options: ['employment', 'client'],
      description:
        'Employment before the qualifying client proposes 15% build commission; bringing that client first proposes 20%. Both include 5% recurring commission.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 520 }}>
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
    await expect(
      canvas.getByRole('heading', { name: 'Hire first' }),
    ).toBeVisible();
    await expect(canvas.getByText('15', { exact: true })).toBeVisible();
    await expect(canvas.getByText('+ 5%', { exact: true })).toBeVisible();
    await expect(canvas.getByText('of collected build fees')).toBeVisible();
    await expect(canvas.getByText('of collected recurring fees')).toBeVisible();
    await expect(
      canvas.getByText('Bring me on before I land the qualifying client.'),
    ).toBeVisible();
  },
};

export const ClientFirst: Story = {
  args: { variant: 'client' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Client first' }),
    ).toBeVisible();
    await expect(canvas.getByText('20', { exact: true })).toBeVisible();
    await expect(canvas.getByText('+ 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('I bring the paying client that makes hiring possible.'),
    ).toBeVisible();
    await expect(
      canvas.getByText('On that client and all my future credited sales.'),
    ).toBeVisible();
  },
};

export const NarrowLayout: Story = {
  args: { variant: 'client' },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 288 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('20', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('On that client and all my future credited sales.'),
    ).toBeVisible();
    const article = canvas.getByRole('article');
    await expect(article.scrollWidth).toBeLessThanOrEqual(article.clientWidth);
  },
};
