import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditableText } from './EditableText';

const meta = {
  title: 'Figma Variants/EditableText',
  component: EditableText,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditableText>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  label: 'Full Name',
  onSave: fn().mockResolvedValue(undefined),
};

export const StateRestErrorNone: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: 'John Doe',
  },
};

export const StateInterestErrorNone: Story = {
  args: {
    ...baseArgs,
    __storyState: 'interest',
    value: 'John Doe',
  },
};

export const StateEditErrorNone: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    value: 'John Doe',
  },
};

export const StateEditErrorWithError: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    isEditing: true,
    __storyError: 'This field is required',
    value: '',
  },
};

export const StateSavingErrorNone: Story = {
  args: {
    ...baseArgs,
    __storyState: 'saving',
    value: 'John Doe',
  },
};

export const ReadonlyTrue: Story = {
  args: {
    ...baseArgs,
    readonly: true,
    value: 'System Administrator',
  },
};

export const EmptyValueWithPlaceholder: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: '',
    placeholder: 'Enter a description...',
  },
};

export const EmptyValueNoPlaceholder: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: '',
  },
};

export const CustomDisplayValue: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    value: 'active',
    displayValue: (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-medium">Active</span>
      </span>
    ),
  },
};
