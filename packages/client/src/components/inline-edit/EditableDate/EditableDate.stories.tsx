import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { EditableDate } from './EditableDate';

const meta: Meta<typeof EditableDate> = {
  title: 'Components/inline-edit/EditableDate',
  component: EditableDate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text displayed above the date field',
      control: 'text',
    },
    value: {
      description: 'Current date value (ISO string or Date object)',
      control: 'text',
    },
    displayFormat: {
      description: 'Format for displaying the date (default: "MMM d, yyyy")',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when value is empty',
      control: 'text',
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
      description: 'Async function called when date is selected',
      control: false,
    },
    validate: {
      description: 'Zod schema or validation function',
      control: false,
    },
  },
  args: {
    label: 'Due Date',
    value: '2025-01-20',
    onSave: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EditableDate>;

/**
 * Default date field with basic value.
 * Click to open the calendar picker, then select a date to auto-save.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableDate {...args} />
    </div>
  ),
  args: {
    label: 'Due Date',
    value: '2025-01-20',
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

/**
 * Interactive example with stateful value.
 * Demonstrates auto-save behavior when a date is selected.
 */
export const Interactive: Story = {
  args: {
    label: 'Due Date',
    value: '',
    onSave: fn(),
  },
  render: function InteractiveStory() {
    const [value, setValue] = useState('2025-01-20');

    return (
      <div className="w-[300px]">
        <EditableDate
          label="Due Date"
          value={value}
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
 * Empty value with placeholder text.
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Birth Date',
    value: null,
    placeholder: 'Select a date...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Custom date format display.
 */
export const CustomFormat: Story = {
  args: {
    label: 'Event Date',
    value: '2025-12-25',
    displayFormat: 'MM/dd/yyyy',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Long format display with day name.
 */
export const LongFormat: Story = {
  args: {
    label: 'Meeting Date',
    value: '2025-06-15',
    displayFormat: 'EEEE, MMMM d, yyyy',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * With custom display value rendering.
 */
export const CustomDisplayValue: Story = {
  args: {
    label: 'Deadline',
    value: '2025-01-31',
    displayValue: (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="font-medium text-red-600">Jan 31, 2025 (Urgent)</span>
      </span>
    ),
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Read-only mode - no interaction possible.
 */
export const ReadOnly: Story = {
  args: {
    label: 'Created Date',
    value: '2024-06-15',
    readonly: true,
    onSave: async () => {
      // Won't be called
    },
  },
};

/**
 * Simulating a slow save operation.
 */
export const SlowSave: Story = {
  args: {
    label: 'Due Date',
    value: '2025-01-20',
    onSave: async () => {
      // Simulate slow API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  },
};

/**
 * Simulating a save error.
 */
export const SaveError: Story = {
  args: {
    label: 'Due Date',
    value: '',
    onSave: fn(),
  },
  render: function SaveErrorStory() {
    const [value, setValue] = useState('2025-01-20');
    const [shouldFail, setShouldFail] = useState(true);

    return (
      <div className="w-[300px]">
        <EditableDate
          label="Due Date"
          value={value}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (shouldFail) {
              throw new Error('Network error: Unable to save. Please try again.');
            }
            setValue(newValue);
          }}
        />
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="shouldFail"
            checked={shouldFail}
            onChange={(e) => setShouldFail(e.target.checked)}
          />
          <label htmlFor="shouldFail" className="text-sm text-muted-foreground">
            Simulate network error
          </label>
        </div>
      </div>
    );
  },
};

/**
 * With validation - prevents selecting dates in the past.
 */
export const WithValidation: Story = {
  args: {
    label: 'Due Date',
    value: '',
    onSave: fn(),
  },
  render: function ValidationStory() {
    const [value, setValue] = useState('2025-01-20');

    const validate = (val: string) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        return 'Due date cannot be in the past';
      }
      return null;
    };

    return (
      <div className="w-[300px]">
        <EditableDate
          label="Due Date (Future Only)"
          value={value}
          validate={validate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Try selecting a date in the past to see validation error
        </p>
      </div>
    );
  },
};

/**
 * Controlled editing mode - externally manage edit state.
 */
export const ControlledMode: Story = {
  args: {
    label: 'Due Date',
    value: '',
    onSave: fn(),
  },
  render: function ControlledStory() {
    const [value, setValue] = useState('2025-01-20');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="w-[300px]">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Open Calendar
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm bg-gray-200 rounded"
          >
            Close Calendar
          </button>
        </div>
        <EditableDate
          label="Controlled Date"
          value={value}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Calendar open: {isEditing ? 'Yes' : 'No'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple date fields in a form layout.
 */
export const FormExample: Story = {
  args: {
    label: 'Due Date',
    value: '',
    onSave: fn(),
  },
  render: function FormExampleStory() {
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-01-31');
    const [dueDate, setDueDate] = useState('2025-01-15');

    return (
      <div className="w-[400px] space-y-4">
        <EditableDate
          label="Start Date"
          value={startDate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setStartDate(newValue);
          }}
        />
        <EditableDate
          label="Due Date"
          value={dueDate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setDueDate(newValue);
          }}
        />
        <EditableDate
          label="End Date"
          value={endDate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setEndDate(newValue);
          }}
        />
      </div>
    );
  },
};
