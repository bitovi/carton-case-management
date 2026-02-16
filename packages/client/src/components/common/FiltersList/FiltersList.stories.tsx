import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FiltersList } from './FiltersList';
import type { FilterItem } from './types';

const meta = {
  title: 'Components/Common/FiltersList',
  component: FiltersList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FiltersList>;

export default meta;
type Story = StoryObj<typeof meta>;

function FiltersListWrapper() {
  const [customerValue, setCustomerValue] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const [priorityValue, setPriorityValue] = useState<string[]>([]);
  const [lastUpdatedValue, setLastUpdatedValue] = useState<string>('none');

  const filters: FilterItem[] = [
    {
      id: 'customer',
      label: 'Customer',
      value: customerValue,
      count: customerValue.length,
      multiSelect: true,
      options: [
        { value: 'customer1', label: 'Acme Corp' },
        { value: 'customer2', label: 'Globex Inc' },
        { value: 'customer3', label: 'Initech' },
      ],
      onChange: (value) => setCustomerValue(value as string[]),
    },
    {
      id: 'status',
      label: 'Status',
      value: statusValue,
      count: statusValue.length,
      multiSelect: true,
      options: [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'done', label: 'Done' },
      ],
      onChange: (value) => setStatusValue(value as string[]),
    },
    {
      id: 'priority',
      label: 'Priority',
      value: priorityValue,
      count: priorityValue.length,
      multiSelect: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
      onChange: (value) => setPriorityValue(value as string[]),
    },
    {
      id: 'lastUpdated',
      label: 'Last updated',
      value: lastUpdatedValue,
      count: lastUpdatedValue !== 'none' ? 1 : 0,
      multiSelect: false,
      options: [
        { value: 'none', label: 'None selected' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
      ],
      onChange: (value) => setLastUpdatedValue(value as string),
    },
  ];

  return <FiltersList filters={filters} />;
}

export const Default: Story = {
  render: () => <FiltersListWrapper />,
  args: {
    filters: [],
  },
};

export const CustomTitle: Story = {
  render: () => <FiltersListWrapper />,
  args: {
    title: 'Apply Filters',
    filters: [],
  },
};
