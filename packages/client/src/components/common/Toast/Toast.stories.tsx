import type { Meta, StoryObj } from '@storybook/react';
import { FolderX } from 'lucide-react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Common/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    open: true,
    title: 'Success!',
    description: 'A new claim has been created.',
    icon: <span>🎉</span>,
  },
};

export const Deleted: Story = {
  args: {
    open: true,
    title: 'Deleted',
    description: '"Fraud Investigation" case has been successfully deleted.',
    icon: <FolderX className="h-10 w-10 text-gray-700" />,
  },
};

export const NoIcon: Story = {
  args: {
    open: true,
    title: 'Notification',
    description: 'This is a toast without an icon.',
  },
};

export const LongMessage: Story = {
  args: {
    open: true,
    title: 'Information',
    description:
      'This is a longer message to test how the toast handles multiple lines of text. It should wrap properly and maintain good readability.',
    icon: <span>ℹ️</span>,
  },
};
