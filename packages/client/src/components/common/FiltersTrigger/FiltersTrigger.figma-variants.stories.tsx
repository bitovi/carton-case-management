import type { Meta, StoryObj } from '@storybook/react';
import { FiltersTrigger } from './FiltersTrigger';

const meta = {
  title: 'Figma Variants/FiltersTrigger',
  component: FiltersTrigger,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FiltersTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedFalseActiveFiltersNoneStateDefault: Story = {
  args: {
    activeCount: 0,
    selected: false,
  },
};

export const SelectedFalseActiveFiltersNoneStateHover: Story = {
  args: {
    activeCount: 0,
    selected: false,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      button.classList.add('hover');
    }
  },
};

export const SelectedFalseActiveFiltersHasFiltersStateDefault: Story = {
  args: {
    activeCount: 1,
    selected: false,
  },
};

export const SelectedFalseActiveFiltersHasFiltersStateHover: Story = {
  args: {
    activeCount: 1,
    selected: false,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      button.classList.add('hover');
    }
  },
};

export const SelectedTrueActiveFiltersNoneStateDefault: Story = {
  args: {
    activeCount: 0,
    selected: true,
  },
};

export const SelectedTrueActiveFiltersNoneStateHover: Story = {
  args: {
    activeCount: 0,
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      button.classList.add('hover');
    }
  },
};

export const SelectedTrueActiveFiltersHasFiltersStateDefault: Story = {
  args: {
    activeCount: 3,
    selected: true,
  },
};

export const SelectedTrueActiveFiltersHasFiltersStateHover: Story = {
  args: {
    activeCount: 3,
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      button.classList.add('hover');
    }
  },
};
