import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { EditableNumber } from './EditableNumber';

const meta: Meta<typeof EditableNumber> = {
  title: 'Components/inline-edit/EditableNumber',
  component: EditableNumber,
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
      description: 'Current numeric value',
      control: 'number',
    },
    placeholder: {
      description: 'Placeholder text when value is empty',
      control: 'text',
    },
    min: {
      description: 'Minimum value allowed',
      control: 'number',
    },
    max: {
      description: 'Maximum value allowed',
      control: 'number',
    },
    step: {
      description: 'Step increment for the input',
      control: 'number',
    },
    decimalPlaces: {
      description: 'Number of decimal places to display',
      control: 'number',
    },
    useGrouping: {
      description: 'Whether to format number with locale separators',
      control: 'boolean',
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
  args: {
    label: 'Zip Code',
    value: 55555,
    onSave: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EditableNumber>;

/**
 * Default number field with basic value.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableNumber {...args} />
    </div>
  ),
  args: {
    label: 'Zip Code',
    value: 55555,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

/**
 * Interactive example with stateful value.
 */
export const Interactive: Story = {
  args: {
    label: 'Quantity',
    value: 0,
    onSave: fn(),
  },
  render: function InteractiveStory() {
    const [value, setValue] = useState<number | null>(42);

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Quantity"
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
 * Empty value with placeholder.
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Age',
    value: null,
    placeholder: 'Enter age...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * With min/max constraints.
 */
export const WithMinMax: Story = {
  args: {
    label: 'Score',
    value: 0,
    onSave: fn(),
  },
  render: function MinMaxStory() {
    const [value, setValue] = useState<number | null>(50);

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Score (0-100)"
          value={value}
          min={0}
          max={100}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Try entering a value outside 0-100 to see validation
        </p>
      </div>
    );
  },
};

/**
 * Decimal values with precision control.
 */
export const DecimalValues: Story = {
  args: {
    label: 'Price',
    value: 0,
    onSave: fn(),
  },
  render: function DecimalStory() {
    const [value, setValue] = useState<number | null>(1234.567);

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Price"
          value={value}
          decimalPlaces={2}
          step={0.01}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Displays with 2 decimal places
        </p>
      </div>
    );
  },
};

/**
 * Large numbers with grouping separators.
 */
export const WithGrouping: Story = {
  args: {
    label: 'Population',
    value: 0,
    onSave: fn(),
  },
  render: function GroupingStory() {
    const [value, setValue] = useState<number | null>(1234567);

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Population"
          value={value}
          useGrouping={true}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Formatted with thousand separators
        </p>
      </div>
    );
  },
};

/**
 * With custom display value.
 */
export const CustomDisplayValue: Story = {
  args: {
    label: 'Progress',
    value: 75,
    displayValue: (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-medium">75% Complete</span>
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
    label: 'Total Items',
    value: 42,
    readonly: true,
    onSave: async () => {
      // Won't be called
    },
  },
};

/**
 * With custom validation function.
 */
export const WithValidation: Story = {
  args: {
    label: 'Even Number',
    value: 0,
    onSave: fn(),
  },
  render: function ValidationStory() {
    const [value, setValue] = useState<number | null>(10);

    const validate = (val: number | null) => {
      if (val !== null && val % 2 !== 0) {
        return 'Must be an even number';
      }
      return null;
    };

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Even Number Only"
          value={value}
          validate={validate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Try entering an odd number to see validation error
        </p>
      </div>
    );
  },
};

/**
 * Simulating a slow save operation.
 */
export const SlowSave: Story = {
  args: {
    label: 'Quantity',
    value: 100,
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
    label: 'Amount',
    value: 0,
    onSave: fn(),
  },
  render: function SaveErrorStory() {
    const [value, setValue] = useState<number | null>(500);
    const [shouldFail, setShouldFail] = useState(true);

    return (
      <div className="w-[300px]">
        <EditableNumber
          label="Amount"
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
 * Controlled editing mode - externally manage edit state.
 */
export const ControlledMode: Story = {
  args: {
    label: 'Value',
    value: 0,
    onSave: fn(),
  },
  render: function ControlledStory() {
    const [value, setValue] = useState<number | null>(123);
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="w-[300px]">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Enter Edit Mode
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm bg-gray-200 rounded"
          >
            Exit Edit Mode
          </button>
        </div>
        <EditableNumber
          label="Controlled Value"
          value={value}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Edit mode: {isEditing ? 'ON' : 'OFF'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple number fields in a form layout.
 */
export const FormExample: Story = {
  args: {
    label: 'Value',
    value: 0,
    onSave: fn(),
  },
  render: function FormExampleStory() {
    const [zipCode, setZipCode] = useState<number | null>(55555);
    const [quantity, setQuantity] = useState<number | null>(10);
    const [price, setPrice] = useState<number | null>(99.99);

    return (
      <div className="w-[400px] space-y-4">
        <EditableNumber
          label="Zip Code"
          value={zipCode}
          min={10000}
          max={99999}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setZipCode(newValue);
          }}
        />
        <EditableNumber
          label="Quantity"
          value={quantity}
          min={1}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setQuantity(newValue);
          }}
        />
        <EditableNumber
          label="Price"
          value={price}
          decimalPlaces={2}
          step={0.01}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setPrice(newValue);
          }}
        />
      </div>
    );
  },
};
