import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { TaskInformation } from './TaskInformation';

const mockTaskBase = {
  id: 'task-1',
  summary: 'Implement user authentication',
  description: 'Add OAuth integration for login flow.',
  status: 'TO_DO' as const,
  createdAt: '2024-06-01T00:00:00.000Z',
};

const longDescription =
  'Implement OAuth 2.0 integration with Google and GitHub providers. This includes frontend login UI with social sign-in buttons, secure token management using HTTP-only cookies, backend authorization middleware, role-based access control, session refresh logic, and comprehensive error handling for expired or revoked tokens. Must support both web and mobile clients with PKCE flow.';

const defaultHandlers = [
  http.post(/.*\/trpc.*task\.update/, () => {
    return HttpResponse.json({ result: { data: mockTaskBase } });
  }),
  http.post(/.*\/trpc.*task\.delete/, () => {
    return HttpResponse.json({ result: { data: { id: 'task-1' } } });
  }),
  http.get(/.*\/trpc.*task\.getById/, () => {
    return HttpResponse.json({ result: { data: mockTaskBase } });
  }),
  http.get(/.*\/trpc.*task\.list/, () => {
    return HttpResponse.json({ result: { data: [mockTaskBase] } });
  }),
];

const desktopParams = { viewport: { defaultViewport: 'desktop' } };
const mobileParams = { viewport: { defaultViewport: 'mobile' } };

const meta = {
  title: 'Figma Variants/TaskInformation',
  component: TaskInformation,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter initialEntries={['/tasks/task-1']}>
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
    taskId: 'task-1',
    taskData: mockTaskBase,
  },
} as Meta<typeof TaskInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutDesktopStatusToDo: Story = {
  parameters: desktopParams,
};

export const LayoutDesktopStatusInProgress: Story = {
  parameters: desktopParams,
  args: {
    taskData: { ...mockTaskBase, status: 'IN_PROGRESS' },
  },
};

export const LayoutDesktopStatusCompleted: Story = {
  parameters: desktopParams,
  args: {
    taskData: { ...mockTaskBase, status: 'COMPLETED' },
  },
};

export const LayoutDesktopStatusClosed: Story = {
  parameters: desktopParams,
  args: {
    taskData: { ...mockTaskBase, status: 'CLOSED' },
  },
};

export const LayoutMobileStatusToDo: Story = {
  parameters: mobileParams,
};

export const LayoutMobileStatusInProgress: Story = {
  parameters: mobileParams,
  args: {
    taskData: { ...mockTaskBase, status: 'IN_PROGRESS' },
  },
};

export const LayoutMobileStatusCompleted: Story = {
  parameters: mobileParams,
  args: {
    taskData: { ...mockTaskBase, status: 'COMPLETED' },
  },
};

export const LayoutMobileStatusClosed: Story = {
  parameters: mobileParams,
  args: {
    taskData: { ...mockTaskBase, status: 'CLOSED' },
  },
};

export const ContentLengthLong: Story = {
  parameters: desktopParams,
  args: {
    taskData: { ...mockTaskBase, description: longDescription },
  },
};

export const ContentLengthEmpty: Story = {
  parameters: desktopParams,
  args: {
    taskData: { ...mockTaskBase, description: '' },
  },
};

export const DeleteDialogOpen: Story = {
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));
    const menuTrigger = canvasElement.querySelector(
      'button[class*="ghost"]'
    ) as HTMLElement;
    if (menuTrigger) menuTrigger.click();
    await new Promise((r) => setTimeout(r, 400));
    const deleteItem = canvasElement.ownerDocument.querySelector(
      '[class*="destructive"]'
    ) as HTMLElement;
    if (deleteItem) deleteItem.click();
    await new Promise((r) => setTimeout(r, 300));
  },
};
