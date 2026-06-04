import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CustomerDetails } from './CustomerDetails';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CustomerByIdOutput = inferProcedureOutput<AppRouter['customer']['getById']>;

const mockCustomer: NonNullable<CustomerByIdOutput> = {
  id: '1',
  firstName: 'Acme',
  lastName: 'Corp',
  username: 'acme-corp',
  email: 'contact@acme.com',
  dateJoined: new Date('2023-01-15T00:00:00Z'),
  satisfactionRate: 4.5,
  createdAt: new Date('2023-01-15T00:00:00Z'),
  updatedAt: new Date('2024-06-01T00:00:00Z'),
  cases: [
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

const createHandlers = (customerData: CustomerByIdOutput = mockCustomer) => [
  http.get('*/trpc/customer.getById*', () => {
    return HttpResponse.json({
      result: { data: customerData },
    });
  }),
  http.post('*/trpc/customer.getById*', () => {
    return HttpResponse.json({
      result: { data: customerData },
    });
  }),
  http.get(/.*\/trpc/, ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.includes(',')) {
      const procedures = path.split('/trpc/')[1]?.split(',') || [];
      const batchResponse = procedures.map((proc) => {
        if (proc.includes('customer.getById')) {
          return { result: { data: customerData } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }
    if (path.includes('customer.getById')) {
      return HttpResponse.json({ result: { data: customerData } });
    }
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;
    if (Array.isArray(body)) {
      const batchResponse = body.map((item: unknown) => {
        const proc = (item as { path?: string }).path || '';
        if (proc.includes('customer.getById')) {
          return { result: { data: customerData } };
        }
        if (proc.includes('customer.update')) {
          return { result: { data: customerData } };
        }
        if (proc.includes('customer.delete')) {
          return { result: { data: { id: '1' } } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }
    return HttpResponse.json({ result: { data: customerData } });
  }),
];

const meta = {
  title: 'Figma Variants/CustomerDetails',
  component: CustomerDetails,
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
        <MemoryRouter initialEntries={['/customers/1']}>
          <Routes>
            <Route path="/customers/:id" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
} as Meta<typeof CustomerDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentLoaded: Story = {};

export const ContentLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/customer.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockCustomer } });
        }),
        http.post('*/trpc/customer.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockCustomer } });
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

export const ContentNotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/customer.getById*', () => {
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post('*/trpc/customer.getById*', () => {
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
        http.post(/.*\/trpc/, async ({ request }) => {
          const body = (await request.json()) as unknown;
          if (Array.isArray(body)) {
            const batchResponse = body.map(() => ({ result: { data: null } }));
            return HttpResponse.json(batchResponse);
          }
          return HttpResponse.json({ result: { data: null } });
        }),
      ],
    },
  },
};
