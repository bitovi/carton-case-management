// type import removed:  Meta, StoryObj  from '@storybook/react';
import { ReactionStatistics } from './ReactionStatistics';

const meta = {
  component: ReactionStatistics,
  title: 'Components/Common/ReactionStatistics',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2958&t=3XuZBnUA9dL2i9Jv-4',
    },
  },
};

export default meta;


export const None = {
  args: {
    userVote: 'none',
    upvotes: 0,
    downvotes: 0,
  },
  name: 'UserVote: None',
};

export const Up = {
  args: {
    userVote: 'up',
    upvotes: 1,
    downvotes: 0,
  },
  name: 'UserVote: Up',
};

export const Down = {
  args: {
    userVote: 'down',
    upvotes: 0,
    downvotes: 1,
  },
  name: 'UserVote: Down',
};

export const Default = {
  args: {},
  name: 'Default (None)',
};

export const HighCounts = {
  args: {
    userVote: 'up',
    upvotes: 42,
    downvotes: 0,
  },
  name: 'High Upvote Count',
};

export const Interactive = {
  args: {
    userVote: 'none',
    upvotes: 5,
    downvotes: 2,
    onUpvote: () => console.log('Upvote clicked'),
    onDownvote: () => console.log('Downvote clicked'),
  },
  name: 'Interactive',
};

export const WithVoters = {
  args: {
    userVote: 'up',
    upvotes: 3,
    upvoters: ['Alice Johnson', 'Bob Smith', 'Charlie Davis'],
    downvotes: 2,
    downvoters: ['David Wilson', 'Eve Martinez'],
  },
  name: 'With Voter Tooltips',
};

export const WithManyVoters = {
  args: {
    userVote: 'up',
    upvotes: 7,
    upvoters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
    downvotes: 4,
    downvoters: ['John', 'Jane', 'Jack', 'Jill'],
  },
  name: 'With Many Voters (Truncated)',
};
