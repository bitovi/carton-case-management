import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Figma Variants/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variant: avatar
export const VariantAvatar: Story = {
  args: {
    variant: 'avatar',
  },
};

// Variant: line
export const VariantLine: Story = {
  args: {
    variant: 'line',
  },
};

// Variant: object
export const VariantObject: Story = {
  args: {
    variant: 'object',
  },
};
