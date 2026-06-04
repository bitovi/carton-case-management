import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CreateUserPage } from './CreateUserPage';

const createDefaultHandlers = () => {
  return [
    http.post(/.*\/trpc/, async ({ request }) => {
      const body = (await request.json()) as unknown;

      if (Array.isArray(body)) {
        const batchResponse = body.map((item: unknown) => {
          const proc = (item as { path?: string }).path || '';
          if (proc.includes('user.create')) {
            return {
              result: {
                data: {
                  id: 'new-user-id',
                  firstName: 'John',
                  lastName: 'Doe',
                  username: 'jdoe',
                  email: 'john@example.com',
                  dateJoined: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }
          return { result: { data: null } };
        });
        return HttpResponse.json(batchResponse);
      }

      const proc = (body as { path?: string })?.path || '';
      if (proc.includes('user.create')) {
        return HttpResponse.json({
          result: {
            data: {
              id: 'new-user-id',
              firstName: 'John',
              lastName: 'Doe',
              username: 'jdoe',
              email: 'john@example.com',
              dateJoined: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
      }
    }),
  ];
};

const createSubmittingHandlers = () => {
  return [
    http.post(/.*\/trpc/, async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
      return HttpResponse.json({
        result: {
          data: {
            id: 'new-user-id',
            firstName: 'John',
            lastName: 'Doe',
            username: 'jdoe',
            email: 'john@example.com',
          },
        },
      });
    }),
  ];
};

const fillField = (
  canvasElement: HTMLElement,
  selector: string,
  value: string
) => {
  const input = canvasElement.querySelector(selector) as HTMLInputElement;
  if (input) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    nativeInputValueSetter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

const meta = {
  title: 'Figma Variants/CreateUserPage',
  component: CreateUserPage,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/users/create']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CreateUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormStateEmpty: Story = {
  parameters: {
    msw: {
      handlers: createDefaultHandlers(),
    },
  },
};

export const FormStateValidationErrors: Story = {
  parameters: {
    msw: {
      handlers: createDefaultHandlers(),
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create User')
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
    await new Promise((r) => setTimeout(r, 500));
    fillField(canvasElement, 'input#firstName', 'John');
    fillField(canvasElement, 'input#lastName', 'Doe');
    fillField(canvasElement, 'input#username', 'jdoe');
    fillField(canvasElement, 'input#email', 'john@example.com');
    await new Promise((r) => setTimeout(r, 300));

    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create User')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 300));
  },
};
