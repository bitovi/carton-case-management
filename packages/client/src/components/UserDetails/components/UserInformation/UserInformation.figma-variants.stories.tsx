import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { UserInformation } from './UserInformation';

const mockUserData = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  username: 'jsmith',
  email: 'jane.smith@example.com',
  dateJoined: '2024-01-15T00:00:00.000Z',
};

const defaultHandlers = [
  http.post(/.*\/trpc.*user\.update/, () => {
    return HttpResponse.json({ result: { data: mockUserData } });
  }),
  http.post(/.*\/trpc.*user\.delete/, () => {
    return HttpResponse.json({ result: { data: { id: '1' } } });
  }),
  http.get(/.*\/trpc.*user\.getById/, () => {
    return HttpResponse.json({ result: { data: mockUserData } });
  }),
  http.get(/.*\/trpc.*user\.list/, () => {
    return HttpResponse.json({ result: { data: [mockUserData] } });
  }),
];

const desktopParams = { viewport: { defaultViewport: 'desktop' } };
const mobileParams = { viewport: { defaultViewport: 'mobile' } };

const openDeleteDialog = async (canvasElement: HTMLElement) => {
  await new Promise((r) => setTimeout(r, 500));
  const menuTrigger = canvasElement.querySelector(
    'button[aria-label="More options"]'
  ) as HTMLElement;
  if (menuTrigger) menuTrigger.click();
  await new Promise((r) => setTimeout(r, 400));
  const deleteItem = canvasElement.ownerDocument.querySelector(
    '[class*="destructive"]'
  ) as HTMLElement;
  if (deleteItem) deleteItem.click();
  await new Promise((r) => setTimeout(r, 300));
};

const meta = {
  title: 'Figma Variants/UserInformation',
  component: UserInformation,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/users/1']}>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
  args: {
    userId: '1',
    userData: mockUserData,
  },
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
} as Meta<typeof UserInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutDesktopStateDefault: Story = {
  parameters: desktopParams,
};

export const LayoutMobileStateDefault: Story = {
  parameters: mobileParams,
};

export const LayoutDesktopStateDeleteDialogOpen: Story = {
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    await openDeleteDialog(canvasElement);
  },
};

export const LayoutMobileStateDeleteDialogOpen: Story = {
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    await openDeleteDialog(canvasElement);
  },
};
