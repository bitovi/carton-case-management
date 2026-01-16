import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { EditableTextarea } from './EditableTextarea';
import { z } from 'zod';

const meta: Meta<typeof EditableTextarea> = {
  title: 'Components/inline-edit/EditableTextarea',
  component: EditableTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text displayed above the textarea',
      control: 'text',
    },
    value: {
      description: 'Current text value (supports multi-line)',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when value is empty',
      control: 'text',
    },
    maxLength: {
      description: 'Maximum length of input',
      control: 'number',
    },
    minHeight: {
      description: 'Minimum height for the textarea in pixels',
      control: 'number',
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
    label: 'Description',
    value: 'This is a sample description text.',
    onSave: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EditableTextarea>;

/**
 * Default textarea field with basic value.
 * Click to enter edit mode, showing Save/Cancel text buttons.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableTextarea {...args} />
    </div>
  ),
  args: {
    label: 'Description',
    value: 'This is a sample description text.',
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

/**
 * Interactive example with stateful value.
 * Demonstrates full editing lifecycle with state persistence.
 */
export const Interactive: Story = {
  args: {
    label: 'Description',
    value: '',
    onSave: fn(),
  },
  render: function InteractiveStory() {
    const [value, setValue] = useState(
      'This is an interactive description that you can edit.\n\nIt supports multiple lines of text.'
    );

    return (
      <div className="w-[400px]">
        <EditableTextarea
          label="Case Notes"
          value={value}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Current value:</p>
          <pre className="text-sm whitespace-pre-wrap mt-1">{value}</pre>
        </div>
      </div>
    );
  },
};

/**
 * Empty value with placeholder text.
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Notes',
    value: '',
    placeholder: 'Enter case notes here...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Multi-line content showing line breaks preserved.
 */
export const MultiLineContent: Story = {
  args: {
    label: 'Case Summary',
    value: `Client reported issue on January 15th.
    
Investigation revealed:
- Issue with billing system
- Account flagged incorrectly
- Resolved by resetting flags

Follow-up scheduled for February 1st.`,
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * With Zod validation for minimum length.
 */
export const WithValidation: Story = {
  args: {
    label: 'Description',
    value: '',
    onSave: fn(),
  },
  render: function ValidationStory() {
    const [value, setValue] = useState('Short');

    return (
      <div className="w-[400px]">
        <EditableTextarea
          label="Description (min 20 chars)"
          value={value}
          validate={z
            .string()
            .min(20, 'Description must be at least 20 characters')}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Try saving with less than 20 characters to see validation error
        </p>
      </div>
    );
  },
};

/**
 * Custom validation function example.
 */
export const CustomValidation: Story = {
  args: {
    label: 'Summary',
    value: '',
    onSave: fn(),
  },
  render: function CustomValidationStory() {
    const [value, setValue] = useState('');

    const validate = (val: string) => {
      if (!val.trim()) return 'Summary cannot be empty';
      if (val.length > 500) return 'Summary cannot exceed 500 characters';
      return null;
    };

    return (
      <div className="w-[400px]">
        <EditableTextarea
          label="Case Summary"
          value={value}
          placeholder="Enter a summary (max 500 characters)..."
          validate={validate}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {value.length}/500 characters
        </p>
      </div>
    );
  },
};

/**
 * With max length constraint.
 */
export const WithMaxLength: Story = {
  args: {
    label: 'Brief Description',
    value: 'This is a brief description.',
    maxLength: 100,
    placeholder: 'Max 100 characters',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Custom minimum height for larger content areas.
 */
export const CustomMinHeight: Story = {
  args: {
    label: 'Detailed Notes',
    value: 'Add detailed notes here...',
    minHeight: 150,
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
    label: 'Case Notes',
    value: 'This description is read-only and cannot be edited.',
    readonly: true,
    onSave: async () => {
      // Won't be called
    },
  },
};

/**
 * With custom display value rendering.
 */
export const CustomDisplayValue: Story = {
  args: {
    label: 'Status Notes',
    value: 'Issue resolved, case closed.',
    displayValue: (
      <div className="flex items-start gap-2">
        <span className="h-2 w-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
        <span className="font-medium">Issue resolved, case closed.</span>
      </div>
    ),
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Simulating a slow save operation.
 */
export const SlowSave: Story = {
  args: {
    label: 'Notes',
    value: 'Edit this to see the saving indicator...',
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
    label: 'Notes',
    value: '',
    onSave: fn(),
  },
  render: function SaveErrorStory() {
    const [value, setValue] = useState('Try to save this...');
    const [shouldFail, setShouldFail] = useState(true);

    return (
      <div className="w-[400px]">
        <EditableTextarea
          label="Notes"
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
    label: 'Description',
    value: '',
    onSave: fn(),
  },
  render: function ControlledStory() {
    const [value, setValue] = useState('Controlled editing example.');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="w-[400px]">
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
        <EditableTextarea
          label="Controlled Description"
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
 * Multiple textareas in a form layout.
 */
export const FormExample: Story = {
  args: {
    label: 'Description',
    value: '',
    onSave: fn(),
  },
  render: function FormExampleStory() {
    const [summary, setSummary] = useState('Insurance claim for water damage.');
    const [details, setDetails] = useState(
      `Policyholder reported water damage on January 10th.

Damage assessment scheduled for January 15th.
Estimated repair cost: $5,000.`
    );
    const [notes, setNotes] = useState('');

    return (
      <div className="w-[500px] space-y-6">
        <EditableTextarea
          label="Summary"
          value={summary}
          placeholder="Enter case summary..."
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setSummary(newValue);
          }}
        />
        <EditableTextarea
          label="Details"
          value={details}
          minHeight={100}
          placeholder="Enter detailed information..."
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setDetails(newValue);
          }}
        />
        <EditableTextarea
          label="Internal Notes"
          value={notes}
          placeholder="Add internal notes (optional)..."
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setNotes(newValue);
          }}
        />
      </div>
    );
  },
};
