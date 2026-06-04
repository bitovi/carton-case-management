import type { Meta, StoryObj } from '@storybook/react';
import { SquareCheckBig } from './SquareCheckBig';

const meta = {
  title: 'Figma Variants/SquareCheckBig',
  component: SquareCheckBig,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SquareCheckBig>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dependent axis combinations (8 total: size x state)

export const SizeSm: Story = {
  args: {
    size: 'sm',
    state: 'default',
  },
};

export const SizeMd: Story = {
  args: {
    size: 'md',
    state: 'default',
  },
};

export const SizeLg: Story = {
  args: {
    size: 'lg',
    state: 'default',
  },
};

export const SizeXl: Story = {
  args: {
    size: 'xl',
    state: 'default',
  },
};

export const SizeSmDisabled: Story = {
  args: {
    size: 'sm',
    state: 'disabled',
  },
};

export const SizeMdDisabled: Story = {
  args: {
    size: 'md',
    state: 'disabled',
  },
};

export const SizeLgDisabled: Story = {
  args: {
    size: 'lg',
    state: 'disabled',
  },
};

export const SizeXlDisabled: Story = {
  args: {
    size: 'xl',
    state: 'disabled',
  },
};

// Independent axis screenshots (at default dependent values: size=md, state=default)

export const WithColorBlue: Story = {
  args: {
    size: 'md',
    state: 'default',
    color: '#3b82f6',
  },
};

export const WithStrokeWidth3: Story = {
  args: {
    size: 'md',
    state: 'default',
    strokeWidth: 3,
  },
};
