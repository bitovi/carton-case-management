import type { Meta, StoryObj } from '@storybook/react';
import { VoteButtons } from './VoteButtons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';

// Mock tRPC provider for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});

function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

const meta: Meta<typeof VoteButtons> = {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  decorators: [
    (Story) => (
      <TRPCProvider>
        <div className="p-8">
          <Story />
        </div>
      </TRPCProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VoteButtons>;

export const NotVoted: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: null,
    },
  },
};

export const Liked: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 6,
      dislikes: 2,
      userVote: 'LIKE',
    },
  },
};

export const Disliked: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 3,
      userVote: 'DISLIKE',
    },
  },
};

export const Disabled: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: null,
    },
    disabled: true,
  },
};

export const NoVotes: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 0,
      dislikes: 0,
      userVote: null,
    },
  },
};
