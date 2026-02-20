import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

const meta = {
  title: 'Components/Common/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'small', 'regular', 'large'],
    },
    layout: {
      control: 'select',
      options: ['single', 'stacked'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const customerOptions = [
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'michael-brown', label: 'Michael Brown' },
  { value: 'emily-davis', label: 'Emily Davis' },
  { value: 'robert-wilson', label: 'Robert Wilson' },
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: 'low', label: 'LOW' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'high', label: 'HIGH' },
  { value: 'urgent', label: 'URGENT' },
];

function MultiSelectWrapper(props: React.ComponentProps<typeof MultiSelect>) {
  const [value, setValue] = useState<string[]>(props.value || []);
  
  return <MultiSelect {...props} value={value} onChange={setValue} />;
}

export const NoSelection: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: [],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const SingleSelection: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    value: ['todo'],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const MultipleSelections: Story = {
  args: {
    label: 'Priority',
    options: priorityOptions,
    value: ['medium', 'high', 'urgent'],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: [],
    onChange: () => {},
  },
  render: () => (
    <div className="w-[342px] space-y-4">
      <MultiSelectWrapper
        label="Customer"
        options={customerOptions}
        value={[]}
        onChange={() => {}}
      />
      <MultiSelectWrapper
        label="Status"
        options={statusOptions}
        value={[]}
        onChange={() => {}}
      />
      <MultiSelectWrapper
        label="Priority"
        options={priorityOptions}
        value={[]}
        onChange={() => {}}
      />
    </div>
  ),
};

export const AllCustomersSelected: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: customerOptions.map(opt => opt.value),
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const SizeVariants: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: ['sarah-johnson'],
    onChange: () => {},
  },
  render: () => (
    <div className="w-[342px] space-y-4">
      <div>
        <p className="text-xs font-semibold mb-2">Mini</p>
        <MultiSelectWrapper
          size="mini"
          label="Customer"
          options={customerOptions}
          value={['sarah-johnson']}
          onChange={() => {}}
        />
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Small</p>
        <MultiSelectWrapper
          size="small"
          label="Customer"
          options={customerOptions}
          value={['sarah-johnson']}
          onChange={() => {}}
        />
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Regular (Default)</p>
        <MultiSelectWrapper
          size="regular"
          label="Customer"
          options={customerOptions}
          value={['sarah-johnson']}
          onChange={() => {}}
        />
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Large</p>
        <MultiSelectWrapper
          size="large"
          label="Customer"
          options={customerOptions}
          value={['sarah-johnson']}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const SingleLayout: Story = {
  args: {
    layout: 'single',
    label: 'Customer',
    options: customerOptions,
    value: ['sarah-johnson', 'michael-brown'],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const SingleLayoutWithPrependText: Story = {
  args: {
    layout: 'single',
    prependText: 'Filter:',
    options: customerOptions,
    value: ['sarah-johnson'],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const WithLeftDecoration: Story = {
  args: {
    label: 'Customer',
    leftDecoration: <User className="w-5 h-5" />,
    options: customerOptions,
    value: ['sarah-johnson'],
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: [],
    error: true,
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
      <p className="text-xs text-[var(--destructive-foreground)] mt-1">Please select at least one customer</p>
    </div>
  ),
};

export const DisabledState: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: ['sarah-johnson'],
    disabled: true,
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};

export const DisabledWithError: Story = {
  args: {
    label: 'Customer',
    options: customerOptions,
    value: [],
    disabled: true,
    error: true,
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[342px]">
      <MultiSelectWrapper {...args} />
    </div>
  ),
};
