import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { CaseEssentialDetails } from './CaseEssentialDetails';
import type { CaseEssentialDetailsProps } from './types';
import { createTrpcWrapper } from '@/test/utils';

const mockCaseData: CaseEssentialDetailsProps['caseData'] = {
  customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
  customerId: '1',
  priority: 'MEDIUM',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  updatedAt: new Date('2024-01-16T14:30:00Z').toISOString(),
  assignee: { id: '2', name: 'Jane Smith' },
  assignedTo: '2',
  creator: { id: '3', name: 'John Doe', email: 'john@example.com' },
  createdBy: '3',
  updater: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  updatedBy: '2',
};

const mockCustomers = [
  {
    id: '1',
    firstName: 'Acme',
    lastName: 'Corp',
    username: 'acme-corp',
    email: 'acme@example.com',
    dateJoined: new Date('2024-01-01T00:00:00Z'),
    satisfactionRate: 4.5,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    firstName: 'TechCorp',
    lastName: 'Inc',
    username: 'techcorp',
    email: 'tech@example.com',
    dateJoined: new Date('2024-01-02T00:00:00Z'),
    satisfactionRate: 4.0,
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    firstName: 'Global',
    lastName: 'Systems',
    username: 'global-systems',
    email: 'global@example.com',
    dateJoined: new Date('2024-01-03T00:00:00Z'),
    satisfactionRate: 5.0,
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
  },
];

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
  },
];

const meta: Meta<typeof CaseEssentialDetails> = {
  title: 'Components/CaseDetails/CaseEssentialDetails',
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
    layout: 'padded',
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseId: 'case-1',
    caseData: mockCaseData,
  },
};

export const Unassigned: Story = {
  args: {
    caseId: 'case-2',
    caseData: {
      ...mockCaseData,
      assignee: null,
      assignedTo: null,
    },
  },
};

export const RecentlyCreated: Story = {
  args: {
    caseId: 'case-3',
    caseData: {
      ...mockCaseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
