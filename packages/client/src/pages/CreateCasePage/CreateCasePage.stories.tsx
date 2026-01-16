import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CreateCasePage } from './CreateCasePage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CustomerListOutput = inferProcedureOutput<AppRouter['customer']['list']>;
type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;

const mockCustomers: CustomerListOutput = [
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
    firstName: 'Tech Solutions',
    lastName: 'Inc',
    username: 'tech-solutions',
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

const mockUsers: UserListOutput = [
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

// Helper function to create MSW handlers for CreateCasePage
const createHandlers = (customersData = mockCustomers, usersData = mockUsers) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      // Handle batch requests (comma-separated procedures in path)
      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('customer.list')) {
            return { result: { data: customersData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      // Handle individual requests
      if (path.includes('customer.list')) {
        return HttpResponse.json({ result: { data: customersData } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      // Handle batch requests (POST with array)
      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('customer.list')) {
            return { result: { data: customersData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          } else if (proc.includes('case.create')) {
            return {
              result: {
                data: {
                  id: 'new-case-id',
                  title: 'New Case',
                  status: 'TO_DO',
                  priority: 'MEDIUM',
                  customerId: '1',
                },
              },
            };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      // Handle single request
      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('customer.list')) {
        return HttpResponse.json({ result: { data: customersData } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      } else if (proc.includes('case.create')) {
        return HttpResponse.json({
          result: {
            data: {
              id: 'new-case-id',
              title: 'New Case',
              status: 'TO_DO',
              priority: 'MEDIUM',
              customerId: '1',
            },
          },
        });
      }
    }),
  ];
};

const meta: Meta<typeof CreateCasePage> = {
  title: 'Pages/CreateCasePage',
  component: CreateCasePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/cases/create']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
};

export const WithNoUsers: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(mockCustomers, []),
    },
  },
};

export const CreateError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/.*\/trpc/, ({ request }) => {
          const url = new URL(request.url);
          const path = url.pathname;

          if (path.includes('customer.list')) {
            return HttpResponse.json({ result: { data: mockCustomers } });
          } else if (path.includes('user.list')) {
            return HttpResponse.json({ result: { data: mockUsers } });
          }
        }),
        http.post(/.*\/trpc/, async ({ request }) => {
          const body = (await request.json()) as unknown;
          const proc = (body as { path?: string })?.path || '';

          if (proc.includes('case.create')) {
            return HttpResponse.json(
              {
                error: {
                  message: 'Failed to create case',
                  code: -32600,
                },
              },
              { status: 400 }
            );
          }

          if (proc.includes('customer.list')) {
            return HttpResponse.json({ result: { data: mockCustomers } });
          } else if (proc.includes('user.list')) {
            return HttpResponse.json({ result: { data: mockUsers } });
          }
        }),
      ],
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    msw: {
      handlers: createHandlers(),
    },
  },
};
