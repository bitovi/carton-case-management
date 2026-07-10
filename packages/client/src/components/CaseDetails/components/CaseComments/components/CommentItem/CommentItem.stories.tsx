import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'Started investigating the issue. Checked login logs.',
  createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
  author: {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
};

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CaseDetails/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment: mockComment,
    currentUserName: 'Alex Morgan',
  },
};

export const NoCurrentUser: Story = {
  args: {
    comment: mockComment,
    currentUserName: null,
  },
};

export const LongComment: Story = {
  args: {
    comment: {
      ...mockComment,
      content:
        'This is a longer comment that describes the full investigation in detail. We checked all logs, contacted the customer, and found the root cause in the password reset service. The customer has been notified and the issue is resolved.',
    },
    currentUserName: 'Alex Morgan',
  },
};
