import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { TaskPage } from './TaskPage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type TaskListOutput = inferProcedureOutput<AppRouter['task']['list']>;
type TaskGetByIdOutput = inferProcedureOutput<AppRouter['task']['getById']>;
type CaseListOutput = inferProcedureOutput<AppRouter['case']['list']>;
type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;

const mockUsers: UserListOutput = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    username: 'amorgan',
    email: 'alex@example.com',
    dateJoined: new Date('2024-01-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    firstName: 'Jamie',
    lastName: 'Chen',
    username: 'jchen',
    email: 'jamie@example.com',
    dateJoined: new Date('2024-02-01T00:00:00Z'),
    createdAt: new Date('2024-02-01T00:00:00Z'),
    updatedAt: new Date('2024-02-01T00:00:00Z'),
  },
];

const mockCases: CaseListOutput = [
  {
    id: '1',
    title: 'Customer Login Issue',
    status: 'IN_PROGRESS',
    description: 'Customer cannot log in.',
    priority: 'HIGH',
    customerId: '1',
    createdBy: '1',
    assignedTo: '2',
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: { id: '2', firstName: 'Jamie', lastName: 'Chen', email: 'jamie@example.com' },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    status: 'TO_DO',
    description: 'Payment fails at checkout.',
    priority: 'MEDIUM',
    customerId: '1',
    createdBy: '1',
    assignedTo: null,
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: null,
    createdAt: new Date('2024-01-16T08:00:00Z'),
    updatedAt: new Date('2024-01-16T08:00:00Z'),
  },
];

const mockTasks: TaskListOutput = [
  {
    id: '1',
    summary: 'Investigate login failures',
    description: 'Check authentication logs for failed login attempts.',
    caseId: '1',
    createdBy: '1',
    assignedTo: '2',
    status: 'IN_PROGRESS',
    dueDate: new Date('2024-02-01T00:00:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    case: { id: '1', title: 'Customer Login Issue' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: { id: '2', firstName: 'Jamie', lastName: 'Chen', email: 'jamie@example.com' },
  },
  {
    id: '2',
    summary: 'Reset customer password',
    description: 'Reset the password for the affected customer account.',
    caseId: '1',
    createdBy: '1',
    assignedTo: '1',
    status: 'TO_DO',
    dueDate: null,
    createdAt: new Date('2024-01-16T08:00:00Z'),
    updatedAt: new Date('2024-01-16T08:00:00Z'),
    case: { id: '1', title: 'Customer Login Issue' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
  },
  {
    id: '3',
    summary: 'Verify payment gateway config',
    description: 'Check payment gateway API keys and configuration.',
    caseId: '2',
    createdBy: '2',
    assignedTo: null,
    status: 'TO_DO',
    dueDate: new Date('2024-02-15T00:00:00Z'),
    createdAt: new Date('2024-01-17T09:00:00Z'),
    updatedAt: new Date('2024-01-17T09:00:00Z'),
    case: { id: '2', title: 'Payment Processing Error' },
    creator: { id: '2', firstName: 'Jamie', lastName: 'Chen', email: 'jamie@example.com' },
    assignee: null,
  },
];

const mockTaskDetail: NonNullable<TaskGetByIdOutput> = {
  id: '1',
  summary: 'Investigate login failures',
  description: 'Check authentication logs for failed login attempts.',
  caseId: '1',
  createdBy: '1',
  assignedTo: '2',
  status: 'IN_PROGRESS',
  dueDate: new Date('2024-02-01T00:00:00Z'),
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-16T14:30:00Z'),
  case: { id: '1', title: 'Customer Login Issue' },
  creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
  assignee: { id: '2', firstName: 'Jamie', lastName: 'Chen', email: 'jamie@example.com' },
  comments: [
    {
      id: 'c1',
      content: 'Checked logs — seeing 403 errors from auth service.',
      caseId: null,
      taskId: '1',
      authorId: '2',
      createdAt: new Date('2024-01-16T10:00:00Z'),
      updatedAt: new Date('2024-01-16T10:00:00Z'),
      author: { id: '2', firstName: 'Jamie', lastName: 'Chen', email: 'jamie@example.com' },
    },
  ],
};

const createHandlers = (
  getByIdData: TaskGetByIdOutput | null,
  listData: TaskListOutput | [],
) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('task.getById')) {
            return { result: { data: getByIdData } };
          } else if (proc.includes('task.list')) {
            return { result: { data: listData } };
          } else if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      if (path.includes('task.getById')) {
        return HttpResponse.json({ result: { data: getByIdData } });
      } else if (path.includes('task.list')) {
        return HttpResponse.json({ result: { data: listData } });
      } else if (path.includes('case.list')) {
        return HttpResponse.json({ result: { data: mockCases } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('task.getById')) {
            return { result: { data: getByIdData } };
          } else if (proc.includes('task.list')) {
            return { result: { data: listData } };
          } else if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('task.getById')) {
        return HttpResponse.json({ result: { data: getByIdData } });
      } else if (proc.includes('task.list')) {
        return HttpResponse.json({ result: { data: listData } });
      } else if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: mockCases } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
  ];
};

const createLoadingHandlers = () => {
  return [
    http.get(/.*\/trpc/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: null } });
    }),
    http.post(/.*\/trpc/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: null } });
    }),
  ];
};

const createEmptyHandlers = () => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('task.getById')) {
            return { result: { data: null } };
          } else if (proc.includes('task.list')) {
            return { result: { data: [] } };
          } else if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      if (path.includes('task.getById')) {
        return HttpResponse.json({ result: { data: null } });
      } else if (path.includes('task.list')) {
        return HttpResponse.json({ result: { data: [] } });
      } else if (path.includes('case.list')) {
        return HttpResponse.json({ result: { data: mockCases } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('task.getById')) {
            return { result: { data: null } };
          } else if (proc.includes('task.list')) {
            return { result: { data: [] } };
          } else if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('task.getById')) {
        return HttpResponse.json({ result: { data: null } });
      } else if (proc.includes('task.list')) {
        return HttpResponse.json({ result: { data: [] } });
      } else if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: mockCases } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
  ];
};

const meta = {
  title: 'Figma Variants/TaskPage',
  component: TaskPage,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
} as Meta<typeof TaskPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewListLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createHandlers(null, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/tasks/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewDetailLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createHandlers(mockTaskDetail, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateLayoutDesktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createHandlers(null, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/new']}>
        <Routes>
          <Route path="/tasks/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewListLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(null, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/tasks/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewDetailLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(mockTaskDetail, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ViewCreateLayoutMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    msw: { handlers: createHandlers(null, mockTasks) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/new']}>
        <Routes>
          <Route path="/tasks/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const StateLoading: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createLoadingHandlers() },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const StateEmpty: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    msw: { handlers: createEmptyHandlers() },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/tasks/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
