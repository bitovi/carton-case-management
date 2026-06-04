import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { UserPage } from './UserPage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;
type UserGetByIdOutput = inferProcedureOutput<AppRouter['user']['getById']>;

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
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Chen',
    username: 'achen',
    email: 'alice@example.com',
    dateJoined: new Date('2024-01-03T00:00:00Z'),
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
  },
];

const mockUserDetail: NonNullable<UserGetByIdOutput> = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'jdoe',
  email: 'john@example.com',
  dateJoined: new Date('2024-01-01T00:00:00Z'),
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  createdCases: [
    {
      id: '1',
      title: 'Customer Login Issue',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-16T14:30:00Z'),
    },
    {
      id: '2',
      title: 'Payment Processing Error',
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdAt: new Date('2024-01-16T08:00:00Z'),
      updatedAt: new Date('2024-01-16T08:00:00Z'),
    },
  ],
};

const createHandlers = () => [
  http.get(/.*\/trpc/, ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.includes(',')) {
      const procedures = path.split('/trpc/')[1]?.split(',') || [];
      const batchResponse = procedures.map((proc) => {
        if (proc.includes('user.getById')) {
          return { result: { data: mockUserDetail } };
        } else if (proc.includes('user.list')) {
          return { result: { data: mockUsers } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }

    if (path.includes('user.getById')) {
      return HttpResponse.json({ result: { data: mockUserDetail } });
    } else if (path.includes('user.list')) {
      return HttpResponse.json({ result: { data: mockUsers } });
    }
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;

    if (Array.isArray(body)) {
      const batchResponse = body.map((item: unknown) => {
        const proc = (item as { path?: string }).path || '';
        if (proc.includes('user.getById')) {
          return { result: { data: mockUserDetail } };
        } else if (proc.includes('user.list')) {
          return { result: { data: mockUsers } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }

    const proc = (body as { path?: string })?.path || '';
    if (proc.includes('user.getById')) {
      return HttpResponse.json({ result: { data: mockUserDetail } });
    } else if (proc.includes('user.list')) {
      return HttpResponse.json({ result: { data: mockUsers } });
    }
  }),
];

const meta = {
  title: 'Figma Variants/UserPage',
  component: UserPage,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: createHandlers(),
    },
    viewport: {
      viewports: {
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
      },
    },
  },
} as Meta<typeof UserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewDetailViewportDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateViewportDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewListViewportMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/']}>
        <Routes>
          <Route path="/users/" element={<Story />} />
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewDetailViewportMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateViewportMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
