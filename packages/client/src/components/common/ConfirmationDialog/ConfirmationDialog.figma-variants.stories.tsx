import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { fn } from '@storybook/test';

const meta = {
  title: 'Figma Variants/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  },
} as Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StyleDefaultLoadingFalse: Story = {
  args: {
    confirmClassName: '',
    isLoading: false,
  },
};

export const StyleDefaultLoadingTrue: Story = {
  args: {
    confirmClassName: '',
    isLoading: true,
    loadingText: 'Saving...',
  },
};

export const StyleDestructiveLoadingFalse: Story = {
  args: {
    confirmClassName: 'bg-red-600 hover:bg-red-700',
    isLoading: false,
    confirmText: 'Delete',
    title: 'Delete Item',
    description: 'This action cannot be undone. Are you sure you want to delete this item?',
  },
};

export const StyleDestructiveLoadingTrue: Story = {
  args: {
    confirmClassName: 'bg-red-600 hover:bg-red-700',
    isLoading: true,
    confirmText: 'Delete',
    loadingText: 'Deleting...',
    title: 'Delete Item',
    description: 'This action cannot be undone. Are you sure you want to delete this item?',
  },
};
