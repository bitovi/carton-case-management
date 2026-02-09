import type { Meta, StoryObj } from '@storybook/react';
import { FiltersTrigger } from './FiltersTrigger';

const meta = {
  title: 'Common/FiltersTrigger',
  component: FiltersTrigger,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FiltersTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rest: Story = {
  args: {
    activeCount: 0,
    selected: false,
  },
};

export const Applied: Story = {
  args: {
    activeCount: 1,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    activeCount: 0,
    selected: true,
  },
};

export const SelectedWithFilters: Story = {
  args: {
    activeCount: 3,
    selected: true,
  },
};
