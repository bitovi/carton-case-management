import type { Meta, StoryObj } from '@storybook/react';
import { VoteButton } from './VoteButton';

const meta: Meta<typeof VoteButton> = {
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
type Story = StoryObj<typeof VoteButton>;

export const UpDefaultNoCount: Story = {
  args: {
    type: 'up',
    active: false,
    showCount: false,
  },
  name: 'Up - Default - Icon Only',
};

export const UpDefaultWithCount: Story = {
  args: {
    type: 'up',
    active: false,
    showCount: true,
    count: 1,
  },
  name: 'Up - Default - With Count',
};

export const UpActiveNoCount: Story = {
  args: {
    type: 'up',
    active: true,
    showCount: false,
  },
  name: 'Up - Active - Icon Only',
};

export const UpActiveWithCount: Story = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 1,
  },
  name: 'Up - Active - With Count',
};

export const DownDefaultNoCount: Story = {
  args: {
    type: 'down',
    active: false,
    showCount: false,
  },
  name: 'Down - Default - Icon Only',
};

export const DownDefaultWithCount: Story = {
  args: {
    type: 'down',
    active: false,
    showCount: true,
    count: 1,
  },
  name: 'Down - Default - With Count',
};

export const DownActiveNoCount: Story = {
  args: {
    type: 'down',
    active: true,
    showCount: false,
  },
  name: 'Down - Active - Icon Only',
};

export const DownActiveWithCount: Story = {
  args: {
    type: 'down',
    active: true,
    showCount: true,
    count: 1,
  },
  name: 'Down - Active - With Count',
};

export const Default: Story = {
  args: {
    type: 'up',
    active: false,
    showCount: true,
    count: 0,
  },
  name: 'Default (Up, Inactive, Count 0)',
};

export const HighCount: Story = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 999,
  },
  name: 'High Count Example',
};

export const WithVoters: Story = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 3,
    voters: ['Alice Johnson', 'Bob Smith', 'Charlie Davis'],
  },
  name: 'With Voters Tooltip',
};

export const WithManyVoters: Story = {
  args: {
    type: 'up',
    active: true,
    showCount: true,
    count: 7,
    voters: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
  },
  name: 'With Many Voters (Truncated)',
};

export const DownWithVoters: Story = {
  args: {
    type: 'down',
    active: true,
    showCount: true,
    count: 2,
    voters: ['John Doe', 'Jane Smith'],
  },
  name: 'Down Vote With Voters',
};

