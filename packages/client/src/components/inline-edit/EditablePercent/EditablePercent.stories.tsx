/**
 * EditablePercent Stories
 *
 * Storybook stories for the EditablePercent component.
 * Demonstrates percentage formatting, % icon display, and various states.
 *
 * @module inline-edit/EditablePercent
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { EditablePercent } from './EditablePercent';
import type { EditablePercentProps } from './EditablePercent';

const meta = {
  title: 'Components/inline-edit/EditablePercent',
  component: EditablePercent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline editable percent field with % suffix. Shows % icon inside input on the right during editing and formats values with % symbol in rest state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the percent value',
    },
    value: {
      control: 'number',
      description: 'Current numeric value (will be displayed with % suffix)',
    },
    decimalPlaces: {
      control: 'number',
      description: 'Number of decimal places (default: 0)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when value is null',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the field is read-only',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step increment for input (default: 1)',
    },
    isEditing: {
      control: 'boolean',
      description: 'Controlled editing state',
    },
    onSave: {
      action: 'saved',
      description: 'Called when value is saved',
    },
    onEditingChange: {
      action: 'editingChanged',
      description: 'Called when editing state changes',
    },
  },
} satisfies Meta<typeof EditablePercent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default percent field with 15% value.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditablePercent {...args} />
    </div>
  ),
  args: {
    label: 'Discount',
    value: 15,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Interactive percent field that maintains state
 */
export const Interactive: Story = {
  render: function InteractiveStory(args: EditablePercentProps) {
    const [value, setValue] = useState<number | null>(args.value);
    return (
      <EditablePercent
        {...args}
        value={value}
        onSave={async (newValue) => {
          await args.onSave(newValue);
          setValue(newValue);
        }}
      />
    );
  },
  args: {
    label: 'Tax Rate',
    value: 7.5,
    decimalPlaces: 1,
    step: 0.1,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Common percentage range 0-100
 */
export const PercentageRange: Story = {
  args: {
    label: 'Completion',
    value: 75,
    min: 0,
    max: 100,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Decimal percentage with precision
 */
export const WithDecimalPlaces: Story = {
  args: {
    label: 'Interest Rate',
    value: 5.25,
    decimalPlaces: 2,
    step: 0.01,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Read-only percent field
 */
export const ReadOnly: Story = {
  args: {
    label: 'Fixed Rate',
    value: 8.5,
    decimalPlaces: 1,
    readonly: true,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Controlled editing state (starts in edit mode)
 */
export const Controlled: Story = {
  args: {
    label: 'Editable Rate',
    value: 20,
    isEditing: true,
    onSave: fn().mockResolvedValue(undefined),
    onEditingChange: fn(),
  },
};

/**
 * With custom validation
 */
export const WithValidation: Story = {
  args: {
    label: 'Max Discount',
    value: 25,
    validate: (value: number | null) => {
      if (value === null) return 'Percentage is required';
      if (value < 0) return 'Percentage cannot be negative';
      if (value > 50) return 'Discount cannot exceed 50%';
      return null;
    },
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Simulated loading state during save
 */
export const Loading: Story = {
  render: function LoadingStory(args: EditablePercentProps) {
    const [value, setValue] = useState<number | null>(args.value);
    return (
      <EditablePercent
        {...args}
        value={value}
        onSave={async (newValue) => {
          // Simulate slow save
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setValue(newValue);
        }}
      />
    );
  },
  args: {
    label: 'Processing',
    value: 50,
    onSave: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Click save to see loading state (2 second delay).',
      },
    },
  },
};

/**
 * Empty/null value with placeholder
 */
export const Empty: Story = {
  args: {
    label: 'Optional Rate',
    value: null,
    placeholder: 'Enter rate...',
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Zero value display
 */
export const ZeroValue: Story = {
  args: {
    label: 'No Discount',
    value: 0,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * 100% value
 */
export const FullPercent: Story = {
  args: {
    label: 'Progress',
    value: 100,
    min: 0,
    max: 100,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Value over 100% (for growth rates, etc.)
 */
export const OverHundred: Story = {
  args: {
    label: 'Growth Rate',
    value: 125,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Negative percentage (for declines)
 */
export const NegativeValue: Story = {
  args: {
    label: 'Change',
    value: -15,
    min: -100,
    max: 100,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Multiple percent fields in a form-like layout
 */
export const MultiplePercentages: Story = {
  args: {
    label: 'Discount',
    value: 10,
    onSave: fn().mockResolvedValue(undefined),
  },
  render: function MultiplePercentagesStory() {
    const [rates, setRates] = useState({
      discount: 10,
      tax: 8.5,
      tip: 20,
      commission: 5,
    });

    const handleSave = (key: keyof typeof rates) => async (value: number | null) => {
      setRates((prev) => ({
        ...prev,
        [key]: value ?? 0,
      }));
    };

    return (
      <div className="flex flex-col gap-4 min-w-[200px]">
        <EditablePercent
          label="Discount"
          value={rates.discount}
          min={0}
          max={50}
          onSave={handleSave('discount')}
        />
        <EditablePercent
          label="Tax Rate"
          value={rates.tax}
          decimalPlaces={1}
          step={0.1}
          min={0}
          max={15}
          onSave={handleSave('tax')}
        />
        <EditablePercent
          label="Tip"
          value={rates.tip}
          min={0}
          max={100}
          onSave={handleSave('tip')}
        />
        <EditablePercent
          label="Commission"
          value={rates.commission}
          readonly
          onSave={handleSave('commission')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple percent fields working together. Commission is read-only.',
      },
    },
  },
};

/**
 * Step increment of 5
 */
export const StepOf5: Story = {
  args: {
    label: 'Volume',
    value: 50,
    min: 0,
    max: 100,
    step: 5,
    onSave: fn().mockResolvedValue(undefined),
  },
};
