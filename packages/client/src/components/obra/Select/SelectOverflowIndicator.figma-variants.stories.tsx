import type { Meta, StoryObj } from '@storybook/react';
import { SelectOverflowIndicator } from './Select';

const meta = {
  title: 'Figma Variants/SelectOverflowIndicator',
  component: SelectOverflowIndicator,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectOverflowIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DirectionUp: Story = {
  args: {
    direction: 'up',
  },
};

export const DirectionDown: Story = {
  args: {
    direction: 'down',
  },
};
