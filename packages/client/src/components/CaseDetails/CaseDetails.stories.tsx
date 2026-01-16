import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseDetails } from './CaseDetails';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CaseByIdOutput = inferProcedureOutput<AppRouter['case']['getById']>;

const mockCase: NonNullable<CaseByIdOutput> = {
  id: '1',
  title: 'Customer Login Issue',
  description:
    'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password.',
  status: 'IN_PROGRESS',
  priority: 'MEDIUM',
  customerId: '1',
  createdBy: '1',
  updatedBy: '2',
  assignedTo: '2',
  customer: {
    id: '1',
    firstName: 'Acme',
    lastName: 'Corp',
  },
  creator: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  assignee: {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  updater: {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-16T14:30:00Z'),
  comments: [
    {
      id: '1',
      content: 'Started investigating the issue. Checked login logs.',
      caseId: '1',
      authorId: '2',
      author: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      createdAt: new Date('2024-01-15T11:00:00Z'),
      updatedAt: new Date('2024-01-15T11:00:00Z'),
    },
    {
      id: '2',
      content:
        'Found the issue - password reset token had expired. Sending new reset link to customer.',
      caseId: '1',
      authorId: '2',
      author: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      createdAt: new Date('2024-01-16T09:15:00Z'),
      updatedAt: new Date('2024-01-16T09:15:00Z'),
    },
  ],
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
    name: 'John Doe',
    email: 'john@example.com',
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
];

const meta: Meta<typeof CaseDetails> = {
  title: 'Components/CaseDetails',
  component: CaseDetails,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
        http.post('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
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
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/case/1']}>
          <Routes>
            <Route path="/case/:id" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.getById', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
        http.post('/trpc/case.getById', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCase,
            },
          });
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
        http.post('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
      ],
    },
  },
};

export const WithManyComments: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: {
                ...mockCase,
                comments: [
                  ...mockCase.comments,
                  {
                    id: '3',
                    content: 'Customer confirmed they received the reset link.',
                    caseId: '1',
                    authorId: '1',
                    author: {
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                    },
                    createdAt: new Date('2024-01-16T10:30:00Z'),
                    updatedAt: new Date('2024-01-16T10:30:00Z'),
                  },
                  {
                    id: '4',
                    content: 'Password reset successful. Customer can now log in.',
                    caseId: '1',
                    authorId: '2',
                    author: {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                    },
                    createdAt: new Date('2024-01-16T14:30:00Z'),
                    updatedAt: new Date('2024-01-16T14:30:00Z'),
                  },
                  {
                    id: '5',
                    content: 'Closing this case as resolved.',
                    caseId: '1',
                    authorId: '2',
                    author: {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                    },
                    createdAt: new Date('2024-01-16T14:45:00Z'),
                    updatedAt: new Date('2024-01-16T14:45:00Z'),
                  },
                ],
              },
            },
          });
        }),
        http.post('/trpc/case.getById', () => {
          return HttpResponse.json({
            result: {
              data: {
                ...mockCase,
                comments: [
                  ...mockCase.comments,
                  {
                    id: '3',
                    content: 'Customer confirmed they received the reset link.',
                    caseId: '1',
                    authorId: '1',
                    author: {
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                    },
                    createdAt: new Date('2024-01-16T10:30:00Z'),
                    updatedAt: new Date('2024-01-16T10:30:00Z'),
                  },
                  {
                    id: '4',
                    content: 'Password reset successful. Customer can now log in.',
                    caseId: '1',
                    authorId: '2',
                    author: {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                    },
                    createdAt: new Date('2024-01-16T14:30:00Z'),
                    updatedAt: new Date('2024-01-16T14:30:00Z'),
                  },
                  {
                    id: '5',
                    content: 'Closing this case as resolved.',
                    caseId: '1',
                    authorId: '2',
                    author: {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                    },
                    createdAt: new Date('2024-01-16T14:45:00Z'),
                    updatedAt: new Date('2024-01-16T14:45:00Z'),
                  },
                ],
              },
            },
          });
        }),
      ],
    },
  },
};
