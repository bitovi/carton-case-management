import type { Meta, StoryObj } from '@storybook/react';
import { FolderX } from 'lucide-react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const SuccessDefault: Story = {
  args: {
    type: 'Success',
    title: 'Success!',
    message: 'A new claim has been created.',
    icon: '🎉',
    open: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const SuccessWithoutIcon: Story = {
  args: {
    type: 'Success',
    title: 'Success!',
    message: 'A new claim has been created.',
    open: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const DeletedCase: Story = {
  args: {
    type: 'Neutral',
    title: 'Deleted',
    message: '"Fraud Investigation" case has been successfully deleted.',
    icon: <FolderX className="h-6 w-6" />,
    open: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Error: Story = {
  args: {
    type: 'Error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    open: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Neutral: Story = {
  args: {
    type: 'Neutral',
    title: 'Information',
    message: 'This is a neutral toast message.',
    open: true,
    onClose: () => console.log('Toast closed'),
  },
};
