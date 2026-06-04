import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditablePercent } from './EditablePercent';

const meta = {
  title: 'Figma Variants/EditablePercent',
  component: EditablePercent,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditablePercent>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  label: 'Discount',
  onSave: fn().mockResolvedValue(undefined),
};

export const StateRestErrorFalseValueFilled: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: 15,
  },
};

export const StateRestErrorFalseValueEmpty: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: null,
  },
};

export const StateHoverErrorFalseValueFilled: Story = {
  args: {
    ...baseArgs,
    __storyState: 'interest',
    value: 15,
  },
};

export const StateHoverErrorFalseValueEmpty: Story = {
  args: {
    ...baseArgs,
    __storyState: 'interest',
    value: null,
  },
};

export const StateEditErrorFalseValueFilled: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    value: 15,
  },
};

export const StateEditErrorFalseValueEmpty: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    value: null,
  },
};

export const StateEditErrorTrueValueFilled: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    __storyError: 'Percentage cannot exceed 50%',
    value: 15,
  },
};

export const StateEditErrorTrueValueEmpty: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    __storyError: 'Percentage cannot exceed 50%',
    value: null,
  },
};

export const StateSavingErrorFalseValueFilled: Story = {
  args: {
    ...baseArgs,
    __storyState: 'saving',
    value: 15,
  },
};

export const StateReadonlyErrorFalseValueFilled: Story = {
  args: {
    ...baseArgs,
    readonly: true,
    value: 15,
  },
};

export const StateReadonlyErrorFalseValueEmpty: Story = {
  args: {
    ...baseArgs,
    readonly: true,
    value: null,
  },
};
