import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { StatusDropdown } from './StatusDropdown';

const mockCase = {
  id: '1',
  title: 'Test Case',
  caseNumber: 'CASE-001',
  status: 'TO_DO',
  description: 'Test description',
  customerName: 'Test Customer',
  creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
  assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-16'),
};

const meta = {
  title: 'Components/StatusDropdown',
  component: StatusDropdown,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
        http.post('/trpc/case.update', async ({ request }) => {
          const body = await request.json() as { status?: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' };
          return HttpResponse.json({
            result: {
              data: {
                ...mockCase,
                status: body.status || mockCase.status,
              },
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
} satisfies Meta<typeof StatusDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToDo: Story = {
  args: {
    caseId: '1',
    currentStatus: 'TO_DO',
  },
};

export const InProgress: Story = {
  args: {
    caseId: '1',
    currentStatus: 'IN_PROGRESS',
  },
};

export const Completed: Story = {
  args: {
    caseId: '1',
    currentStatus: 'COMPLETED',
  },
};

export const Closed: Story = {
  args: {
    caseId: '1',
    currentStatus: 'CLOSED',
  },
};

export const Updating: Story = {
  args: {
    caseId: '1',
    currentStatus: 'IN_PROGRESS',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
        http.post('/trpc/case.update', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 2000));
          return HttpResponse.json({
            result: {
              data: { ...mockCase, status: 'COMPLETED' },
            },
          });
        }),
      ],
    },
  },
};
