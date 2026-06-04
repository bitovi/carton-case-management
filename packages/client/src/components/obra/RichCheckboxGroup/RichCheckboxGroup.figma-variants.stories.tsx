import type { Meta, StoryObj } from '@storybook/react';
import { RichCheckboxGroup } from './RichCheckboxGroup';

const meta = {
  title: 'Figma Variants/RichCheckboxGroup',
  component: RichCheckboxGroup,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RichCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckedFalseFlippedFalse: Story = {
  args: {
    checked: false,
    flipped: false,
    label: 'Label',
  },
};

export const CheckedTrueFlippedFalse: Story = {
  args: {
    checked: true,
    flipped: false,
    label: 'Label',
  },
};

export const CheckedFalseFlippedTrue: Story = {
  args: {
    checked: false,
    flipped: true,
    label: 'Label',
  },
};

export const CheckedTrueFlippedTrue: Story = {
  args: {
    checked: true,
    flipped: true,
    label: 'Label',
  },
};

export const ShowLine2True: Story = {
  args: {
    checked: false,
    flipped: false,
    showLine2: true,
    label: 'Label',
    secondaryText: 'Secondary text',
  },
};
