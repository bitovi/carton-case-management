import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseList } from './CaseList';

const mockCases = [
  {
    id: '1',
    title: 'Customer Login Issue',
    status: 'IN_PROGRESS',
    description: 'Customer cannot log in',
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    status: 'TO_DO',
    description: 'Payment fails at checkout',
    customer: { id: '2', firstName: 'Tech Solutions', lastName: 'Inc' },
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: null,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Feature Request: Dark Mode',
    status: 'COMPLETED',
    description: 'User requesting dark mode option',
    customer: { id: '3', firstName: 'Global', lastName: 'Systems' },
    creator: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    assignee: { id: '1', name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
];

const meta: Meta<typeof CaseList> = {
  title: 'Components/CaseList',
  component: CaseList,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('/trpc/case.list', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.post('/trpc/case.list', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
      ],
    },
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
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.post('/trpc/case.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
      ],
    },
  },
};

export const Empty: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.list', () => {
          return HttpResponse.json({
            result: {
              data: [],
            },
          });
        }),
        http.post('/trpc/case.list', () => {
          return HttpResponse.json({
            result: {
              data: [],
            },
          });
        }),
      ],
    },
  },
};

export const WithActiveCase: Story = {
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
