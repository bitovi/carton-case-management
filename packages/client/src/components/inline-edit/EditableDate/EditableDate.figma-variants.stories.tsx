import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditableDate } from './EditableDate';

const meta = {
  title: 'Figma Variants/EditableDate',
  component: EditableDate,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditableDate>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  label: 'Due Date',
  value: '2025-01-20',
  onSave: fn().mockResolvedValue(undefined),
};

export const StateRestErrorFalse: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
  },
};

export const StateInterestErrorFalse: Story = {
  args: {
    ...baseArgs,
    __storyState: 'interest',
  },
};

export const StateEditErrorFalse: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
  },
};

export const StateSavingErrorFalse: Story = {
  args: {
    ...baseArgs,
    __storyState: 'saving',
  },
};

export const StateEditErrorTrue: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    __storyError: 'Invalid date',
    isEditing: true,
  },
};

export const StateRestValueNull: Story = {
  args: {
    ...baseArgs,
    value: null,
    placeholder: 'No due date',
    __storyState: 'rest',
  },
};

export const ReadonlyTrue: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    readonly: true,
  },
};
