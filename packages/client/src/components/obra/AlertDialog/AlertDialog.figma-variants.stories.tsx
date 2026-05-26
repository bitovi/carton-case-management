import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/AlertDialog',
  component: AlertDialog,
  decorators: [],
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

// Dependent axis combinations (type x state: 2 x 2 = 4 variants)

export const TypeMobileStateOpen: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Action</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const TypeMobileStateClosed: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    open: false,
    actionButton: <Button variant="destructive" className="w-full">Action</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const TypeDesktopStateOpen: Story = {
  args: {
    type: 'desktop',
    title: 'Dialog title',
    description: 'Dialog description',
    open: true,
    actionButton: <Button variant="destructive">Action</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
  },
};

export const TypeDesktopStateClosed: Story = {
  args: {
    type: 'desktop',
    title: 'Dialog title',
    description: 'Dialog description',
    open: false,
    actionButton: <Button variant="destructive">Action</Button>,
    cancelButton: <Button variant="outline">Cancel</Button>,
  },
};

// Independent property screenshots (at default dependent values: type=mobile, state=open)

export const WithActionButton: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Action</Button>,
  },
};

export const WithCancelButton: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    open: true,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const WithBothButtons: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    open: true,
    actionButton: <Button variant="destructive" className="w-full">Action</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
  },
};

export const WithTrigger: Story = {
  args: {
    type: 'mobile',
    title: 'Dialog title',
    description: 'Dialog description',
    actionButton: <Button variant="destructive" className="w-full">Action</Button>,
    cancelButton: <Button variant="outline" className="w-full">Cancel</Button>,
    children: <Button>Open Dialog</Button>,
  },
};
