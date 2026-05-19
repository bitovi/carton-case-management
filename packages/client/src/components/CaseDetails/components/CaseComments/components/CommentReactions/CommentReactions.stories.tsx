import type { Meta, StoryObj } from '@storybook/react';
import { CommentReactions } from './CommentReactions';

const meta: Meta<typeof CommentReactions> = {
  title: 'Components/CaseDetails/CaseComments/CommentReactions',
  component: CommentReactions,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    reactions: [],
    currentUserId: 'u1',
    onReact: () => {},
  },
};

export const WithLikes: Story = {
  args: {
    reactions: [
      { id: 'r1', type: 'LIKE', userId: 'u2' },
      { id: 'r2', type: 'LIKE', userId: 'u3' },
      { id: 'r3', type: 'LIKE', userId: 'u4' },
    ],
    currentUserId: 'u1',
    onReact: () => {},
  },
};

export const CurrentUserLiked: Story = {
  args: {
    reactions: [
      { id: 'r1', type: 'LIKE', userId: 'u1' },
      { id: 'r2', type: 'DISLIKE', userId: 'u2' },
    ],
    currentUserId: 'u1',
    onReact: () => {},
  },
};

export const CurrentUserDisliked: Story = {
  args: {
    reactions: [
      { id: 'r1', type: 'LIKE', userId: 'u2' },
      { id: 'r2', type: 'DISLIKE', userId: 'u1' },
    ],
    currentUserId: 'u1',
    onReact: () => {},
  },
};

export const Unauthenticated: Story = {
  args: {
    reactions: [
      { id: 'r1', type: 'LIKE', userId: 'u2' },
      { id: 'r2', type: 'DISLIKE', userId: 'u3' },
    ],
    onReact: () => {},
  },
};
