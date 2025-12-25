import type { Meta, StoryObj } from '@storybook/react';
import { EssentialDetails } from './EssentialDetails';

const meta: Meta<typeof EssentialDetails> = {
  title: 'Claim/EssentialDetails',
  component: EssentialDetails,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof EssentialDetails>;

export const Default: Story = {
  args: {
    customerName: 'Sarah Johnson',
    dateOpened: new Date('2025-10-24T10:00:00Z'),
    assignedAgent: 'Alex Morgan',
    lastUpdated: new Date('2025-12-12T15:30:00Z'),
  },
};

export const NoAssignedAgent: Story = {
  args: {
    customerName: 'David Wilson',
    dateOpened: new Date('2025-11-15T08:00:00Z'),
    assignedAgent: null,
    lastUpdated: new Date('2025-12-20T10:00:00Z'),
  },
};

export const RecentCase: Story = {
  args: {
    customerName: 'Michael Brown',
    dateOpened: new Date('2025-12-20T14:00:00Z'),
    assignedAgent: 'Jane Smith',
    lastUpdated: new Date('2025-12-23T16:45:00Z'),
  },
};
