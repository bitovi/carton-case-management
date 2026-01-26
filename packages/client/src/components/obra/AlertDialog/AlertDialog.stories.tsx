import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

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
  },
  args: {
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
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Delete</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};


export const Desktop: Story = {
  args: {
    type: 'desktop',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    open: true,
    actionButton: <Button variant="destructive">Delete</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
  },
};


export const CustomButtons: Story = {
  args: {
    type: 'mobile',
    title: 'Delete item permanently?',
    description: 'This action cannot be undone. All data will be lost.',
    open: true,
    actionButton: (
      <Button variant="destructive" size="regular" className="w-full">
        Delete Forever
      </Button>
    ),
    cancelButton: (
      <Button variant="outline" size="regular" className="w-full">
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
      <Button variant="primary" size="regular">
        Save
      </Button>
    ),
    cancelButton: (
      <Button variant="outline" size="regular">
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
    actionButton: <Button>Confirm</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
    children: <Button>Open Dialog</Button>,
  },
};

export const ConfirmationMobile: Story = {
  args: {
    type: 'mobile',
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    actionButton: <Button className="w-full">Confirm</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
    open: true,
  },
};


export const ConfirmationDesktop: Story = {
  args: {
    type: 'desktop',
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    actionButton: <Button>Confirm</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
    open: true,
  },
};

