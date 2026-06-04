import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from './CheckboxGroup';

const meta = {
  title: 'Figma Variants/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutInlineCheckedFalse: Story = {
  args: {
    layout: 'inline',
    checked: false,
    label: 'Label',
  },
};

export const LayoutInlineCheckedTrue: Story = {
  args: {
    layout: 'inline',
    checked: true,
    label: 'Label',
  },
};

export const LayoutBlockCheckedFalse: Story = {
  args: {
    layout: 'block',
    checked: false,
    label: 'Label',
  },
};

export const LayoutBlockCheckedTrue: Story = {
  args: {
    layout: 'block',
    checked: true,
    label: 'Label',
  },
};
