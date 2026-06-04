import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CustomerPage } from './CustomerPage';

const mockCustomers = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'ajohnson',
    email: 'alice@example.com',
    dateJoined: new Date('2024-01-15T00:00:00Z'),
    satisfactionRate: 4.5,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    username: 'bsmith',
    email: 'bob@example.com',
    dateJoined: new Date('2024-02-20T00:00:00Z'),
    satisfactionRate: 3.8,
    createdAt: new Date('2024-02-20T00:00:00Z'),
    updatedAt: new Date('2024-02-20T00:00:00Z'),
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Williams',
    username: 'cwilliams',
    email: 'carol@example.com',
    dateJoined: new Date('2024-03-10T00:00:00Z'),
    satisfactionRate: 5.0,
    createdAt: new Date('2024-03-10T00:00:00Z'),
    updatedAt: new Date('2024-03-10T00:00:00Z'),
  },
];

const mockCustomerDetail = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Johnson',
  username: 'ajohnson',
  email: 'alice@example.com',
  dateJoined: new Date('2024-01-15T00:00:00Z'),
  satisfactionRate: 4.5,
  createdAt: new Date('2024-01-15T00:00:00Z'),
  updatedAt: new Date('2024-01-15T00:00:00Z'),
  cases: [
    {
      id: 'c1',
      title: 'Login Issue',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2024-03-01T00:00:00Z'),
      updatedAt: new Date('2024-03-02T00:00:00Z'),
    },
    {
      id: 'c2',
      title: 'Billing Question',
      status: 'COMPLETED',
      priority: 'LOW',
      createdAt: new Date('2024-02-15T00:00:00Z'),
      updatedAt: new Date('2024-02-20T00:00:00Z'),
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
        if (proc.includes('customer.getById')) {
          return { result: { data: mockCustomerDetail } };
        } else if (proc.includes('customer.list')) {
          return { result: { data: mockCustomers } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }

    if (path.includes('customer.getById')) {
      return HttpResponse.json({ result: { data: mockCustomerDetail } });
    } else if (path.includes('customer.list')) {
      return HttpResponse.json({ result: { data: mockCustomers } });
    }
  }),
  http.post(/.*\/trpc/, async ({ request }) => {
    const body = (await request.json()) as unknown;

    if (Array.isArray(body)) {
      const batchResponse = body.map((item: unknown) => {
        const proc = (item as { path?: string }).path || '';
        if (proc.includes('customer.getById')) {
          return { result: { data: mockCustomerDetail } };
        } else if (proc.includes('customer.list')) {
          return { result: { data: mockCustomers } };
        }
        return { result: { data: null } };
      });
      return HttpResponse.json(batchResponse);
    }

    const proc = (body as { path?: string })?.path || '';
    if (proc.includes('customer.getById')) {
      return HttpResponse.json({ result: { data: mockCustomerDetail } });
    } else if (proc.includes('customer.list')) {
      return HttpResponse.json({ result: { data: mockCustomers } });
    }
  }),
];

const meta = {
  title: 'Figma Variants/CustomerPage',
  component: CustomerPage,
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
  },
} as Meta<typeof CustomerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewDetailLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    figmaViewport: { width: 1280, height: 800 },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/1']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    figmaViewport: { width: 1280, height: 800 },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/new']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewListOnlyLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    figmaViewport: { width: 375, height: 667 },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/']}>
        <Routes>
          <Route path="/customers/" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewDetailLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    figmaViewport: { width: 375, height: 667 },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/1']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    figmaViewport: { width: 375, height: 667 },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/new']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
