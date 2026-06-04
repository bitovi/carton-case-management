// type import removed:  Meta, StoryObj  from '@storybook/react';
import { VoteButton } from './VoteButton';

const meta = {
  component: VoteButton,
  title: 'Components/Common/VoteButton',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2779&t=3XuZBnUA9dL2i9Jv-4',
    },
  },
};

export default meta;


export const UpDefaultNoCount = {
  args: {
    type: 'up',
    active: false,
    showCount: false,
  },
  name: 'Up - Default - Icon Only',
};

export const UpDefaultWithCount = {
  args: {
    type: 'up',
    active: false,
    showCount: true,
    count: 1,
  },
  name: 'Up - Default - With Count',
};

export const UpActiveNoCount = {
  args: {
    type: 'up',
    active: true,
    showCount: false,
  },
  name: 'Up - Active - Icon Only',
};

export const UpActiveWithCount = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 1,
  },
  name: 'Up - Active - With Count',
};

export const DownDefaultNoCount = {
  args: {
    type: 'down',
    active: false,
    showCount: false,
  },
  name: 'Down - Default - Icon Only',
};

export const DownDefaultWithCount = {
  args: {
    type: 'down',
    active: false,
    showCount: true,
    count: 1,
  },
  name: 'Down - Default - With Count',
};

export const DownActiveNoCount = {
  args: {
    type: 'down',
    active: true,
    showCount: false,
  },
  name: 'Down - Active - Icon Only',
};

export const DownActiveWithCount = {
  args: {
    type: 'down',
    active: true,
    showCount: true,
    count: 1,
  },
  name: 'Down - Active - With Count',
};

export const Default = {
  args: {
    type: 'up',
    active: false,
    showCount: true,
    count: 0,
  },
  name: 'Default (Up, Inactive, Count 0)',
};

export const HighCount = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 999,
  },
  name: 'High Count Example',
};

export const WithVoters = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 3,
    voters: ['Alice Johnson', 'Bob Smith', 'Charlie Davis'],
  },
  name: 'With Voters Tooltip',
};

export const WithManyVoters = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 7,
    voters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
  },
  name: 'With Many Voters (Truncated)',
};

export const DownWithVoters = {
  args: {
    type: 'down',
    active: true,
    showCount: true,
    count: 2,
    voters: ['John Doe', 'Jane Smith'],
  },
  name: 'Down Vote With Voters',
};

