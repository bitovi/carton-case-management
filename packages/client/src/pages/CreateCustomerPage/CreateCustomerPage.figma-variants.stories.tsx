import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CreateCustomerPage } from './CreateCustomerPage';

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
  title: 'Figma Variants/CreateCustomerPage',
  component: CreateCustomerPage,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/customers/create']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: [
        http.post(/.*\/trpc.*customer\.create/, () => {
          return HttpResponse.json({
            result: {
              data: {
                id: '999',
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'jsmith',
                email: 'jane@example.com',
              },
            },
          });
        }),
      ],
    },
  },
} as Meta<typeof CreateCustomerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormStateEmpty: Story = {};

export const FormStateFilled: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 300));
    fillField(canvasElement, 'input#firstName', 'Jane');
    fillField(canvasElement, 'input#lastName', 'Smith');
    fillField(canvasElement, 'input#username', 'jsmith');
    fillField(canvasElement, 'input#email', 'jane@example.com');
  },
};

export const FormStateErrors: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 300));
    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Customer')
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
      handlers: [
        http.post(/.*\/trpc.*customer\.create/, async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
          return HttpResponse.json({ result: { data: { id: '999' } } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 300));
    fillField(canvasElement, 'input#firstName', 'Jane');
    fillField(canvasElement, 'input#lastName', 'Smith');
    fillField(canvasElement, 'input#username', 'jsmith');
    fillField(canvasElement, 'input#email', 'jane@example.com');
    await new Promise((r) => setTimeout(r, 300));
    const submitBtn = Array.from(canvasElement.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Create Customer')
    );
    if (submitBtn) {
      (submitBtn as HTMLElement).click();
    }
    await new Promise((r) => setTimeout(r, 300));
  },
};
