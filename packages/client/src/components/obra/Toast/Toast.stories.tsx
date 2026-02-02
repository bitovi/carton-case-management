import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Components/obra/Toast',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    type: 'Success',
    title: 'Success!',
    message: 'A new claim has been created.',
    onDismiss: fn(),
  },
};

export const Deleted: Story = {
  args: {
    type: 'Deleted',
    title: 'Deleted',
    message: '"Fraud Investigation" case has been successfully deleted.',
    onDismiss: fn(),
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Custom Icon',
    message: 'This toast has a custom icon.',
    icon: <span style={{ fontSize: '32px' }}>⭐</span>,
    onDismiss: fn(),
  },
};
