import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditableNumber } from './EditableNumber';

const meta = {
  title: 'Figma Variants/EditableNumber',
  component: EditableNumber,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditableNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseWithValue = {
  label: 'Zip Code',
  value: 55555 as number | null,
  onSave: fn().mockResolvedValue(undefined),
};

const baseEmpty = {
  label: 'Zip Code',
  value: null as number | null,
  onSave: fn().mockResolvedValue(undefined),
};

export const StateRestErrorFalseValueWithValue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'rest',
  },
};

export const StateRestErrorFalseValueEmpty: Story = {
  args: {
    ...baseEmpty,
    __storyState: 'rest',
  },
};

export const StateHoverErrorFalseValueWithValue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'interest',
  },
};

export const StateHoverErrorFalseValueEmpty: Story = {
  args: {
    ...baseEmpty,
    __storyState: 'interest',
  },
};

export const StateEditErrorFalseValueWithValue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'edit',
    isEditing: true,
  },
};

export const StateEditErrorFalseValueEmpty: Story = {
  args: {
    ...baseEmpty,
    __storyState: 'edit',
    isEditing: true,
  },
};

export const StateEditErrorTrueValueWithValue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'edit',
    __storyError: 'Value must be at least 0',
    isEditing: true,
  },
};

export const StateEditErrorTrueValueEmpty: Story = {
  args: {
    ...baseEmpty,
    __storyState: 'edit',
    __storyError: 'Value is required',
    isEditing: true,
  },
};

export const StateSavingErrorFalseValueWithValue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'saving',
  },
};

export const StateSavingErrorFalseValueEmpty: Story = {
  args: {
    ...baseEmpty,
    __storyState: 'saving',
  },
};

export const ReadonlyTrue: Story = {
  args: {
    ...baseWithValue,
    __storyState: 'rest',
    readonly: true,
  },
};
