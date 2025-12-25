import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';
import { ClaimStatus } from '@carton/shared';

const meta: Meta<typeof StatusBadge> = {
  title: 'Claim/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const ToDo: Story = {
  args: {
    status: ClaimStatus.TO_DO,
  },
};

export const InProgress: Story = {
  args: {
    status: ClaimStatus.IN_PROGRESS,
  },
};

export const Completed: Story = {
  args: {
    status: ClaimStatus.COMPLETED,
  },
};

export const Closed: Story = {
  args: {
    status: ClaimStatus.CLOSED,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StatusBadge status={ClaimStatus.TO_DO} />
      <StatusBadge status={ClaimStatus.IN_PROGRESS} />
      <StatusBadge status={ClaimStatus.COMPLETED} />
      <StatusBadge status={ClaimStatus.CLOSED} />
    </div>
  ),
};
