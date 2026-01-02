import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { fn } from '@storybook/test';
import { useState } from 'react';

const meta = {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    onOpenChange: { action: 'openChanged' },
    onConfirm: { action: 'confirmed' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    confirmClassName: { control: 'text' },
    isLoading: { control: 'boolean' },
    loadingText: { control: 'text' },
  },
  args: {
    onOpenChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  },
};

export const DeleteConfirmation: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    description: 'This action cannot be undone. Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmClassName: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
};

export const Loading: Story = {
  args: {
    open: true,
    title: 'Saving Changes',
    description: 'Please wait while we save your changes...',
    confirmText: 'Save',
    cancelText: 'Cancel',
    isLoading: true,
    loadingText: 'Saving...',
  },
};

export const CustomButtons: Story = {
  args: {
    open: true,
    title: 'Proceed with Operation',
    description: 'Do you want to continue?',
    confirmText: 'Yes, Continue',
    cancelText: 'No, Go Back',
  },
};

export const LongDescription: Story = {
  args: {
    open: true,
    title: 'Important Notice',
    description:
      'This is a very long description that explains in detail what will happen when you confirm this action. It provides additional context and information to help the user make an informed decision about whether to proceed or cancel.',
    confirmText: 'I Understand',
    cancelText: 'Cancel',
  },
};

// Interactive example with state management
export const Interactive: Story = {
  render: function Interactive() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Dialog
        </button>
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => {
            console.log('Confirmed!');
            setOpen(false);
          }}
          title="Confirm Action"
          description="Are you sure you want to proceed?"
          confirmText="Confirm"
          cancelText="Cancel"
        />
      </>
    );
  },
};
