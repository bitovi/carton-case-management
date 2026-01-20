import type { Meta, StoryObj } from '@storybook/react';
import { ReactionStatistics } from './ReactionStatistics';

const meta = {
  title: 'Components/ReactionStatistics',
  component: ReactionStatistics,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReactionStatistics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rest: Story = {
  args: {
    upvoteCount: 0,
    downvoteCount: 0,
  },
};

export const Count: Story = {
  args: {
    upvoteCount: 5,
    downvoteCount: 2,
    hasUserUpvoted: false,
    hasUserDownvoted: false,
  },
};

export const Selected: Story = {
  args: {
    upvoteCount: 1,
    downvoteCount: 0,
    hasUserUpvoted: true,
    hasUserDownvoted: false,
  },
};

export const WithTooltip: Story = {
  args: {
    upvoteCount: 3,
    downvoteCount: 1,
    hasUserUpvoted: false,
    hasUserDownvoted: false,
    upvoters: ['Alex Morgan', 'Greg Miller', 'Andrew Smith'],
    downvoters: ['John Doe'],
  },
};

export const UserDownvoted: Story = {
  args: {
    upvoteCount: 0,
    downvoteCount: 1,
    hasUserUpvoted: false,
    hasUserDownvoted: true,
  },
};

export const MixedReactions: Story = {
  args: {
    upvoteCount: 10,
    downvoteCount: 3,
    hasUserUpvoted: true,
    hasUserDownvoted: false,
    upvoters: ['Alex Morgan', 'Jordan Doe', 'Taylor Smith', 'John Doe', 'Jane Smith', 'Bob Williams', 'Alice Johnson', 'Mike Brown', 'Sarah Davis', 'Tom Wilson'],
    downvoters: ['Chris Evans', 'Emma Watson', 'David Lee'],
  },
};
