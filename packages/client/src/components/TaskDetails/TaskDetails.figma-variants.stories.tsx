import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { TaskDetails } from './TaskDetails';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type TaskByIdOutput = inferProcedureOutput<AppRouter['task']['getById']>;

const mockTask: NonNullable<TaskByIdOutput> = {
  id: '1',
  summary: 'Implement user authentication',
  description: 'Add OAuth integration with Google and GitHub for secure login.',
  caseId: '1',
  createdBy: '1',
  assignedTo: '2',
  status: 'IN_PROGRESS',
  dueDate: new Date('2024-01-30T00:00:00Z'),
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-16T14:30:00Z'),
  case: {
    id: '1',
    title: 'Customer Login Issue',
  },
  creator: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
  assignee: {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
  comments: [
    {
      id: '1',
      content: 'Started investigating the OAuth flow requirements.',
      caseId: null,
      taskId: '1',
      authorId: '2',
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
      createdAt: new Date('2024-01-15T11:00:00Z'),
      updatedAt: new Date('2024-01-15T11:00:00Z'),
    },
    {
      id: '2',
      content: 'Google OAuth integration is complete. Moving on to GitHub.',
      caseId: null,
      taskId: '1',
      authorId: '2',
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
      createdAt: new Date('2024-01-16T09:15:00Z'),
      updatedAt: new Date('2024-01-16T09:15:00Z'),
    },
  ],
};

const mockCases = [
  {
    id: '1',
    title: 'Customer Login Issue',
    description: 'Customer reports being unable to log in.',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    customerId: '1',
    createdBy: '1',
    assignedTo: '2',
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    comments: [],
  },
];

const mockUsers = [
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

const defaultHandlers = [
  http.get('*/trpc/task.getById*', () => {
    return HttpResponse.json({
      result: { data: mockTask },
    });
  }),
  http.post('*/trpc/task.getById*', () => {
    return HttpResponse.json({
      result: { data: mockTask },
    });
  }),
  http.get('*/trpc/case.list*', () => {
    return HttpResponse.json({
      result: { data: mockCases },
    });
  }),
  http.post('*/trpc/case.list*', () => {
    return HttpResponse.json({
      result: { data: mockCases },
    });
  }),
  http.get('*/trpc/user.list*', () => {
    return HttpResponse.json({
      result: { data: mockUsers },
    });
  }),
  http.post('*/trpc/user.list*', () => {
    return HttpResponse.json({
      result: { data: mockUsers },
    });
  }),
];

const meta = {
  title: 'Figma Variants/TaskDetails',
  component: TaskDetails,
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: defaultHandlers,
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/tasks/1']}>
          <Routes>
            <Route path="/tasks/:id" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
} as Meta<typeof TaskDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentStateLoadingLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: {
      handlers: [
        http.get('*/trpc/task.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockTask } });
        }),
        http.post('*/trpc/task.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockTask } });
        }),
      ],
    },
  },
};

export const ContentStateNoDataLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: {
      handlers: [
        http.get('*/trpc/task.getById*', () => {
          return HttpResponse.json({ result: { data: null } });
        }),
        http.post('*/trpc/task.getById*', () => {
          return HttpResponse.json({ result: { data: null } });
        }),
      ],
    },
  },
};

export const ContentStateLoadedLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: {
      handlers: defaultHandlers,
    },
  },
};

export const ContentStateLoadedLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: {
      handlers: defaultHandlers,
    },
  },
};
