import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast } from './Toast';
import { Button } from '../Button';
import { FolderX } from 'lucide-react';

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

export const Default: Story = {
  args: {
    open: true,
    type: 'success',
    icon: '🎉',
    title: 'Success!',
    message: 'A new claim has been created.',
  },
};

export const CaseCreated: Story = {
  args: {
    open: true,
    type: 'success',
    icon: '🎉',
    title: 'Success!',
    message: 'A new claim has been created.',
  },
};

export const CaseDeleted: Story = {
  args: {
    open: true,
    type: 'neutral',
    icon: <FolderX size={24} className="text-gray-700" />,
    title: 'Deleted',
    message: '"Fraud Investigation" case has been successfully deleted.',
  },
};

export const ErrorToast: Story = {
  args: {
    open: true,
    type: 'error',
    icon: '⚠️',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Show Toast</Button>
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          type="success"
          icon="🎉"
          title="Success!"
          message="A new claim has been created."
        />
      </div>
    );
  },
};

export const AutoDismiss: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>
          Show Toast (Auto-dismiss in 3s)
        </Button>
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          type="success"
          icon="🎉"
          title="Success!"
          message="This toast will auto-dismiss in 3 seconds."
          autoClose={3000}
        />
      </div>
    );
  },
};

export const NoAutoDismiss: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>
          Show Toast (No Auto-dismiss)
        </Button>
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          type="success"
          icon="🎉"
          title="Success!"
          message="This toast will not auto-dismiss. Click Dismiss to close."
          autoClose={0}
        />
      </div>
    );
  },
};
