import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { UserDetails } from './UserDetails';

const mockUser = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  username: 'jsmith',
  email: 'jane.smith@example.com',
  dateJoined: '2024-01-15T00:00:00.000Z',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-06-01T00:00:00.000Z',
  createdCases: [
    {
      id: 'case-1',
      title: 'Policy Coverage Inquiry',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-03-11T14:30:00Z',
    },
    {
      id: 'case-2',
      title: 'Billing Dispute Resolution',
      status: 'COMPLETED',
      priority: 'HIGH',
      createdAt: '2024-02-20T08:00:00Z',
      updatedAt: '2024-02-25T16:00:00Z',
    },
  ],
};

const createHandlers = (userData = mockUser) => [
  http.get('*/trpc/user.getById*', () => {
    return HttpResponse.json({
      result: { data: userData },
    });
  }),
  http.post('*/trpc/user.getById*', () => {
    return HttpResponse.json({
      result: { data: userData },
    });
  }),
  http.post(/.*\/trpc.*user\.update/, () => {
    return HttpResponse.json({ result: { data: userData } });
  }),
  http.post(/.*\/trpc.*user\.delete/, () => {
    return HttpResponse.json({ result: { data: { id: '1' } } });
  }),
  http.get(/.*\/trpc.*user\.list/, () => {
    return HttpResponse.json({ result: { data: [userData] } });
  }),
  http.get(/.*\/trpc/, ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.includes(',')) {
      const procedures = path.split('/trpc/')[1]?.split(',') || [];
      const batchResponse = procedures.map((proc) => {
        if (proc.includes('user.getById')) {
          return { result: { data: userData } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }
    if (path.includes('user.getById')) {
      return HttpResponse.json({ result: { data: userData } });
    }
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;
    if (Array.isArray(body)) {
      const batchResponse = body.map((item: unknown) => {
        const proc = (item as { path?: string }).path || '';
        if (proc.includes('user.getById')) {
          return { result: { data: userData } };
        }
        if (proc.includes('user.update')) {
          return { result: { data: userData } };
        }
        if (proc.includes('user.delete')) {
          return { result: { data: { id: '1' } } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }
    return HttpResponse.json({ result: { data: userData } });
  }),
];

const meta = {
  title: 'Figma Variants/UserDetails',
  component: UserDetails,
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: createHandlers(),
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/users/1']}>
          <Routes>
            <Route path="/users/:id" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
} as Meta<typeof UserDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentStateLoaded: Story = {};

export const ContentStateLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/user.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockUser } });
        }),
        http.post('*/trpc/user.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockUser } });
        }),
        http.get(/.*\/trpc/, async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post(/.*\/trpc/, async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: null } });
        }),
      ],
    },
  },
};

export const ContentStateNotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/user.getById*', () => {
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post('*/trpc/user.getById*', () => {
          return HttpResponse.json({ result: { data: null } });
        }),
        http.get(/.*\/trpc/, ({ request }) => {
          const url = new URL(request.url);
          const path = url.pathname;
          if (path.includes(',')) {
            const procedures = path.split('/trpc/')[1]?.split(',') || [];
            const batchResponse = procedures.map(() => {
              return { result: { data: null } };
            });
            return HttpResponse.json(batchResponse);
          }
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post(/.*\/trpc/, () => {
          return HttpResponse.json({ result: { data: null } });
        }),
      ],
    },
  },
};
