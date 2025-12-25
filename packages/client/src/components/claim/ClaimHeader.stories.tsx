import type { Meta, StoryObj } from '@storybook/react';
import { ClaimHeader } from './ClaimHeader';
import { ClaimStatus } from '@carton/shared';

const meta: Meta<typeof ClaimHeader> = {
  title: 'Claim/ClaimHeader',
  component: ClaimHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ClaimHeader>;

export const Default: Story = {
  args: {
    title: 'Insurance Claim Dispute',
    caseNumber: 'CAS-242314-2124',
    status: ClaimStatus.TO_DO,
  },
};

export const InProgress: Story = {
  args: {
    title: 'Policy Coverage Inquiry',
    caseNumber: 'CAS-242315-2125',
    status: ClaimStatus.IN_PROGRESS,
  },
};

export const Completed: Story = {
  args: {
    title: 'Premium Adjustment Request',
    caseNumber: 'CAS-242316-2126',
    status: ClaimStatus.COMPLETED,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Very Long Title That Should Wrap Properly When The Screen Width Is Limited',
    caseNumber: 'CAS-242317-2127',
    status: ClaimStatus.TO_DO,
  },
};
