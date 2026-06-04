import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeMobile: Story = {
  args: {
    type: 'mobile',
    open: true,
    title: 'Dialog Title',
    description: 'Description text',
    actionButton: <Button variant="destructive" className="w-full">Delete</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const TypeDesktop: Story = {
  args: {
    type: 'desktop',
    open: true,
    title: 'Dialog Title',
    description: 'Description text',
    actionButton: <Button variant="destructive">Delete</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
  },
};

export const TypeMobileActionButtonOnly: Story = {
  args: {
    type: 'mobile',
    open: true,
    title: 'Dialog Title',
    description: 'Description text',
    actionButton: <Button variant="destructive" className="w-full">Delete</Button>,
  },
};

export const TypeMobileCancelButtonOnly: Story = {
  args: {
    type: 'mobile',
    open: true,
    title: 'Dialog Title',
    description: 'Description text',
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};
