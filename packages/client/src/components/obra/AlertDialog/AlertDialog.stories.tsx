import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof AlertDialog> = {
  component: AlertDialog,
  title: 'Obra/AlertDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['desktop', 'mobile'],
      description: 'Layout variant - controls button layout and text alignment',
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
    description: {
      control: 'text',
      description: 'Dialog description text',
    },
    actionLabel: {
      control: 'text',
      description: 'Simple label for primary action button',
    },
    cancelLabel: {
      control: 'text',
      description: 'Simple label for cancel button',
    },
  },
  args: {
    onAction: fn(),
    onCancel: fn(),
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Mobile: Story = {
  args: {
    type: 'mobile',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    actionLabel: 'Delete',
    cancelLabel: 'Cancel',
    open: true,
  },
};


export const Desktop: Story = {
  args: {
    type: 'desktop',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    actionLabel: 'Delete',
    cancelLabel: 'Cancel',
    open: true,
  },
};


export const CustomButtons: Story = {
  args: {
    type: 'mobile',
    title: 'Delete item permanently?',
    description: 'This action cannot be undone. All data will be lost.',
    open: true,
    actionButton: (
      <Button variant="destructive" size="default" className="w-full">
        Delete Forever
      </Button>
    ),
    cancelButton: (
      <Button variant="outline" size="default" className="w-full">
        Keep Item
      </Button>
    ),
  },
};


export const DesktopCustomButtons: Story = {
  args: {
    type: 'desktop',
    title: 'Save changes?',
    description: 'Do you want to save your changes before closing?',
    open: true,
    actionButton: (
      <Button variant="default" size="default">
        Save
      </Button>
    ),
    cancelButton: (
      <Button variant="outline" size="default">
        Discard
      </Button>
    ),
  },
};


export const WithTrigger: Story = {
  args: {
    type: 'desktop',
    title: 'Confirm action',
    description: 'Please confirm you want to proceed with this action.',
    actionLabel: 'Confirm',
    cancelLabel: 'Cancel',
    children: <Button>Open Dialog</Button>,
  },
};

export const ConfirmationMobile: Story = {
  args: {
    type: 'mobile',
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    actionLabel: 'Confirm',
    cancelLabel: 'Cancel',
    open: true,
  },
};


export const ConfirmationDesktop: Story = {
  args: {
    type: 'desktop',
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    actionLabel: 'Confirm',
    cancelLabel: 'Cancel',
    open: true,
  },
};

