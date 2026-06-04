import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { TaskList } from './TaskList';

const mockTasks = [
  {
    id: '1',
    summary: 'Review policy documents',
    description: 'Review and approve policy documents for Q2',
    caseId: 'case-1',
    createdBy: 'user-1',
    assignedTo: 'user-2',
    status: 'IN_PROGRESS',
    dueDate: '2024-02-15T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
    case: { id: 'case-1', title: 'Policy Coverage Inquiry' },
    creator: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  },
  {
    id: '2',
    summary: 'Follow up with customer',
    description: 'Schedule a follow-up call',
    caseId: 'case-2',
    createdBy: 'user-1',
    assignedTo: null,
    status: 'TO_DO',
    dueDate: null,
    createdAt: '2024-01-16T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
    case: { id: 'case-2', title: 'Payment Processing Error' },
    creator: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: null,
  },
  {
    id: '3',
    summary: 'Prepare settlement report',
    description: 'Generate settlement report for case resolution',
    caseId: 'case-3',
    createdBy: 'user-2',
    assignedTo: 'user-1',
    status: 'COMPLETED',
    dueDate: '2024-01-20T00:00:00.000Z',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    case: { id: 'case-3', title: 'Claim Resolution' },
    creator: { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    assignee: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  },
];

const defaultHandlers = [
  http.get('/trpc/task.list', () => {
    return HttpResponse.json({ result: { data: mockTasks } });
  }),
  http.post('/trpc/task.list', () => {
    return HttpResponse.json({ result: { data: mockTasks } });
  }),
];

const loadingHandlers = [
  http.get('/trpc/task.list', async () => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
    return HttpResponse.json({ result: { data: mockTasks } });
  }),
  http.post('/trpc/task.list', async () => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
    return HttpResponse.json({ result: { data: mockTasks } });
  }),
];

const errorHandlers = [
  http.get('/trpc/task.list', () => {
    return HttpResponse.json(
      { error: { message: 'Failed to fetch tasks', code: 'INTERNAL_SERVER_ERROR' } },
      { status: 500 }
    );
  }),
  http.post('/trpc/task.list', () => {
    return HttpResponse.json(
      { error: { message: 'Failed to fetch tasks', code: 'INTERNAL_SERVER_ERROR' } },
      { status: 500 }
    );
  }),
];

const emptyHandlers = [
  http.get('/trpc/task.list', () => {
    return HttpResponse.json({ result: { data: [] } });
  }),
  http.post('/trpc/task.list', () => {
    return HttpResponse.json({ result: { data: [] } });
  }),
];

const meta = {
  title: 'Figma Variants/TaskList',
  component: TaskList,
  parameters: {
    layout: 'centered',
    viewport: { defaultViewport: 'responsive' },
    chromatic: { disableSnapshot: true },
    msw: { handlers: defaultHandlers },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Routes>
            <Route path="/tasks" element={<Story />} />
            <Route path="/tasks/:id" element={<Story />} />
            <Route path="/tasks/new" element={<div>Create Task</div>} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
} as Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentLoading: Story = {
  parameters: {
    msw: { handlers: loadingHandlers },
  },
};

export const ContentError: Story = {
  parameters: {
    msw: { handlers: errorHandlers },
  },
};

export const ContentEmpty: Story = {
  parameters: {
    msw: { handlers: emptyHandlers },
  },
};

export const ContentLoadedActiveItemNoneItemHoverDefault: Story = {};

export const ContentLoadedActiveItemHighlightedItemHoverDefault: Story = {
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/tasks/1']}>
          <Routes>
            <Route path="/tasks/:id" element={<Story />} />
            <Route path="/tasks/new" element={<div>Create Task</div>} />
          </Routes>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export const ContentLoadedActiveItemNoneItemHoverHover: Story = {
  play: async ({ canvasElement }) => {
    const firstLink = canvasElement.querySelector('a');
    if (firstLink) {
      firstLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      firstLink.classList.add('hover');
    }
  },
};
