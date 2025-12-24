import type { Meta, StoryObj } from '@storybook/react';
import { CaseDetailsView } from './CaseDetailsView';

const meta = {
  title: 'Case Details/CaseDetailsView',
  component: CaseDetailsView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CaseDetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCaseData = {
  id: 'case-1',
  title: '#CAS-242314-2124',
  description:
    'Customer is disputing the denial of their insurance claim for vehicle damage that occurred on November 15, 2025. The claim was initially denied due to insufficient documentation. Customer has now provided additional photos and police report.',
  status: 'IN_PROGRESS',
  caseType: 'Insurance Claim Dispute',
  customerName: 'Sarah Johnson',
  createdAt: new Date('2025-11-29T10:15:00Z'),
  updatedAt: new Date('2025-12-05T14:30:00Z'),
  creator: {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
  },
  assignee: {
    id: 'user-2',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
  },
  comments: [
    {
      id: '1',
      content:
        'Initial claim review completed. Requesting additional documentation from customer.',
      createdAt: new Date('2025-11-29T14:23:00Z'),
      author: {
        id: 'user-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
      },
    },
    {
      id: '2',
      content: 'Customer has provided the requested police report and photos.',
      createdAt: new Date('2025-12-01T09:15:00Z'),
      author: {
        id: 'user-2',
        name: 'Jordan Lee',
        email: 'jordan.lee@example.com',
      },
    },
    {
      id: '3',
      content:
        'Reviewed the new documentation. Everything appears to be in order. Recommending claim approval.',
      createdAt: new Date('2025-12-03T16:45:00Z'),
      author: {
        id: 'user-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
      },
    },
  ],
};

export const Default: Story = {
  args: {
    caseData: sampleCaseData,
  },
};

export const OpenCase: Story = {
  args: {
    caseData: {
      ...sampleCaseData,
      status: 'OPEN',
      assignee: undefined,
      comments: [],
    },
  },
};

export const ResolvedCase: Story = {
  args: {
    caseData: {
      ...sampleCaseData,
      status: 'RESOLVED',
      comments: [
        ...sampleCaseData.comments,
        {
          id: '4',
          content: 'Claim approved and processed. Case resolved.',
          createdAt: new Date('2025-12-05T11:30:00Z'),
          author: {
            id: 'user-2',
            name: 'Jordan Lee',
            email: 'jordan.lee@example.com',
          },
        },
      ],
    },
  },
};

export const CaseWithoutComments: Story = {
  args: {
    caseData: {
      ...sampleCaseData,
      comments: [],
    },
  },
};
