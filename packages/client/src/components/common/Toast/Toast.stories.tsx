import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Common/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    message: 'A new claim has been created.',
    onDismiss: () => console.log('Dismiss clicked'),
  },
};

export const Deleted: Story = {
  args: {
    type: 'deleted',
    title: 'Deleted',
    message: "'Case ABC-123' case has been successfully deleted.",
    onDismiss: () => console.log('Dismiss clicked'),
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    onDismiss: () => console.log('Dismiss clicked'),
  },
};

export const WithoutDismiss: Story = {
  args: {
    type: 'success',
    title: 'Auto-dismiss',
    message: 'This toast will auto-dismiss in 5 seconds.',
    showDismiss: false,
  },
};

export const LongMessage: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    message: 'This is a much longer message that demonstrates how the toast component handles text wrapping and maintains its layout with longer content.',
    onDismiss: () => console.log('Dismiss clicked'),
  },
};
