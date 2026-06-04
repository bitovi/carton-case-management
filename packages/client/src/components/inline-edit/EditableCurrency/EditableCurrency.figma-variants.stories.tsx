import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditableCurrency } from './EditableCurrency';

const meta = {
  title: 'Figma Variants/EditableCurrency',
  component: EditableCurrency,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditableCurrency>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  label: 'Price',
  value: 99.99,
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

export const StateEditErrorTrue: Story = {
  args: {
    ...baseArgs,
    __storyState: 'edit',
    __storyError: 'Invalid amount',
    isEditing: true,
  },
};

export const StateSavingErrorFalse: Story = {
  args: {
    ...baseArgs,
    __storyState: 'saving',
  },
};

export const ReadonlyTrue: Story = {
  args: {
    ...baseArgs,
    __storyState: 'rest',
    readonly: true,
  },
};
