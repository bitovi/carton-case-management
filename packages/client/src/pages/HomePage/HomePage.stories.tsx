import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { HomePage } from './';

const mockCases = [
  {
    id: 1,
    title: 'Sample Case 1',
    description: 'This is a sample case for Storybook',
    status: 'OPEN',
    creator: { id: 1, name: 'John Doe', email: 'john@example.com' },
    assignee: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Sample Case 2',
    description: 'Another sample case with a longer description to show how it wraps',
    status: 'IN_PROGRESS',
    creator: { id: 1, name: 'John Doe', email: 'john@example.com' },
    assignee: null,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 3,
    title: 'Sample Case 3',
    description: 'A closed case example',
    status: 'CLOSED',
    creator: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    assignee: { id: 1, name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
];

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
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
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Default: Story = {};

export const Loading: Story = {
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

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/case.list', () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Failed to fetch cases from database',
                code: -32603,
                data: {
                  code: 'INTERNAL_SERVER_ERROR',
                },
              },
            },
            { status: 500 }
          );
        }),
        http.post('/trpc/case.list', () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Failed to fetch cases from database',
                code: -32603,
                data: {
                  code: 'INTERNAL_SERVER_ERROR',
                },
              },
            },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

export const Empty: Story = {
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
