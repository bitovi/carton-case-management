import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { useState } from 'react';
import { Button } from '@/components/obra/Button';
import { FileQuestion } from 'lucide-react';

const meta = {
  title: 'Common/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to control open state in stories
function ToastDemo(props: Omit<React.ComponentProps<typeof Toast>, 'open' | 'onDismiss'>) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show Toast</Button>
      <Toast {...props} open={open} onDismiss={() => setOpen(false)} />
    </div>
  );
}

export const Success: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
      message="Your changes have been saved successfully."
    />
  ),
  args: {} as any,
};

export const SuccessLongMessage: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Success!"
      message="Your changes have been saved successfully and all related records have been updated. The system is now processing the updates in the background."
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Deleted"
      message="Case #2024-001 has been permanently deleted."
    />
  ),
};

export const ErrorWithCaseName: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      title="Deleted"
      message="John Doe vs. Acme Corp case has been permanently deleted."
    />
  ),
};

export const Neutral: Story = {
  render: () => (
    <ToastDemo
      variant="neutral"
      title="Information"
      message="Your session will expire in 5 minutes."
    />
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <ToastDemo
      variant="neutral"
      title="Help Needed"
      message="Please review the documentation for more information."
      icon={<FileQuestion className="h-6 w-6 text-blue-600" />}
    />
  ),
};

export const NoAutoDissmiss: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Important Update"
      message="Please read this carefully. This toast will not auto-dismiss."
      autoDismiss={false}
    />
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <ToastDemo
      variant="success"
      title="Quick Message"
      message="This toast will auto-dismiss after 3 seconds."
      duration={3000}
    />
  ),
};

export const AlwaysOpen: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    open: true,
    onDismiss: () => alert('Toast dismissed!'),
  },
};

export const MultipleVariants: Story = {
  render: () => {
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openNeutral, setOpenNeutral] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Button onClick={() => setOpenSuccess(true)}>Show Success Toast</Button>
        <Button onClick={() => setOpenError(true)}>Show Error Toast</Button>
        <Button onClick={() => setOpenNeutral(true)}>Show Neutral Toast</Button>

        <Toast
          variant="success"
          title="Success!"
          message="Operation completed successfully."
          open={openSuccess}
          onDismiss={() => setOpenSuccess(false)}
        />

        <Toast
          variant="error"
          title="Deleted"
          message="Item has been permanently deleted."
          open={openError}
          onDismiss={() => setOpenError(false)}
        />

        <Toast
          variant="neutral"
          title="Information"
          message="This is a neutral notification."
          open={openNeutral}
          onDismiss={() => setOpenNeutral(false)}
        />
      </div>
    );
  },
};
