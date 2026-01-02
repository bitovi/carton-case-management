import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CasePage } from './CasePage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CaseListOutput = inferProcedureOutput<AppRouter['case']['list']>;
type CustomerListOutput = inferProcedureOutput<AppRouter['customer']['list']>;
type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;

const mockCustomers: CustomerListOutput = [
  {
    id: '1',
    name: 'Acme Corp',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    name: 'Global Systems',
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

const mockCases: CaseListOutput = [
  {
    id: '1',
    title: 'Customer Login Issue',
    status: 'IN_PROGRESS',
    description:
      'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password.',
    priority: 'HIGH',
    customerId: '1',
    createdBy: '1',
    updatedBy: '2',
    assignedTo: '2',
    customer: { id: '1', name: 'Acme Corp' },
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    updater: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    status: 'TO_DO',
    description: 'Payment fails at checkout step. Customer receives generic error message.',
    priority: 'MEDIUM',
    customerId: '2',
    createdBy: '1',
    updatedBy: '1',
    assignedTo: null,
    customer: { id: '2', name: 'Tech Solutions Inc' },
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: null,
    updater: { id: '1', name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-16T08:00:00Z'),
    updatedAt: new Date('2024-01-16T08:00:00Z'),
  },
  {
    id: '3',
    title: 'Feature Request: Dark Mode',
    status: 'COMPLETED',
    description: 'User requesting dark mode option for better night-time viewing experience.',
    priority: 'LOW',
    customerId: '3',
    createdBy: '2',
    updatedBy: '1',
    assignedTo: '1',
    customer: { id: '3', name: 'Global Systems' },
    creator: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    assignee: { id: '1', name: 'John Doe', email: 'john@example.com' },
    updater: { id: '1', name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-20T16:00:00Z'),
  },
];

// Helper function to create MSW handlers that handle tRPC batching
const createHandlers = (getByIdData: (typeof mockCases)[0] | null, listData: typeof mockCases) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      // Handle batch requests (comma-separated procedures in path)
      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('case.getById')) {
            return { result: { data: getByIdData } };
          } else if (proc.includes('case.list')) {
            return { result: { data: listData } };
          } else if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      // Handle individual requests
      if (path.includes('case.getById')) {
        return HttpResponse.json({ result: { data: getByIdData } });
      } else if (path.includes('case.list')) {
        return HttpResponse.json({ result: { data: listData } });
      } else if (path.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      // Handle batch requests (POST with array)
      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('case.getById')) {
            return { result: { data: getByIdData } };
          } else if (proc.includes('case.list')) {
            return { result: { data: listData } };
          } else if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      // Handle single request
      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('case.getById')) {
        return HttpResponse.json({ result: { data: getByIdData } });
      } else if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: listData } });
      } else if (proc.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
  ];
};

const meta: Meta<typeof CasePage> = {
  title: 'Pages/CasePage',
  component: CasePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(mockCases[0], mockCases),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithSecondCase: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(mockCases[1], mockCases),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/2']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithCompletedCase: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(mockCases[2], mockCases),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/3']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithoutCaseId: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(mockCases[0], mockCases),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/']}>
        <Routes>
          <Route path="/cases/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: createHandlers(mockCases[0], mockCases),
    },
  },
};

export const NoCases: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/']}>
        <Routes>
          <Route path="/cases/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
        http.post('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: [],
            },
          });
        }),
        http.post('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: [],
            },
          });
        }),
        http.get(/.*\/trpc\/customer\.list/, () => {
          return HttpResponse.json({
            result: {
              data: mockCustomers,
            },
          });
        }),
        http.post(/.*\/trpc\/customer\.list/, () => {
          return HttpResponse.json({
            result: {
              data: mockCustomers,
            },
          });
        }),
        http.get(/.*\/trpc\/user\.list/, () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
        }),
        http.post(/.*\/trpc\/user\.list/, () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
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
      handlers: createHandlers(mockCases[0], mockCases),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
