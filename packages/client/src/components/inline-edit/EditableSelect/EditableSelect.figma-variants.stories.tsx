import type { Meta, StoryObj } from '@storybook/react';
import { EditableSelect } from './EditableSelect';

const statusOptions = [
  { value: 'TO_DO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'DONE', label: 'Done' },
];

const noopSave = async () => {
  await new Promise(() => {});
};

const meta = {
  title: 'Figma Variants/EditableSelect',
  component: EditableSelect,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof EditableSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateRestReadonlyFalse: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    __storyState: 'rest',
  },
};

export const StateInterestReadonlyFalse: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    __storyState: 'interest',
  },
};

export const StateEditReadonlyFalse: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    __storyState: 'edit',
  },
};

export const StateSavingReadonlyFalse: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    __storyState: 'saving',
  },
};

export const StateRestReadonlyTrue: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    readonly: true,
    __storyState: 'rest',
  },
};

export const StateEditErrorReadonlyFalse: Story = {
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: noopSave,
    __storyState: 'edit',
    __storyError: 'Failed to update status. Please try again.',
  },
};

export const StateRestPlaceholder: Story = {
  args: {
    label: 'Assignee',
    value: '',
    options: statusOptions,
    placeholder: 'Select status...',
    onSave: noopSave,
    __storyState: 'rest',
  },
};

export const StateRestCustomDisplayValue: Story = {
  args: {
    label: 'Priority',
    value: 'HIGH',
    options: [
      { value: 'LOW', label: 'Low' },
      { value: 'MEDIUM', label: 'Medium' },
      { value: 'HIGH', label: 'High' },
      { value: 'CRITICAL', label: 'Critical' },
    ],
    displayValue: (
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        High
      </span>
    ),
    onSave: noopSave,
    __storyState: 'rest',
  },
};
