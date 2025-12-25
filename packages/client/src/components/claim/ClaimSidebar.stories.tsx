import type { Meta, StoryObj } from '@storybook/react';
import { ClaimSidebar } from './ClaimSidebar';
import { ClaimStatus } from '@carton/shared';

const meta: Meta<typeof ClaimSidebar> = {
  title: 'Claim/ClaimSidebar',
  component: ClaimSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    reactRouter: {
      routePath: '/claims/:id',
      routeParams: { id: '1' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClaimSidebar>;

const mockClaims = [
  {
    id: '1',
    title: 'Insurance Claim Dispute',
    caseNumber: 'CAS-242314-2124',
    status: ClaimStatus.TO_DO,
  },
  {
    id: '2',
    title: 'Policy Coverage Inquiry',
    caseNumber: 'CAS-242315-2125',
    status: ClaimStatus.IN_PROGRESS,
  },
  {
    id: '3',
    title: 'Premium Adjustment Request',
    caseNumber: 'CAS-242316-2126',
    status: ClaimStatus.COMPLETED,
  },
  {
    id: '4',
    title: 'Claim Status Update',
    caseNumber: 'CAS-242317-2127',
    status: ClaimStatus.TO_DO,
  },
  {
    id: '5',
    title: 'Fraud Investigation',
    caseNumber: 'CAS-242318-2128',
    status: ClaimStatus.IN_PROGRESS,
  },
];

export const Default: Story = {
  args: {
    claims: mockClaims,
  },
};

export const Empty: Story = {
  args: {
    claims: [],
  },
};

export const SingleClaim: Story = {
  args: {
    claims: [mockClaims[0]],
  },
};

export const LongTitle: Story = {
  args: {
    claims: [
      ...mockClaims,
      {
        id: '6',
        title: 'This Is A Very Long Claim Title That Should Be Truncated With Ellipsis',
        caseNumber: 'CAS-242319-2129',
        status: ClaimStatus.CLOSED,
      },
    ],
  },
};
