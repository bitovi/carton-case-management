import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeMobile: Story = {
  args: {
    type: 'mobile',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Delete</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const TypeDesktop: Story = {
  args: {
    type: 'desktop',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    open: true,
    actionButton: <Button variant="destructive">Delete</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
  },
};

export const WithActionButtonOnly: Story = {
  args: {
    type: 'mobile',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Delete</Button>,
  },
};

export const WithCancelButtonOnly: Story = {
  args: {
    type: 'mobile',
    title: 'Delete this?',
    description: 'Are you sure you want to delete this item?',
    open: true,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};
