import type { Meta, StoryObj } from '@storybook/react';
import { Comments } from './Comments';

const mockComments = [
  {
    id: '1',
    content: 'This is the first comment on the case.',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    author: {
      id: '1',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com',
    },
  },
  {
    id: '2',
    content: 'Here is a follow-up comment with more details.',
    createdAt: new Date('2024-01-16T14:30:00Z').toISOString(),
    author: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
  },
];

const mockOnSubmit = () => {};

const meta = {
  title: 'Figma Variants/Comments',
  component: Comments,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Comments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentEmptySubmissionDefaultTextareaStateDefault: Story = {
  args: {
    comments: [],
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
};

export const ContentEmptySubmissionDefaultTextareaStateHover: Story = {
  args: {
    comments: [],
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('textarea');
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const ContentEmptySubmissionDefaultTextareaStateFocus: Story = {
  args: {
    comments: [],
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('textarea');
    if (el) el.focus();
  },
};

export const ContentEmptySubmissionSubmittingTextareaStateDisabled: Story = {
  args: {
    comments: [],
    onSubmit: mockOnSubmit,
    isSubmitting: true,
  },
};

export const ContentLoadedSubmissionDefaultTextareaStateDefault: Story = {
  args: {
    comments: mockComments,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
};

export const ContentLoadedSubmissionDefaultTextareaStateHover: Story = {
  args: {
    comments: mockComments,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('textarea');
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const ContentLoadedSubmissionDefaultTextareaStateFocus: Story = {
  args: {
    comments: mockComments,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('textarea');
    if (el) el.focus();
  },
};

export const ContentLoadedSubmissionSubmittingTextareaStateDisabled: Story = {
  args: {
    comments: mockComments,
    onSubmit: mockOnSubmit,
    isSubmitting: true,
  },
};
