import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FiltersDialog } from './FiltersDialog';
import type { FilterItem } from '../FiltersList/types';

const meta = {
  title: 'Common/FiltersDialog',
  component: FiltersDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FiltersDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function FiltersDialogWrapper() {
  const [open, setOpen] = useState(true);
  const [customerValue, setCustomerValue] = useState('none');
  const [statusValue, setStatusValue] = useState('todo');
  const [priorityValue, setPriorityValue] = useState('none');
  const [lastUpdatedValue, setLastUpdatedValue] = useState('none');

  const filters: FilterItem[] = [
    {
      id: 'customer',
      label: 'Customer',
      value: customerValue,
      count: 0,
      options: [
        { value: 'none', label: 'None selected' },
        { value: 'customer1', label: 'Acme Corp' },
        { value: 'customer2', label: 'Globex Inc' },
        { value: 'customer3', label: 'Initech' },
      ],
      onChange: setCustomerValue,
    },
    {
      id: 'status',
      label: 'Status',
      value: statusValue,
      count: 1,
      options: [
        { value: 'none', label: 'None selected' },
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'done', label: 'Done' },
      ],
      onChange: setStatusValue,
    },
    {
      id: 'priority',
      label: 'Priority',
      value: priorityValue,
      count: 0,
      options: [
        { value: 'none', label: 'None selected' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
      onChange: setPriorityValue,
    },
    {
      id: 'lastUpdated',
      label: 'Last updated',
      value: lastUpdatedValue,
      count: 0,
      options: [
        { value: 'none', label: 'None selected' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
      ],
      onChange: setLastUpdatedValue,
    },
  ];

  const handleClear = () => {
    setCustomerValue('none');
    setStatusValue('none');
    setPriorityValue('none');
    setLastUpdatedValue('none');
  };

  const handleApply = () => {
    console.log('Applying filters:', {
      customer: customerValue,
      status: statusValue,
      priority: priorityValue,
      lastUpdated: lastUpdatedValue,
    });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Filters Dialog</button>
      <FiltersDialog
        open={open}
        onOpenChange={setOpen}
        filters={filters}
        onApply={handleApply}
        onClear={handleClear}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <FiltersDialogWrapper />,
  args: {
    open: false,
    onOpenChange: () => {},
    filters: [],
    onApply: () => {},
    onClear: () => {},
  },
};

export const CustomTitle: Story = {
  render: () => <FiltersDialogWrapper />,
  args: {
    open: false,
    onOpenChange: () => {},
    filters: [],
    title: 'Apply Filters',
    onApply: () => {},
    onClear: () => {},
  },
};
