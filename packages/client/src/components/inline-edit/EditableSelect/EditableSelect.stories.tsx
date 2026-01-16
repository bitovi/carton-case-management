import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditableSelect } from './EditableSelect';
import { z } from 'zod';

const statusOptions = [
  { value: 'TO_DO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'DONE', label: 'Done' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

const customerOptions = [
  { value: 'cust1', label: 'Acme Corp' },
  { value: 'cust2', label: 'TechCorp Inc' },
  { value: 'cust3', label: 'Global Systems' },
  { value: 'cust4', label: 'Initech', disabled: true },
];

const meta: Meta<typeof EditableSelect> = {
  title: 'Components/inline-edit/EditableSelect',
  component: EditableSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text displayed above the value',
      control: 'text',
    },
    value: {
      description: 'Current selected value',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when no value is selected',
      control: 'text',
    },
    options: {
      description: 'List of available options',
      control: false,
    },
    readonly: {
      description: 'Whether the field is read-only',
      control: 'boolean',
    },
    displayValue: {
      description: 'Custom display render (optional)',
      control: false,
    },
    onSave: {
      description: 'Async function called when saving',
      control: false,
    },
    validate: {
      description: 'Zod schema or validation function',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditableSelect>;

/**
 * Default select with status options.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableSelect {...args} />
    </div>
  ),
  args: {
    label: 'Status',
    value: 'IN_PROGRESS',
    options: statusOptions,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

/**
 * Interactive example with stateful value
 */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [value, setValue] = useState('IN_PROGRESS');

    return (
      <div className="w-[250px]">
        <EditableSelect
          label="Status"
          value={value}
          options={statusOptions}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Current value: {value}
        </p>
      </div>
    );
  },
};

/**
 * Customer selection dropdown
 */
export const CustomerSelect: Story = {
  render: function CustomerStory() {
    const [value, setValue] = useState('cust1');

    return (
      <div className="w-[250px]">
        <EditableSelect
          label="Customer Name"
          value={value}
          options={customerOptions}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
      </div>
    );
  },
};

/**
 * Empty value with placeholder
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Assignee',
    value: '',
    placeholder: 'Select assignee...',
    options: [
      { value: 'user1', label: 'John Doe' },
      { value: 'user2', label: 'Jane Smith' },
      { value: 'user3', label: 'Bob Wilson' },
    ],
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Priority selection with colored indicators
 */
export const PriorityWithColors: Story = {
  render: function PriorityStory() {
    const [value, setValue] = useState('MEDIUM');

    const getColorClass = (priority: string) => {
      switch (priority) {
        case 'LOW':
          return 'bg-gray-400';
        case 'MEDIUM':
          return 'bg-yellow-500';
        case 'HIGH':
          return 'bg-orange-500';
        case 'CRITICAL':
          return 'bg-red-500';
        default:
          return 'bg-gray-400';
      }
    };

    const selectedOption = priorityOptions.find((opt) => opt.value === value);

    return (
      <div className="w-[250px]">
        <EditableSelect
          label="Priority"
          value={value}
          options={priorityOptions}
          displayValue={
            selectedOption && (
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${getColorClass(value)}`}
                />
                {selectedOption.label}
              </span>
            )
          }
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
      </div>
    );
  },
};

/**
 * With disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    label: 'Customer',
    value: 'cust1',
    options: customerOptions,
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Read-only mode - no interaction possible
 */
export const ReadOnly: Story = {
  args: {
    label: 'Category',
    value: 'support',
    options: [
      { value: 'support', label: 'Support' },
      { value: 'sales', label: 'Sales' },
      { value: 'billing', label: 'Billing' },
    ],
    readonly: true,
    onSave: async () => {},
  },
};

/**
 * With validation
 */
export const WithValidation: Story = {
  render: function ValidationStory() {
    const [value, setValue] = useState('');

    const allowedValues = ['opt1', 'opt2'] as const;
    const validate = z.enum(allowedValues, {
      errorMap: () => ({ message: 'Please select a valid option' }),
    });

    return (
      <div className="w-[250px]">
        <EditableSelect
          label="Category"
          value={value}
          placeholder="Select category..."
          options={[
            { value: 'opt1', label: 'Valid Option 1' },
            { value: 'opt2', label: 'Valid Option 2' },
            { value: 'opt3', label: 'Invalid Option' },
          ]}
          validate={validate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Only &quot;Valid Option 1&quot; and &quot;Valid Option 2&quot; are allowed
        </p>
      </div>
    );
  },
};

/**
 * Simulating save error
 */
export const SaveError: Story = {
  args: {
    label: 'Status',
    value: 'TO_DO',
    options: statusOptions,
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('Failed to update status. Please try again.');
    },
  },
};

/**
 * Controlled editing state
 */
export const ControlledEditing: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('IN_PROGRESS');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="w-[250px]">
        <EditableSelect
          label="Controlled Status"
          value={value}
          options={statusOptions}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <div className="mt-4 flex gap-2">
          <button
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            Start Editing
          </button>
          <button
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
            onClick={() => setIsEditing(false)}
          >
            Cancel Editing
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          isEditing: {String(isEditing)}
        </p>
      </div>
    );
  },
};

/**
 * Long option list
 */
export const LongOptionList: Story = {
  args: {
    label: 'Country',
    value: 'US',
    options: [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
      { value: 'UK', label: 'United Kingdom' },
      { value: 'AU', label: 'Australia' },
      { value: 'DE', label: 'Germany' },
      { value: 'FR', label: 'France' },
      { value: 'JP', label: 'Japan' },
      { value: 'CN', label: 'China' },
      { value: 'IN', label: 'India' },
      { value: 'BR', label: 'Brazil' },
      { value: 'MX', label: 'Mexico' },
      { value: 'ES', label: 'Spain' },
      { value: 'IT', label: 'Italy' },
      { value: 'NL', label: 'Netherlands' },
      { value: 'SE', label: 'Sweden' },
    ],
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Multiple select fields example
 */
export const MultipleFields: Story = {
  render: function MultipleFieldsStory() {
    const [data, setData] = useState({
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignee: 'user1',
    });

    const handleSave =
      (field: keyof typeof data) => async (newValue: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData((prev) => ({ ...prev, [field]: newValue }));
      };

    return (
      <div className="flex flex-col gap-4 w-[250px]">
        <EditableSelect
          label="Status"
          value={data.status}
          options={statusOptions}
          onSave={handleSave('status')}
        />
        <EditableSelect
          label="Priority"
          value={data.priority}
          options={priorityOptions}
          onSave={handleSave('priority')}
        />
        <EditableSelect
          label="Assignee"
          value={data.assignee}
          options={[
            { value: 'user1', label: 'John Doe' },
            { value: 'user2', label: 'Jane Smith' },
            { value: 'user3', label: 'Bob Wilson' },
          ]}
          onSave={handleSave('assignee')}
        />
      </div>
    );
  },
};
