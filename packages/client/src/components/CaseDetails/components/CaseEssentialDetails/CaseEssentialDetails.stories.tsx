import type { Meta, StoryObj } from '@storybook/react';
import { CaseEssentialDetails } from './CaseEssentialDetails';

const mockCaseData = {
  customerName: 'Acme Corp',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  updatedAt: new Date('2024-01-16T14:30:00Z').toISOString(),
  assignee: {
    name: 'Jane Smith',
  },
};

const meta: Meta<typeof CaseEssentialDetails> = {
  title: 'Components/CaseDetails/CaseEssentialDetails',
  component: CaseEssentialDetails,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseData: mockCaseData,
  },
};

export const Unassigned: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      assignee: null,
    },
  },
};

export const RecentlyCreated: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
