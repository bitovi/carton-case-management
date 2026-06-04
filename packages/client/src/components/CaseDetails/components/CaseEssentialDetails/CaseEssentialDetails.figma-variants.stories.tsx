import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { CaseEssentialDetails } from './CaseEssentialDetails';
import type { CaseEssentialDetailsProps } from './types';
import { createTrpcWrapper } from '@/test/utils';

const mockCaseDataAssigned: CaseEssentialDetailsProps['caseData'] = {
  customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
  customerId: '1',
  priority: 'MEDIUM',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-16T14:30:00.000Z',
  assignee: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  assignedTo: '2',
  creator: { id: '3', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  createdBy: '3',
};

const mockCaseDataUnassigned: CaseEssentialDetailsProps['caseData'] = {
  ...mockCaseDataAssigned,
  assignee: null,
  assignedTo: null,
};

const mockCustomers = [
  {
    id: '1',
    firstName: 'Acme',
    lastName: 'Corp',
    username: 'acme-corp',
    email: 'acme@example.com',
    dateJoined: '2024-01-01T00:00:00.000Z',
    satisfactionRate: 4.5,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    firstName: 'TechCorp',
    lastName: 'Inc',
    username: 'techcorp',
    email: 'tech@example.com',
    dateJoined: '2024-01-02T00:00:00.000Z',
    satisfactionRate: 4.0,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockUsers = [
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

const meta = {
  title: 'Figma Variants/CaseEssentialDetails',
  component: CaseEssentialDetails,
  decorators: [
    (Story) => {
      const TrpcWrapper = createTrpcWrapper();
      return (
        <TrpcWrapper>
          <Story />
        </TrpcWrapper>
      );
    },
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: [
        http.get('*/trpc/customer.list*', () => {
          return HttpResponse.json({
            result: { data: mockCustomers },
          });
        }),
        http.post('*/trpc/customer.list*', () => {
          return HttpResponse.json({
            result: { data: mockCustomers },
          });
        }),
        http.get('*/trpc/user.list*', () => {
          return HttpResponse.json({
            result: { data: mockUsers },
          });
        }),
        http.post('*/trpc/user.list*', () => {
          return HttpResponse.json({
            result: { data: mockUsers },
          });
        }),
      ],
    },
  },
} as Meta<typeof CaseEssentialDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandedTrueAssigneeAssigned: Story = {
  args: {
    caseId: 'case-1',
    caseData: mockCaseDataAssigned,
  },
};

export const ExpandedTrueAssigneeUnassigned: Story = {
  args: {
    caseId: 'case-2',
    caseData: mockCaseDataUnassigned,
  },
};

export const ExpandedFalseAssigneeAssigned: Story = {
  args: {
    caseId: 'case-3',
    caseData: mockCaseDataAssigned,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.click();
    }
  },
};
