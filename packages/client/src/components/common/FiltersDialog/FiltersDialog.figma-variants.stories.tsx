import type { Meta, StoryObj } from '@storybook/react';
import { FiltersDialog } from './FiltersDialog';
import type { FilterItem } from '../FiltersList/types';
import { fn } from '@storybook/test';

const defaultFilters: FilterItem[] = [
  {
    id: 'customer',
    label: 'Customer',
    value: [],
    count: 0,
    multiSelect: true,
    options: [
      { value: 'customer1', label: 'Acme Corp' },
      { value: 'customer2', label: 'Globex Inc' },
      { value: 'customer3', label: 'Initech' },
    ],
    onChange: fn(),
  },
  {
    id: 'status',
    label: 'Status',
    value: [],
    count: 0,
    multiSelect: true,
    options: [
      { value: 'todo', label: 'To Do' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ],
    onChange: fn(),
  },
  {
    id: 'priority',
    label: 'Priority',
    value: [],
    count: 0,
    multiSelect: true,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
    onChange: fn(),
  },
  {
    id: 'lastUpdated',
    label: 'Last updated',
    value: 'none',
    count: 0,
    multiSelect: false,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This week' },
      { value: 'month', label: 'This month' },
    ],
    onChange: fn(),
  },
];

const filtersWithSelections: FilterItem[] = [
  {
    id: 'customer',
    label: 'Customer',
    value: ['customer1', 'customer3'],
    count: 2,
    multiSelect: true,
    options: [
      { value: 'customer1', label: 'Acme Corp' },
      { value: 'customer2', label: 'Globex Inc' },
      { value: 'customer3', label: 'Initech' },
    ],
    onChange: fn(),
  },
  {
    id: 'status',
    label: 'Status',
    value: ['in-progress'],
    count: 1,
    multiSelect: true,
    options: [
      { value: 'todo', label: 'To Do' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ],
    onChange: fn(),
  },
  {
    id: 'priority',
    label: 'Priority',
    value: [],
    count: 0,
    multiSelect: true,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
    onChange: fn(),
  },
  {
    id: 'lastUpdated',
    label: 'Last updated',
    value: 'today',
    count: 1,
    multiSelect: false,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This week' },
      { value: 'month', label: 'This month' },
    ],
    onChange: fn(),
  },
];

const meta = {
  title: 'Figma Variants/FiltersDialog',
  component: FiltersDialog,
  decorators: [],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onApply: fn(),
    onClear: fn(),
  },
} as Meta<typeof FiltersDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiltersDefault: Story = {
  args: {
    filters: defaultFilters,
  },
};

export const FiltersWithSelections: Story = {
  args: {
    filters: filtersWithSelections,
  },
};
