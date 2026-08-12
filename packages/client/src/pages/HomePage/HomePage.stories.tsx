import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';
import { TrpcProvider } from '@/lib/trpc';
import { HomePage } from './HomePage';

type MeOutput = inferProcedureOutput<AppRouter['auth']['me']>;

const mockUser: MeOutput = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@carton.com',
};

const rows = (count: number) => Array.from({ length: count }, (_, index) => ({ id: `${index + 1}` }));

const resolve = (procedure: string, counts: { cases: number; users: number; customers: number }) => {
  if (procedure.includes('auth.me')) {
    return { result: { data: mockUser } };
  }
  if (procedure.includes('case.list')) {
    return { result: { data: rows(counts.cases) } };
  }
  if (procedure.includes('user.list')) {
    return { result: { data: rows(counts.users) } };
  }
  if (procedure.includes('customer.list')) {
    return { result: { data: rows(counts.customers) } };
  }
  return { result: { data: null } };
};

const createHandlers = (counts: { cases: number; users: number; customers: number }) => [
  http.get(/.*\/trpc/, ({ request }) => {
    const path = new URL(request.url).pathname;

    if (path.includes(',')) {
      const procedures = path.split('/trpc/')[1]?.split(',') || [];
      return HttpResponse.json(procedures.map((procedure) => resolve(procedure, counts)));
    }

    return HttpResponse.json(resolve(path, counts));
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;

    if (Array.isArray(body)) {
      return HttpResponse.json(
        body.map((item: unknown) => resolve((item as { path?: string }).path || '', counts))
      );
    }

    return HttpResponse.json(resolve((body as { path?: string })?.path || '', counts));
  }),
];

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/']}>
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
      handlers: createHandlers({ cases: 5, users: 6, customers: 5 }),
    },
  },
};

export const EmptyWorkspace: Story = {
  parameters: {
    msw: {
      handlers: createHandlers({ cases: 0, users: 0, customers: 0 }),
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    msw: {
      handlers: createHandlers({ cases: 5, users: 6, customers: 5 }),
    },
  },
};
