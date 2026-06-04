import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CreateCasePage } from './CreateCasePage';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type CustomerListOutput = inferProcedureOutput<AppRouter['customer']['list']>;
type UserListOutput = inferProcedureOutput<AppRouter['user']['list']>;

const mockCustomers: CustomerListOutput = [
  {
    id: '1',
    firstName: 'Acme',
    lastName: 'Corp',
    username: 'acme-corp',
    email: 'acme@example.com',
    dateJoined: new Date('2024-01-01T00:00:00Z'),
    satisfactionRate: 4.5,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    firstName: 'Tech Solutions',
    lastName: 'Inc',
    username: 'tech-solutions',
    email: 'tech@example.com',
    dateJoined: new Date('2024-01-02T00:00:00Z'),
    satisfactionRate: 4.0,
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    firstName: 'Global',
    lastName: 'Systems',
    username: 'global-systems',
    email: 'global@example.com',
    dateJoined: new Date('2024-01-03T00:00:00Z'),
    satisfactionRate: 5.0,
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
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

const createHandlers = (customersData = mockCustomers, usersData = mockUsers) => {
  return [
    http.get(/.*\/trpc/, ({ request }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.includes(',')) {
        const procedures = path.split('/trpc/')[1]?.split(',') || [];
        const batchResponse = procedures.map((proc) => {
          if (proc.includes('customer.list')) {
            return { result: { data: customersData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      if (path.includes('customer.list')) {
        return HttpResponse.json({ result: { data: customersData } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('customer.list')) {
            return { result: { data: customersData } };
          } else if (proc.includes('user.list')) {
            return { result: { data: usersData } };
          } else if (proc.includes('case.create')) {
            return {
              result: {
                data: {
                  id: 'new-case-id',
                  title: 'New Case',
                  status: 'TO_DO',
                  priority: 'MEDIUM',
                  customerId: '1',
                },
              },
            };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('customer.list')) {
        return HttpResponse.json({ result: { data: customersData } });
      } else if (proc.includes('user.list')) {
        return HttpResponse.json({ result: { data: usersData } });
      } else if (proc.includes('case.create')) {
        return HttpResponse.json({
          result: {
            data: {
              id: 'new-case-id',
              title: 'New Case',
              status: 'TO_DO',
              priority: 'MEDIUM',
              customerId: '1',
            },
          },
        });
      }
    }),
  ];
};

const createSubmissionLoadingHandlers = () => {
  return [
    ...createHandlers(),
    http.post(/.*\/trpc.*case\.create/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({ result: { data: { id: 'new-case-id' } } });
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
          if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }
      if (path.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
      } else if (path.includes('user.list')) {
        return HttpResponse.json({ result: { data: mockUsers } });
      }
    }),
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('case.create')) {
            return {
              error: { message: 'Failed to create case', code: -32600 },
            };
          }
          if (proc.includes('customer.list')) {
            return { result: { data: mockCustomers } };
          } else if (proc.includes('user.list')) {
            return { result: { data: mockUsers } };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('case.create')) {
        return HttpResponse.json(
          { error: { message: 'Failed to create case', code: -32600 } },
          { status: 400 }
        );
      }
      if (proc.includes('customer.list')) {
        return HttpResponse.json({ result: { data: mockCustomers } });
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

const meta = {
  title: 'Figma Variants/CreateCasePage',
  component: CreateCasePage,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/cases/create']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CreateCasePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentStateDataLoadedFormEmpty: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
};

export const ContentStateFormPartiallyFilled: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    fillField(canvasElement, 'input#title', 'Policy Coverage Inquiry');
  },
};

export const ContentStateFormFullyFilled: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    fillField(canvasElement, 'input#title', 'Policy Coverage Inquiry');
    fillField(canvasElement, 'textarea#description', 'Customer reported an issue with their policy coverage for home insurance claim #12345.');
  },
};

export const ContentStateFormValidationErrorSingle: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const titleInput = canvasElement.querySelector('input#title') as HTMLInputElement;
    if (titleInput) {
      titleInput.focus();
      titleInput.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    }
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const ContentStateFormValidationErrorMultiple: Story = {
  parameters: {
    msw: {
      handlers: createHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Case')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const ContentStateSubmissionLoading: Story = {
  parameters: {
    msw: {
      handlers: createSubmissionLoadingHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    fillField(canvasElement, 'input#title', 'Policy Coverage Inquiry');
    fillField(canvasElement, 'textarea#description', 'Customer reported an issue with policy coverage.');
    await new Promise((r) => setTimeout(r, 300));

    const customerTrigger = canvasElement.querySelector(
      'button[role="combobox"]'
    ) as HTMLElement;
    if (customerTrigger) {
      customerTrigger.click();
      await new Promise((r) => setTimeout(r, 300));
      const option = document.querySelector('[role="option"]') as HTMLElement;
      if (option) option.click();
    }
    await new Promise((r) => setTimeout(r, 300));

    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Case')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 300));
  },
};

export const ContentStateSubmissionError: Story = {
  parameters: {
    msw: {
      handlers: createSubmissionErrorHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    fillField(canvasElement, 'input#title', 'Policy Coverage Inquiry');
    fillField(canvasElement, 'textarea#description', 'Customer reported an issue with policy coverage.');
    await new Promise((r) => setTimeout(r, 300));

    const customerTrigger = canvasElement.querySelector(
      'button[role="combobox"]'
    ) as HTMLElement;
    if (customerTrigger) {
      customerTrigger.click();
      await new Promise((r) => setTimeout(r, 300));
      const option = document.querySelector('[role="option"]') as HTMLElement;
      if (option) option.click();
    }
    await new Promise((r) => setTimeout(r, 300));

    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Case')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 1000));
  },
};
