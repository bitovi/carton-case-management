import type { Meta, StoryObj } from '@storybook/react';
import { Comments } from '@/components/common/Comments';
import type { CommentItem } from '@/components/common/Comments/types';

const meta = {
  title: 'Figma Variants/TaskComments',
  component: Comments,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Comments>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAuthor = {
  id: '1',
  firstName: 'John',
  lastName: 'Developer',
  email: 'john@example.com',
};

const mockComments: CommentItem[] = [
  {
    id: '1',
    content: 'This task needs to be updated',
    createdAt: new Date('2025-05-20T10:30:00Z').toISOString(),
    author: mockAuthor,
  },
  {
    id: '2',
    content: 'I agree, let me make those changes',
    createdAt: new Date('2025-05-20T11:00:00Z').toISOString(),
    author: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
  },
];

export const ContentEmptyTextareaDefault: Story = {
  args: {
    comments: [],
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const ContentEmptyTextareaFocus: Story = {
  args: {
    comments: [],
    onSubmit: () => {},
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) textarea.focus();
  },
};

export const ContentEmptyTextareaDisabled: Story = {
  args: {
    comments: [],
    onSubmit: () => {},
    isSubmitting: true,
  },
};

export const ContentLoadedTextareaDefault: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const ContentLoadedTextareaHover: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const ContentLoadedTextareaFocus: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) textarea.focus();
  },
};

export const ContentLoadedTextareaDisabled: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: true,
  },
};
