import type { Meta, StoryObj } from '@storybook/react';
import { CartonLogo } from './Header';

const meta = {
  title: 'Figma Variants/CartonLogo',
  component: CartonLogo,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof CartonLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 34,
  },
};
