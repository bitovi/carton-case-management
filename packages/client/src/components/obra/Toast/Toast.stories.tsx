import type { Meta, StoryObj } from '@storybook/react';
import { PartyPopper, FolderX, Info } from 'lucide-react';
import { Toast } from './Toast';
import { useState } from 'react';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Wrapper component to control toast state in stories
function ToastWrapper({ type, title, message, icon, duration }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Show Toast</Button>
      <Toast
        type={type}
        title={title}
        message={message}
        icon={icon}
        open={open}
        onDismiss={() => setOpen(false)}
        duration={duration}
      />
    </div>
  );
}

export const SuccessNewCase: Story = {
  render: () => (
    <ToastWrapper
      type="Success"
      title="Success!"
      message="A new claim has been created."
      icon={<PartyPopper className="h-6 w-6" />}
    />
  ),
};

export const DeletedCase: Story = {
  render: () => (
    <ToastWrapper
      type="Neutral"
      title="Deleted"
      message='"Fraud Investigation" case has been successfully deleted.'
      icon={<FolderX className="h-6 w-6" />}
    />
  ),
};

export const ErrorMessage: Story = {
  render: () => (
    <ToastWrapper
      type="Error"
      title="Error"
      message="Failed to complete the operation. Please try again."
      icon={<Info className="h-6 w-6" />}
    />
  ),
};

export const NeutralWithoutIcon: Story = {
  render: () => (
    <ToastWrapper
      type="Neutral"
      title="Information"
      message="This is a neutral toast message."
    />
  ),
};

export const NoAutoDismiss: Story = {
  render: () => (
    <ToastWrapper
      type="Neutral"
      title="Manual Dismiss Only"
      message="This toast will not auto-dismiss."
      icon={<Info className="h-6 w-6" />}
      duration={0}
    />
  ),
};

export const ShortDuration: Story = {
  render: () => (
    <ToastWrapper
      type="Success"
      title="Quick Toast"
      message="This toast will dismiss after 3 seconds."
      icon={<PartyPopper className="h-6 w-6" />}
      duration={3000}
    />
  ),
};
