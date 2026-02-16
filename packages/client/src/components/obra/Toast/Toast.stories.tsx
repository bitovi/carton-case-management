import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { Toaster } from './Toaster';
import { ToastContextProvider, useToast } from './useToast';
import { Button } from '../Button';
import { PartyPopper, TriangleAlert } from 'lucide-react';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastContextProvider>
        <ToastProvider>
          <Story />
          <Toaster />
        </ToastProvider>
      </ToastContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    description: 'A new claim has been created.',
    icon: <PartyPopper className="h-5 w-5" />,
    open: true,
    duration: 10000, // Long duration for demo
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Deleted',
    description: 'Customer Support case has been successfully deleted.',
    icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
    open: true,
    duration: 10000, // Long duration for demo
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    description: 'Your action has been completed.',
    open: true,
    duration: 10000, // Long duration for demo
  },
};

export const ShortDescription: Story = {
  args: {
    variant: 'success',
    title: 'Saved',
    description: 'Changes saved.',
    icon: <PartyPopper className="h-5 w-5" />,
    open: true,
    duration: 10000, // Long duration for demo
  },
};

export const LongDescription: Story = {
  args: {
    variant: 'destructive',
    title: 'Warning',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers. Are you sure you want to continue?',
    icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
    open: true,
    duration: 10000, // Long duration for demo
  },
};

// Interactive example showing how to trigger toasts programmatically
function ToastTriggerExample() {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      variant: 'success',
      title: 'Success!',
      description: 'A new claim has been created.',
      icon: <PartyPopper className="h-5 w-5" />,
    });
  };

  const showDeleteToast = () => {
    toast({
      variant: 'destructive',
      title: 'Deleted',
      description: 'Customer Support case has been successfully deleted.',
      icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
    });
  };

  const showMultipleToasts = () => {
    toast({
      variant: 'success',
      title: 'First toast',
      description: 'This is the first toast message.',
      icon: <PartyPopper className="h-5 w-5" />,
    });
    setTimeout(() => {
      toast({
        variant: 'success',
        title: 'Second toast',
        description: 'This is the second toast message.',
        icon: <PartyPopper className="h-5 w-5" />,
      });
    }, 500);
    setTimeout(() => {
      toast({
        variant: 'destructive',
        title: 'Third toast',
        description: 'This is the third toast message.',
        icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
      });
    }, 1000);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={showSuccessToast}>Show Success Toast</Button>
      <Button onClick={showDeleteToast} variant="destructive">
        Show Delete Toast
      </Button>
      <Button onClick={showMultipleToasts} variant="outline">
        Show Multiple Toasts
      </Button>
    </div>
  );
}

export const Interactive: StoryObj = {
  render: () => <ToastTriggerExample />,
};
