import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { UserList } from './UserList';

const mockUsers = [
  { id: '1', firstName: 'Alice', lastName: 'Johnson', username: 'ajohnson', email: 'alice@example.com', dateJoined: '2024-01-15T00:00:00.000Z', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { id: '2', firstName: 'Bob', lastName: 'Smith', username: 'bsmith', email: 'bob@example.com', dateJoined: '2024-02-10T00:00:00.000Z', createdAt: '2024-02-10T00:00:00.000Z', updatedAt: '2024-02-10T00:00:00.000Z' },
  { id: '3', firstName: 'Carol', lastName: 'Williams', username: 'cwilliams', email: 'carol@example.com', dateJoined: '2024-03-05T00:00:00.000Z', createdAt: '2024-03-05T00:00:00.000Z', updatedAt: '2024-03-05T00:00:00.000Z' },
  { id: '4', firstName: 'David', lastName: 'Brown', username: 'dbrown', email: 'david@example.com', dateJoined: '2024-04-20T00:00:00.000Z', createdAt: '2024-04-20T00:00:00.000Z', updatedAt: '2024-04-20T00:00:00.000Z' },
];

const meta = {
  title: 'Figma Variants/UserList',
  component: UserList,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: [
        http.get('/trpc/user.list', () => {
          return HttpResponse.json({
            result: { data: mockUsers },
          });
        }),
        http.post('/trpc/user.list', () => {
          return HttpResponse.json({
            result: { data: mockUsers },
          });
        }),
      ],
    },
  },
} as Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentStateLoading: Story = {
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
        http.get('/trpc/user.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockUsers } });
        }),
        http.post('/trpc/user.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockUsers } });
        }),
      ],
    },
  },
};

export const ContentStateError: Story = {
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
        http.get('/trpc/user.list', () => {
          return HttpResponse.json(
            { error: { message: 'Failed to fetch users', code: 'INTERNAL_SERVER_ERROR' } },
            { status: 500 },
          );
        }),
        http.post('/trpc/user.list', () => {
          return HttpResponse.json(
            { error: { message: 'Failed to fetch users', code: 'INTERNAL_SERVER_ERROR' } },
            { status: 500 },
          );
        }),
      ],
    },
  },
};

export const ContentStateEmpty: Story = {
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
        http.get('/trpc/user.list', () => {
          return HttpResponse.json({ result: { data: [] } });
        }),
        http.post('/trpc/user.list', () => {
          return HttpResponse.json({ result: { data: [] } });
        }),
      ],
    },
  },
};

export const ContentStateLoaded: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const ContentStateLoadedActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/users/2']}>
        <Routes>
          <Route path="/users/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
