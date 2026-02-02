import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FolderX } from 'lucide-react';
import { Toast } from './Toast';
import { Button } from '../Button';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Helper component for interactive stories
function ToastDemo({ variant, title, message, icon }: { variant?: 'success' | 'neutral' | 'error'; title: string; message?: string; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show Toast</Button>
      <Toast
        variant={variant}
        title={title}
        message={message}
        icon={icon}
        open={open}
        onDismiss={() => setOpen(false)}
      />
    </div>
  );
}

export const SuccessCaseCreated: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
      message="A new claim has been created."
    />
  ),
};

export const DeletedCase: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Deleted"
      message='"Fraud Investigation" case has been successfully deleted.'
      icon={<FolderX className="h-8 w-8" />}
    />
  ),
};

export const NeutralToast: Story = {
  render: () => (
    <ToastDemo
      variant="neutral"
      title="Information"
      message="This is a neutral toast message."
    />
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Error"
      message="Something went wrong. Please try again."
    />
  ),
};

export const WithoutMessage: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
    />
  ),
};

export const AutoDismissShort: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Show Toast (3s auto-dismiss)</Button>
        <Toast
          variant="success"
          title="Auto-dismiss in 3 seconds"
          message="This toast will close automatically."
          open={open}
          onDismiss={() => setOpen(false)}
          autoHideDuration={3000}
        />
      </div>
    );
  },
};
