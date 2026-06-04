import type { Meta, StoryObj } from '@storybook/react';
import { ReactionStatistics } from './ReactionStatistics';

const meta = {
  title: 'Figma Variants/ReactionStatistics',
  component: ReactionStatistics,
  decorators: [],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof ReactionStatistics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserVoteNone: Story = {
  args: {
    userVote: 'none',
    upvotes: 5,
    downvotes: 2,
    upvoters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    downvoters: ['Frank', 'Grace'],
  },
};

export const UserVoteUp: Story = {
  args: {
    userVote: 'up',
    upvotes: 5,
    downvotes: 2,
    upvoters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    downvoters: ['Frank', 'Grace'],
  },
};

export const UserVoteDown: Story = {
  args: {
    userVote: 'down',
    upvotes: 5,
    downvotes: 2,
    upvoters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    downvoters: ['Frank', 'Grace'],
  },
};
