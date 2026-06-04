import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CustomerInformation } from './CustomerInformation';

const mockCustomerBase = {
  id: 'cust-1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  dateJoined: '2024-01-15T00:00:00.000Z',
  satisfactionRate: null as number | null,
};

const defaultHandlers = [
  http.post(/.*\/trpc.*customer\.update/, () => {
    return HttpResponse.json({
      result: { data: mockCustomerBase },
    });
  }),
  http.post(/.*\/trpc.*customer\.delete/, () => {
    return HttpResponse.json({
      result: { data: { id: 'cust-1' } },
    });
  }),
  http.get(/.*\/trpc.*customer\.getById/, () => {
    return HttpResponse.json({
      result: { data: mockCustomerBase },
    });
  }),
  http.get(/.*\/trpc.*customer\.list/, () => {
    return HttpResponse.json({
      result: { data: [mockCustomerBase] },
    });
  }),
];

const loadingHandlers = [
  http.post(/.*\/trpc.*customer\.update/, async () => {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 60000));
    return HttpResponse.json({ result: { data: mockCustomerBase } });
  }),
  http.post(/.*\/trpc.*customer\.delete/, () => {
    return HttpResponse.json({ result: { data: { id: 'cust-1' } } });
  }),
  http.get(/.*\/trpc.*customer/, () => {
    return HttpResponse.json({ result: { data: mockCustomerBase } });
  }),
];

const errorHandlers = [
  http.post(/.*\/trpc.*customer\.update/, () => {
    return HttpResponse.json(
      {
        error: {
          message: 'Failed to save changes',
          code: -32603,
          data: { httpStatus: 500 },
        },
      },
      { status: 500 }
    );
  }),
  http.post(/.*\/trpc.*customer\.delete/, () => {
    return HttpResponse.json({ result: { data: { id: 'cust-1' } } });
  }),
  http.get(/.*\/trpc.*customer/, () => {
    return HttpResponse.json({ result: { data: mockCustomerBase } });
  }),
];

const setInputValue = (input: HTMLInputElement, value: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  nativeInputValueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const enterEditAndSave = async (canvasElement: HTMLElement) => {
  await new Promise((r) => setTimeout(r, 500));
  const editableButton = canvasElement.querySelector(
    '[role="button"][aria-label*="click to edit"]'
  );
  if (editableButton) (editableButton as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 400));
  const input = canvasElement.querySelector(
    'input[aria-label="Edit title"]'
  ) as HTMLInputElement;
  if (input) setInputValue(input, 'Jane');
  await new Promise((r) => setTimeout(r, 200));
  const saveBtn = canvasElement.querySelector(
    '[aria-label="Save title"]'
  ) as HTMLElement;
  if (saveBtn) saveBtn.click();
  await new Promise((r) => setTimeout(r, 500));
};

const desktopParams = { viewport: { defaultViewport: 'desktop' } };
const mobileParams = { viewport: { defaultViewport: 'mobile' } };

const meta = {
  title: 'Figma Variants/CustomerInformation',
  component: CustomerInformation,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/customers/cust-1']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
    msw: {
      handlers: defaultHandlers,
    },
  },
  args: {
    customerId: 'cust-1',
    customerData: mockCustomerBase,
  },
} as Meta<typeof CustomerInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutDesktopEditStateReadRatingNone: Story = {
  parameters: desktopParams,
};

export const LayoutDesktopEditStateEditRatingNone: Story = {
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const editableButton = canvasElement.querySelector(
      '[role="button"][aria-label*="click to edit"]'
    );
    if (editableButton) (editableButton as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 300));
  },
};

export const LayoutDesktopEditStateLoadingRatingNone: Story = {
  parameters: {
    ...desktopParams,
    msw: { handlers: loadingHandlers },
  },
  play: async ({ canvasElement }) => {
    await enterEditAndSave(canvasElement);
  },
};

export const LayoutDesktopEditStateErrorRatingNone: Story = {
  parameters: {
    ...desktopParams,
    msw: { handlers: errorHandlers },
  },
  play: async ({ canvasElement }) => {
    const win = canvasElement.ownerDocument.defaultView || window;
    win.alert = () => {};
    await enterEditAndSave(canvasElement);
  },
};

export const LayoutMobileEditStateReadRatingNone: Story = {
  parameters: mobileParams,
};

export const LayoutMobileEditStateEditRatingNone: Story = {
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const editableButton = canvasElement.querySelector(
      '[role="button"][aria-label*="click to edit"]'
    );
    if (editableButton) (editableButton as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 300));
  },
};

export const LayoutDesktopEditStateReadRatingHalfStar: Story = {
  parameters: desktopParams,
  args: {
    customerData: { ...mockCustomerBase, satisfactionRate: 2.5 },
  },
};

export const LayoutDesktopEditStateReadRatingFullStars3: Story = {
  parameters: desktopParams,
  args: {
    customerData: { ...mockCustomerBase, satisfactionRate: 3 },
  },
};

export const LayoutDesktopEditStateReadRatingFullStars5: Story = {
  parameters: desktopParams,
  args: {
    customerData: { ...mockCustomerBase, satisfactionRate: 5 },
  },
};

export const LayoutDesktopEditStateReadDeleteDialogOpen: Story = {
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const moreBtn = canvasElement.querySelector(
      '[aria-label="More options"]'
    ) as HTMLElement;
    if (moreBtn) moreBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const doc = canvasElement.ownerDocument;
    const deleteBtn = Array.from(doc.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Delete Customer')
    );
    if (deleteBtn) (deleteBtn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 400));
  },
};
