import type { Meta, StoryObj } from '@storybook/react';
import { FiltersTrigger } from './FiltersTrigger';

const meta = {
  title: 'Figma Variants/FiltersTrigger',
  component: FiltersTrigger,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FiltersTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedFalseStateDefault: Story = {
  args: {
    selected: false,
    activeCount: 0,
  },
};

export const SelectedFalseStateHover: Story = {
  args: {
    selected: false,
    activeCount: 0,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const SelectedTrueStateDefault: Story = {
  args: {
    selected: true,
    activeCount: 0,
  },
};

export const SelectedTrueStateHover: Story = {
  args: {
    selected: true,
    activeCount: 0,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const ActiveCountOne: Story = {
  args: {
    selected: false,
    activeCount: 1,
  },
};

export const ActiveCountThree: Story = {
  args: {
    selected: false,
    activeCount: 3,
  },
};

export const ActiveCountLarge: Story = {
  args: {
    selected: false,
    activeCount: 99,
  },
};
