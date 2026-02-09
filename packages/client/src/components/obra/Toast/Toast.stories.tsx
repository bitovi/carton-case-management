import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Success Toast Stories
export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    description: 'A new claim has been created.',
    emoji: '🎉',
    open: true,
  },
};

export const SuccessWithoutEmoji: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    description: 'Operation completed successfully.',
    open: true,
  },
};

export const SuccessWithoutDescription: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    emoji: '🎉',
    open: true,
  },
};

// Error/Delete Toast Stories
export const Error: Story = {
  args: {
    type: 'error',
    title: 'Deleted',
    description: "'Case-12345' case has been successfully deleted.",
    open: true,
  },
};

export const ErrorWithoutDescription: Story = {
  args: {
    type: 'error',
    title: 'Error',
    open: true,
  },
};

// Interactive Demo with Provider
function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Success!',
            description: 'A new claim has been created.',
            emoji: '🎉',
            duration: 5000,
          })
        }
      >
        Show Success Toast
      </Button>
      <Button
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Deleted',
            description: "'Case-12345' case has been successfully deleted.",
            duration: 5000,
          })
        }
      >
        Show Delete Toast
      </Button>
      <Button
        onClick={() => {
          showToast({
            type: 'success',
            title: 'First Toast',
            emoji: '1️⃣',
            duration: 10000,
          });
          setTimeout(() => {
            showToast({
              type: 'error',
              title: 'Second Toast',
              emoji: '2️⃣',
              duration: 10000,
            });
          }, 500);
        }}
      >
        Show Multiple Toasts
      </Button>
    </div>
  );
}

export const InteractiveDemo: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    description: 'A new claim has been created.',
    emoji: '🎉',
    open: true,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
