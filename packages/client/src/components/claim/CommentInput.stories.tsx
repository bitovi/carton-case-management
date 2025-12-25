import type { Meta, StoryObj } from '@storybook/react';
import { CommentInput } from './CommentInput';
import { fn } from '@storybook/test';

const meta: Meta<typeof CommentInput> = {
  title: 'Claim/CommentInput',
  component: CommentInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CommentInput>;

export const Default: Story = {
  args: {
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
