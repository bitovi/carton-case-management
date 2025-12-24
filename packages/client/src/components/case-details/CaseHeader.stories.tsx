import type { Meta, StoryObj } from '@storybook/react';
import { CaseHeader } from './CaseHeader';

const meta = {
  title: 'Case Details/CaseHeader',
  component: CaseHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CaseHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    caseId: 'CAS-242314-2124',
    title: '#CAS-242314-2124',
    caseType: 'Insurance Claim Dispute',
    status: 'OPEN',
    customerName: 'Sarah Johnson',
    createdAt: new Date('2025-11-29T10:15:00Z'),
    updatedAt: new Date('2025-12-05T14:30:00Z'),
  },
};

export const InProgress: Story = {
  args: {
    ...Open.args,
    status: 'IN_PROGRESS',
    updatedAt: new Date(),
  },
};

export const Resolved: Story = {
  args: {
    ...Open.args,
    status: 'RESOLVED',
    updatedAt: new Date(),
  },
};

export const Closed: Story = {
  args: {
    ...Open.args,
    status: 'CLOSED',
    updatedAt: new Date(),
  },
};
