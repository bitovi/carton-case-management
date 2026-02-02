import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { Trash, FolderX } from 'lucide-react';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Components/Toast',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'neutral'],
      description: 'Toast type/variant',
    },
    title: {
      control: 'text',
      description: 'Toast title text',
    },
    message: {
      control: 'text',
      description: 'Toast message/description',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds (0 to disable)',
    },
    open: {
      control: 'boolean',
      description: 'Whether the toast is visible',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    type: 'success',
    icon: '🎉',
    title: 'Success!',
    message: 'A new claim has been created.',
    open: true,
  },
};

export const CaseDeleted: Story = {
  args: {
    type: 'neutral',
    icon: <FolderX className="w-8 h-8" />,
    title: 'Deleted',
    message: '"Fraud Investigation" case has been successfully deleted.',
    open: true,
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    icon: '❌',
    title: 'Error',
    message: 'Failed to complete the operation. Please try again.',
    open: true,
  },
};

export const NoTitle: Story = {
  args: {
    type: 'neutral',
    message: 'This is a toast without a title.',
    open: true,
  },
};

export const NoIcon: Story = {
  args: {
    type: 'success',
    title: 'Success',
    message: 'Operation completed successfully.',
    open: true,
  },
};

export const LongMessage: Story = {
  args: {
    type: 'neutral',
    title: 'Information',
    message:
      'This is a longer message to demonstrate how the toast handles multi-line content. The toast should expand to accommodate the text while maintaining proper spacing and readability.',
    open: true,
  },
};

export const AutoDismiss: Story = {
  args: {
    type: 'success',
    icon: '✓',
    title: 'Auto Dismiss',
    message: 'This toast will auto-dismiss after 3 seconds.',
    duration: 3000,
    open: true,
  },
};

export const NeverDismiss: Story = {
  args: {
    type: 'neutral',
    title: 'Manual Only',
    message: 'This toast will not auto-dismiss (duration = 0).',
    duration: 0,
    open: true,
  },
};
