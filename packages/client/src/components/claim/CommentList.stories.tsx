import type { Meta, StoryObj } from '@storybook/react';
import { CommentList } from './CommentList';

const meta: Meta<typeof CommentList> = {
  title: 'Claim/CommentList',
  component: CommentList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CommentList>;

const mockComments = [
  {
    id: '1',
    content:
      'Initial assessment completed. Customer qualifies for emergency housing assistance.',
    author: { name: 'Alex Morgan' },
    createdAt: new Date('2025-11-29T11:55:00Z'),
  },
  {
    id: '2',
    content: 'Verified income documentation. Customer qualifies for assistance program.',
    author: { name: 'Bob Wilson' },
    createdAt: new Date('2025-12-01T14:20:00Z'),
  },
  {
    id: '3',
    content: 'Scheduled follow-up appointment for next Tuesday at 2 PM.',
    author: { name: 'Jane Smith' },
    createdAt: new Date('2025-12-10T09:30:00Z'),
  },
];

export const Default: Story = {
  args: {
    comments: mockComments,
  },
};

export const Empty: Story = {
  args: {
    comments: [],
  },
};

export const SingleComment: Story = {
  args: {
    comments: [mockComments[0]],
  },
};

export const ManyComments: Story = {
  args: {
    comments: [
      ...mockComments,
      {
        id: '4',
        content: 'Additional comment 4',
        author: { name: 'John Doe' },
        createdAt: new Date('2025-12-12T10:00:00Z'),
      },
      {
        id: '5',
        content: 'Additional comment 5',
        author: { name: 'Alex Morgan' },
        createdAt: new Date('2025-12-13T11:00:00Z'),
      },
      {
        id: '6',
        content: 'Additional comment 6',
        author: { name: 'Bob Wilson' },
        createdAt: new Date('2025-12-14T12:00:00Z'),
      },
    ],
  },
};
