import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { CommentVoteButtons } from './CommentVoteButtons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';

// Create a mock tRPC client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});

const TRPCWrapper = ({ children }: { children: ReactNode }) => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpc.Provider>
);

const meta: Meta<typeof CommentVoteButtons> = {
  component: CommentVoteButtons,
  title: 'Components/CaseDetails/CommentVoteButtons',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TRPCWrapper>
        <Story />
      </TRPCWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentVoteButtons>;

export const NoVotes: Story = {
  args: {
    commentId: 'comment-1',
    votes: [],
    currentUserId: 'user-1',
  },
  name: 'No Votes',
};

export const WithLikes: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'LIKE', user: { id: 'user-2', name: 'Alice Johnson' } },
      { id: '2', voteType: 'LIKE', user: { id: 'user-3', name: 'Bob Smith' } },
      { id: '3', voteType: 'LIKE', user: { id: 'user-4', name: 'Charlie Davis' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'With Likes (Not Voted)',
};

export const WithDislikes: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'DISLIKE', user: { id: 'user-2', name: 'Alice Johnson' } },
      { id: '2', voteType: 'DISLIKE', user: { id: 'user-3', name: 'Bob Smith' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'With Dislikes (Not Voted)',
};

export const UserLiked: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'LIKE', user: { id: 'user-1', name: 'Current User' } },
      { id: '2', voteType: 'LIKE', user: { id: 'user-2', name: 'Alice Johnson' } },
      { id: '3', voteType: 'LIKE', user: { id: 'user-3', name: 'Bob Smith' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'User Has Liked',
};

export const UserDisliked: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'DISLIKE', user: { id: 'user-1', name: 'Current User' } },
      { id: '2', voteType: 'DISLIKE', user: { id: 'user-2', name: 'Alice Johnson' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'User Has Disliked',
};

export const MixedVotes: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'LIKE', user: { id: 'user-2', name: 'Alice Johnson' } },
      { id: '2', voteType: 'LIKE', user: { id: 'user-3', name: 'Bob Smith' } },
      { id: '3', voteType: 'LIKE', user: { id: 'user-4', name: 'Charlie Davis' } },
      { id: '4', voteType: 'DISLIKE', user: { id: 'user-5', name: 'David Lee' } },
      { id: '5', voteType: 'DISLIKE', user: { id: 'user-6', name: 'Eve Martinez' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'Mixed Votes',
};

export const ManyVotes: Story = {
  args: {
    commentId: 'comment-1',
    votes: [
      { id: '1', voteType: 'LIKE', user: { id: 'user-1', name: 'Current User' } },
      { id: '2', voteType: 'LIKE', user: { id: 'user-2', name: 'Alice' } },
      { id: '3', voteType: 'LIKE', user: { id: 'user-3', name: 'Bob' } },
      { id: '4', voteType: 'LIKE', user: { id: 'user-4', name: 'Charlie' } },
      { id: '5', voteType: 'LIKE', user: { id: 'user-5', name: 'David' } },
      { id: '6', voteType: 'LIKE', user: { id: 'user-6', name: 'Eve' } },
      { id: '7', voteType: 'LIKE', user: { id: 'user-7', name: 'Frank' } },
      { id: '8', voteType: 'DISLIKE', user: { id: 'user-8', name: 'Grace' } },
      { id: '9', voteType: 'DISLIKE', user: { id: 'user-9', name: 'Henry' } },
    ],
    currentUserId: 'user-1',
  },
  name: 'Many Votes',
};
