import type { Meta, StoryObj } from '@storybook/react';
import { CommentsList } from './CommentsList';

const meta = {
  title: 'Case Details/CommentsList',
  component: CommentsList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommentsList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleComments = [
  {
    id: '1',
    content: 'Initial claim review completed. Requesting additional documentation from customer.',
    createdAt: new Date('2025-11-29T14:23:00Z'),
    author: {
      id: 'user-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
    },
  },
  {
    id: '2',
    content: 'Customer has provided the requested police report and photos.',
    createdAt: new Date('2025-12-01T09:15:00Z'),
    author: {
      id: 'user-2',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
    },
  },
  {
    id: '3',
    content:
      'Reviewed the new documentation. Everything appears to be in order. Recommending claim approval.',
    createdAt: new Date('2025-12-03T16:45:00Z'),
    author: {
      id: 'user-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
    },
  },
];

export const WithComments: Story = {
  args: {
    comments: sampleComments,
  },
};

export const EmptyComments: Story = {
  args: {
    comments: [],
  },
};

export const SingleComment: Story = {
  args: {
    comments: [sampleComments[0]],
  },
};

export const ManyComments: Story = {
  args: {
    comments: [
      ...sampleComments,
      {
        id: '4',
        content: 'Claim approved. Processing payout.',
        createdAt: new Date('2025-12-04T10:30:00Z'),
        author: {
          id: 'user-2',
          name: 'Jordan Lee',
          email: 'jordan.lee@example.com',
        },
      },
      {
        id: '5',
        content: 'Payout completed. Customer notified.',
        createdAt: new Date('2025-12-05T14:20:00Z'),
        author: {
          id: 'user-1',
          name: 'Alex Morgan',
          email: 'alex.morgan@example.com',
        },
      },
    ],
  },
};
