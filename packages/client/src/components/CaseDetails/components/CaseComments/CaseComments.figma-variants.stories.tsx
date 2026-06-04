import type { Meta, StoryObj } from '@storybook/react';
import { Comments } from '@/components/common/Comments';

const meta = {
  title: 'Figma Variants/CaseComments',
  component: Comments,
  decorators: [],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Comments>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAuthor = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
};

const mockComments = [
  {
    id: '1',
    content: 'This is the first comment',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    caseId: 'case-1',
    taskId: null,
    authorId: '1',
    author: mockAuthor,
  },
  {
    id: '2',
    content: 'This is a follow-up comment with more details',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    caseId: 'case-1',
    taskId: null,
    authorId: '1',
    author: mockAuthor,
  },
];

export const ContentEmptyTextareaDefault: Story = {
  args: {
    comments: [],
    onSubmit: () => {},
    isSubmitting: false,
  },
};

export const ContentEmptyTextareaFocused: Story = {
  args: {
    comments: [],
    onSubmit: () => {},
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
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

export const ContentLoadedTextareaFocused: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  },
};

export const ContentLoadedTextareaDisabled: Story = {
  args: {
    comments: mockComments,
    onSubmit: () => {},
    isSubmitting: true,
  },
};

export const TextareaHovered: Story = {
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
