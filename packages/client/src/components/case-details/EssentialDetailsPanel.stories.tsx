import type { Meta, StoryObj } from '@storybook/react';
import { EssentialDetailsPanel } from './EssentialDetailsPanel';

const meta = {
  title: 'Case Details/EssentialDetailsPanel',
  component: EssentialDetailsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EssentialDetailsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAssignee: Story = {
  args: {
    status: 'IN_PROGRESS',
    creator: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
    },
    assignee: {
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
    },
    createdAt: new Date('2025-11-29T10:15:00Z'),
    updatedAt: new Date('2025-12-05T14:30:00Z'),
  },
};

export const WithoutAssignee: Story = {
  args: {
    status: 'OPEN',
    creator: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
    },
    createdAt: new Date('2025-11-29T10:15:00Z'),
    updatedAt: new Date('2025-12-05T14:30:00Z'),
  },
};

export const ResolvedCase: Story = {
  args: {
    ...WithAssignee.args,
    status: 'RESOLVED',
    updatedAt: new Date(),
  },
};

export const ClosedCase: Story = {
  args: {
    ...WithAssignee.args,
    status: 'CLOSED',
    updatedAt: new Date(),
  },
};
