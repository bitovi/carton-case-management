import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CreateTaskPage } from './CreateTaskPage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CaseListOutput = inferProcedureOutput<AppRouter['case']['list']>;
type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;

const mockCases: CaseListOutput = [
  {
    id: 'case-1',
    title: 'Policy Coverage Inquiry',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    description: 'Customer needs help with policy coverage',
    customerId: '1',
    createdBy: '1',
    assignedTo: '1',
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-10T00:00:00Z'),
    customer: { id: '1', firstName: 'Acme', lastName: 'Corp' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
  },
  {
    id: 'case-2',
    title: 'Billing Dispute Resolution',
    status: 'TO_DO',
    priority: 'MEDIUM',
    description: 'Resolve billing discrepancy',
    customerId: '2',
    createdBy: '1',
    assignedTo: '2',
    createdAt: new Date('2024-01-11T00:00:00Z'),
    updatedAt: new Date('2024-01-11T00:00:00Z'),
    customer: { id: '2', firstName: 'Tech', lastName: 'Solutions' },
    creator: { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
    assignee: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  },
];

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
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jsmith',
    email: 'jane@example.com',
    dateJoined: new Date('2024-01-02T00:00:00Z'),
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
];

const createHandlers = (casesData = mockCases, usersData = mockUsers) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('case.list')) {
            return { result: { data: casesData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      if (path.includes('case.list')) {
        return HttpResponse.json({ result: { data: casesData } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('case.list')) {
            return { result: { data: casesData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          } else if (proc.includes('task.create')) {
            return {
              result: {
                data: {
                  id: 'new-task-id',
                  summary: 'New Task',
                  description: 'Task description',
                  caseId: 'case-1',
                  status: 'TO_DO',
                  createdBy: '1',
                },
              },
            };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: casesData } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      } else if (proc.includes('task.create')) {
        return HttpResponse.json({
          result: {
            data: {
              id: 'new-task-id',
              summary: 'New Task',
              description: 'Task description',
              caseId: 'case-1',
              status: 'TO_DO',
              createdBy: '1',
            },
          },
        });
      }
    }),
  ];
};

const createSubmittingHandlers = () => {
  return [
    ...createHandlers(),
    http.post(/.*\/trpc.*task\.create/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: { id: 'new-task-id', caseId: 'case-1' } } });
    }),
  ];
};

const createSubmissionErrorHandlers = () => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;
      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }
      if (path.includes('case.list')) {
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
          if (proc.includes('task.create')) {
            return {
              error: { message: 'Failed to create task', code: -32600 },
            };
          }
          if (proc.includes('case.list')) {
            return { result: { data: mockCases } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('task.create')) {
        return HttpResponse.json(
          { error: { message: 'Failed to create task', code: -32600 } },
          { status: 400 }
        );
      }
      if (proc.includes('case.list')) {
        return HttpResponse.json({ result: { data: mockCases } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
  ];
};

const fillField = (
  canvasElement: HTMLElement,
  selector: string,
  value: string
) => {
  const input = canvasElement.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
  if (input) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set || Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    nativeInputValueSetter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

const fillFormAndSelectCase = async (canvasElement: HTMLElement) => {
  await new Promise((r) => setTimeout(r, 500));
  fillField(canvasElement, 'input#summary', 'Review policy documentation');
  fillField(canvasElement, 'textarea#description', 'Review and update the policy documentation for the latest coverage changes requested by the customer.');
  await new Promise((r) => setTimeout(r, 300));

  const comboboxes = canvasElement.querySelectorAll('button[role="combobox"]');
  const caseTrigger = comboboxes[0] as HTMLElement;
  if (caseTrigger) {
    caseTrigger.click();
    await new Promise((r) => setTimeout(r, 300));
    const option = document.querySelector('[role="option"]') as HTMLElement;
    if (option) option.click();
  }
  await new Promise((r) => setTimeout(r, 300));
};

const meta = {
  title: 'Figma Variants/CreateTaskPage',
  component: CreateTaskPage,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/tasks/create']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CreateTaskPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormStateEmpty: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
};

export const FormStateFilled: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await fillFormAndSelectCase(canvasElement);
  },
};

export const FormStateValidationErrors: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Task')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const FormStateSubmitting: Story = {
  parameters: {
    msw: {
      handlers: createSubmittingHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await fillFormAndSelectCase(canvasElement);

    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Task')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 300));
  },
};

export const FormStateSubmissionError: Story = {
  parameters: {
    msw: {
      handlers: createSubmissionErrorHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await fillFormAndSelectCase(canvasElement);

    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Task')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 1000));
  },
};
