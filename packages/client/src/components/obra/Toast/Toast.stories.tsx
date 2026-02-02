import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toast } from './Toast';
import { FolderX } from 'lucide-react';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'neutral', 'error'],
      description: 'Toast variant type',
    },
    title: {
      control: 'text',
      description: 'Toast title',
    },
    message: {
      control: 'text',
      description: 'Toast message text',
    },
    autoHideDuration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds (0 to disable)',
    },
  },
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const SuccessWithCelebration: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    message: 'A new claim has been created.',
    icon: '🎉',
    open: true,
    autoHideDuration: 10000,
  },
};

export const DeletedCase: Story = {
  args: {
    variant: 'neutral',
    title: 'Deleted',
    message: '"Fraud Investigation" case has been successfully deleted.',
    icon: <FolderX className="h-10 w-10 text-gray-600" />,
    open: true,
    autoHideDuration: 10000,
  },
};

export const ErrorMessage: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    icon: '❌',
    open: true,
    autoHideDuration: 10000,
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'neutral',
    title: 'Notification',
    message: 'Your changes have been saved.',
    open: true,
    autoHideDuration: 10000,
  },
};

export const NoAutoDismiss: Story = {
  args: {
    variant: 'success',
    title: 'Manual Dismiss Only',
    message: 'This toast will not auto-dismiss.',
    icon: '⏸️',
    open: true,
    autoHideDuration: 0,
  },
};
