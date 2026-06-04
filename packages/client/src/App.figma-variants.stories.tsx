import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import App from './App';

const mockUser = {
  id: '1',
  email: 'alex.morgan@example.com',
  firstName: 'Alex',
  lastName: 'Morgan',
};

const mockCases = [
  {
    id: '1',
    title: 'Customer Login Issue',
    status: 'IN_PROGRESS',
    description: 'Customer reports being unable to log in.',
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
];

const createBatchHandler = (
  resolver: (proc: string) => unknown,
) => [
  http.get(/.*\/trpc/, ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.includes(',')) {
      const procedures = path.split('/trpc/')[1]?.split(',') || [];
      return HttpResponse.json(procedures.map((proc) => ({ result: { data: resolver(proc) } })));
    }
    const proc = path.split('/trpc/')[1] || '';
    return HttpResponse.json({ result: { data: resolver(proc) } });
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;
    if (Array.isArray(body)) {
      return HttpResponse.json(
        body.map((item: unknown) => ({
          result: { data: resolver((item as { path?: string }).path || '') },
        })),
      );
    }
    const proc = (body as { path?: string })?.path || '';
    return HttpResponse.json({ result: { data: resolver(proc) } });
  }),
];

const meta = {
  title: 'Figma Variants/App',
  component: App,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/cases/']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/.*\/trpc/, async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post(/.*\/trpc/, async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
          return HttpResponse.json({ result: { data: null } });
        }),
      ],
    },
  },
};

export const StateError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/.*\/trpc/, () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.post(/.*\/trpc/, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

export const StateLoaded: Story = {
  parameters: {
    msw: {
      handlers: createBatchHandler((proc) => {
        if (proc.includes('auth.me')) return mockUser;
        if (proc.includes('case.list')) return mockCases;
        if (proc.includes('customer.list')) return [];
        if (proc.includes('user.list')) return [];
        return null;
      }),
    },
  },
};
