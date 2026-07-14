import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'This is a sample comment used to demonstrate the reaction row.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  author: {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
  },
};

const mockCurrentUser = {
  id: '2',
  firstName: 'Jamie',
  lastName: 'Lee',
  email: 'jamie@example.com',
};

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CaseDetails/CaseComments/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    comment: mockComment,
    currentUser: mockCurrentUser,
  },
};
