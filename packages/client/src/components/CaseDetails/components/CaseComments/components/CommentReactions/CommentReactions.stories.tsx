import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CommentReactions } from './CommentReactions';
import type { CommentReaction } from './types';

const meta: Meta<typeof CommentReactions> = {
  component: CommentReactions,
  title: 'CaseDetails/CommentReactions',
  tags: ['autodocs'],
  args: {
    onReactionToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CommentReactions>;

const mockReactions: CommentReaction[] = [
  { id: '1', type: 'LIKE', userId: 'user-1' },
  { id: '2', type: 'LIKE', userId: 'user-2' },
  { id: '3', type: 'LIKE', userId: 'user-3' },
  { id: '4', type: 'DISLIKE', userId: 'user-4' },
  { id: '5', type: 'DISLIKE', userId: 'user-5' },
];

export const NoReactions: Story = {
  args: {
    commentId: 'comment-1',
    reactions: [],
    currentUserId: 'current-user',
  },
};

export const WithLikes: Story = {
  args: {
    commentId: 'comment-1',
    reactions: [
      { id: '1', type: 'LIKE', userId: 'user-1' },
      { id: '2', type: 'LIKE', userId: 'user-2' },
    ],
    currentUserId: 'current-user',
  },
};

export const WithDislikes: Story = {
  args: {
    commentId: 'comment-1',
    reactions: [
      { id: '1', type: 'DISLIKE', userId: 'user-1' },
      { id: '2', type: 'DISLIKE', userId: 'user-2' },
    ],
    currentUserId: 'current-user',
  },
};

export const Mixed: Story = {
  args: {
    commentId: 'comment-1',
    reactions: mockReactions,
    currentUserId: 'current-user',
  },
};

export const UserLiked: Story = {
  args: {
    commentId: 'comment-1',
    reactions: [
      { id: '1', type: 'LIKE', userId: 'current-user' },
      { id: '2', type: 'LIKE', userId: 'user-1' },
      { id: '3', type: 'DISLIKE', userId: 'user-2' },
    ],
    currentUserId: 'current-user',
  },
};

export const UserDisliked: Story = {
  args: {
    commentId: 'comment-1',
    reactions: [
      { id: '1', type: 'LIKE', userId: 'user-1' },
      { id: '2', type: 'DISLIKE', userId: 'current-user' },
      { id: '3', type: 'DISLIKE', userId: 'user-2' },
    ],
    currentUserId: 'current-user',
  },
};

export const Loading: Story = {
  args: {
    commentId: 'comment-1',
    reactions: mockReactions,
    currentUserId: 'current-user',
    isLoading: true,
  },
};

export const Unauthenticated: Story = {
  args: {
    commentId: 'comment-1',
    reactions: mockReactions,
    currentUserId: undefined,
  },
};
