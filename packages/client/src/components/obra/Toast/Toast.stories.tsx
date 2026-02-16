import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { PartyPopper, TriangleAlert } from 'lucide-react';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Obra/Toast',
  tags: ['autodocs'],
  argTypes: {
    onDismiss: { action: 'dismissed' },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    id: 'success-toast',
    type: 'success',
    title: 'Success!',
    message: 'A new claim has been created.',
  },
};

export const Deleted: Story = {
  args: {
    id: 'deleted-toast',
    type: 'deleted',
    title: 'Deleted',
    message: 'Case #12345 has been successfully deleted.',
  },
};

export const CustomIcon: Story = {
  args: {
    id: 'custom-toast',
    title: 'Custom Toast',
    message: 'This toast has a custom icon.',
    icon: <PartyPopper className="h-5 w-5 text-purple-600" />,
  },
};

export const LongMessage: Story = {
  args: {
    id: 'long-toast',
    type: 'success',
    title: 'Success!',
    message: 'This is a longer message to demonstrate how the toast handles multiple lines of text. The toast should expand to accommodate the content while maintaining proper spacing and alignment.',
  },
};
