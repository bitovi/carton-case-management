/**
 * EditableCurrency Stories
 *
 * Storybook stories for the EditableCurrency component.
 * Demonstrates currency formatting, $ icon display, and various states.
 *
 * @module inline-edit/EditableCurrency
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { EditableCurrency } from './EditableCurrency';
import type { EditableCurrencyProps } from './EditableCurrency';

const meta = {
  title: 'Components/inline-edit/EditableCurrency',
  component: EditableCurrency,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline editable currency field with $ prefix. Shows $ icon inside input during editing and formats values with currency symbol in rest state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the currency value',
    },
    value: {
      control: 'number',
      description: 'Current numeric value (will be displayed with currency formatting)',
    },
    currencySymbol: {
      control: 'text',
      description: 'Currency symbol to display (default: $)',
    },
    decimalPlaces: {
      control: 'number',
      description: 'Number of decimal places (default: 2 for currency)',
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
      description: 'Step increment for input (default: 0.01)',
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
} satisfies Meta<typeof EditableCurrency>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default currency field with $99.99 value.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableCurrency {...args} />
    </div>
  ),
  args: {
    label: 'Price',
    value: 99.99,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Interactive currency field that maintains state
 */
export const Interactive: Story = {
  render: function InteractiveStory(args: EditableCurrencyProps) {
    const [value, setValue] = useState<number | null>(args.value);
    return (
      <EditableCurrency
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
    label: 'Total Amount',
    value: 1234.56,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Large currency value with thousands separators
 */
export const LargeValue: Story = {
  args: {
    label: 'Annual Revenue',
    value: 1234567.89,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Currency with different currency symbol (Euro)
 */
export const EuroCurrency: Story = {
  args: {
    label: 'Price (EUR)',
    value: 49.99,
    currencySymbol: '€',
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Currency with custom decimal places
 */
export const FourDecimalPlaces: Story = {
  args: {
    label: 'Unit Price',
    value: 0.0599,
    decimalPlaces: 4,
    step: 0.0001,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Currency with min/max constraints
 */
export const WithMinMax: Story = {
  args: {
    label: 'Donation',
    value: 50,
    min: 5,
    max: 1000,
    placeholder: 'Min $5, Max $1,000',
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Read-only currency field
 */
export const ReadOnly: Story = {
  args: {
    label: 'Fixed Rate',
    value: 29.99,
    readonly: true,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Controlled editing state (starts in edit mode)
 */
export const Controlled: Story = {
  args: {
    label: 'Editable Price',
    value: 199.99,
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
    label: 'Minimum Purchase',
    value: 100,
    validate: (value: number | null) => {
      if (value === null) return 'Amount is required';
      if (value < 25) return 'Minimum purchase is $25';
      if (value > 500) return 'Maximum purchase is $500';
      return null;
    },
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Simulated loading state during save
 */
export const Loading: Story = {
  render: function LoadingStory(args: EditableCurrencyProps) {
    const [value, setValue] = useState<number | null>(args.value);
    return (
      <EditableCurrency
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
    label: 'Processing Fee',
    value: 9.99,
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
    label: 'Optional Fee',
    value: null,
    placeholder: 'Enter fee amount...',
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Zero value display
 */
export const ZeroValue: Story = {
  args: {
    label: 'Discount',
    value: 0,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Small decimal value
 */
export const SmallValue: Story = {
  args: {
    label: 'Per-Click Cost',
    value: 0.05,
    decimalPlaces: 2,
    step: 0.01,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Negative value (for credits/refunds)
 */
export const NegativeValue: Story = {
  args: {
    label: 'Credit Applied',
    value: -25.00,
    onSave: fn().mockResolvedValue(undefined),
  },
};

/**
 * Multiple currency fields in a form-like layout
 */
export const MultipleCurrencies: Story = {
  args: {
    label: 'Subtotal',
    value: 89.99,
    onSave: fn().mockResolvedValue(undefined),
  },
  render: function MultipleCurrenciesStory() {
    const [prices, setPrices] = useState({
      subtotal: 89.99,
      tax: 7.20,
      shipping: 5.99,
      total: 103.18,
    });

    const handleSave = (key: keyof typeof prices) => async (value: number | null) => {
      setPrices((prev) => ({
        ...prev,
        [key]: value ?? 0,
      }));
    };

    return (
      <div className="flex flex-col gap-4 min-w-[200px]">
        <EditableCurrency
          label="Subtotal"
          value={prices.subtotal}
          onSave={handleSave('subtotal')}
        />
        <EditableCurrency
          label="Tax"
          value={prices.tax}
          onSave={handleSave('tax')}
        />
        <EditableCurrency
          label="Shipping"
          value={prices.shipping}
          onSave={handleSave('shipping')}
        />
        <EditableCurrency
          label="Total"
          value={prices.total}
          readonly
          onSave={handleSave('total')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple currency fields working together. Total is read-only.',
      },
    },
  },
};
