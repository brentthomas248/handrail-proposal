import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { dealPathCopy } from '../content/proposal';
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
        'Hire first proposes 15%; client first proposes 20%. Both rates apply to collected build fees and the first 12 subscription months, then 5% recurring from service month 13.',
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
    await expect(canvas.getByText('then 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('build + first 12 subscription months'),
    ).toBeVisible();
    await expect(
      canvas.getByText('recurring from service month 13'),
    ).toBeVisible();
    await expect(canvas.queryByText('+ 5%', { exact: true })).toBeNull();
    await expect(
      canvas.getByText(dealPathCopy.employment.description),
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
    await expect(canvas.getByText('then 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('build + first 12 subscription months'),
    ).toBeVisible();
    await expect(
      canvas.getByText('recurring from service month 13'),
    ).toBeVisible();
    await expect(canvas.queryByText('+ 5%', { exact: true })).toBeNull();
    await expect(
      canvas.getByText(dealPathCopy.client.description),
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
    await expect(canvas.getByText('then 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('build + first 12 subscription months'),
    ).toBeVisible();
    await expect(
      canvas.getByText('recurring from service month 13'),
    ).toBeVisible();
    await expect(
      canvas.getByText('On that client and all my future credited sales.'),
    ).toBeVisible();
    const article = canvas.getByRole('article');
    await expect(article.scrollWidth).toBeLessThanOrEqual(article.clientWidth);
  },
};

export const NarrowEmployment: Story = {
  ...NarrowLayout,
  args: { variant: 'employment' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('15', { exact: true })).toBeVisible();
    await expect(canvas.getByText('then 5%', { exact: true })).toBeVisible();
    await expect(
      canvas.getByText('build + first 12 subscription months'),
    ).toBeVisible();
    await expect(
      canvas.getByText('recurring from service month 13'),
    ).toBeVisible();
    await expect(canvas.getByText(dealPathCopy.employment.note)).toBeVisible();
    const article = canvas.getByRole('article');
    await expect(article.scrollWidth).toBeLessThanOrEqual(article.clientWidth);
  },
};
