import type { Meta, StoryObj } from '@storybook/react';
import { CartonLogo } from './Header';

const meta = {
  title: 'Figma Variants/CartonLogo',
  component: CartonLogo,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CartonLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SizeSmall: Story = {
  args: {
    size: 24,
  },
};

export const SizeDefault: Story = {
  args: {
    size: 34,
  },
};

export const SizeLarge: Story = {
  args: {
    size: 48,
  },
};
