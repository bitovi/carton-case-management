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
    firstName: 'John',
    lastName: 'Doe',
    username: 'jdoe',
    email: 'john@example.com',
    dateJoined: new Date('2024-01-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jsmith',
    email: 'jane@example.com',
    dateJoined: new Date('2024-01-02T00:00:00Z'),
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
    assignedTo: '2',
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
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
    assignedTo: null,
    customer: { id: '2', firstName: 'Tech Solutions', lastName: 'Inc' },
    creator: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: null,
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
    assignedTo: '1',
    customer: { id: '3', firstName: 'Global', lastName: 'Systems' },
    creator: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    assignee: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-20T16:00:00Z'),
  },
];

const createHandlers = (getByIdData: (typeof mockCases)[0] | null, listData: typeof mockCases | []) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

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

const createLoadingHandlers = () => {
  return [
    http.get(/.*\/trpc/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: null } });
    }),
    http.post(/.*\/trpc/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: null } });
    }),
  ];
};

const createEmptyHandlers = () => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('case.getById')) {
            return { result: { data: null } };
          } else if (proc.includes('case.list')) {
            return { result: { data: [] } };
          } else if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      if (path.includes('case.getById')) {
        return HttpResponse.json({ result: { data: null } });
      } else if (path.includes('case.list')) {
        return HttpResponse.json({ result: { data: [] } });
      } else if (path.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('case.getById')) {
            return { result: { data: null } };
          } else if (proc.includes('case.list')) {
            return { result: { data: [] } };
          } else if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('case.getById')) {
        return HttpResponse.json({ result: { data: null } });
      } else if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: [] } });
      } else if (proc.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
  ];
};

const meta = {
  title: 'Figma Variants/CasePage',
  component: CasePage,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
} as Meta<typeof CasePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RouteDetailsLayoutDesktopDataLoaded: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createHandlers(mockCases[0], mockCases) },
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

export const RouteCreateLayoutDesktopDataLoaded: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createHandlers(null, mockCases) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/new']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const RouteListLayoutDesktopDataEmpty: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createEmptyHandlers() },
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

export const RouteCreateLayoutDesktopDataEmpty: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createEmptyHandlers() },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/new']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const RouteListLayoutMobileDataLoaded: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(mockCases[0], mockCases) },
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

export const RouteDetailsLayoutMobileDataLoaded: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(mockCases[0], mockCases) },
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

export const RouteCreateLayoutMobileDataLoaded: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(null, mockCases) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/new']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const RouteListLayoutMobileDataEmpty: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createEmptyHandlers() },
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

export const DataLoadingLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createLoadingHandlers() },
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

export const DataLoadingLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createLoadingHandlers() },
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
