import type { Meta, StoryObj } from '@storybook/react';
import type { RefObject } from 'react';
import { useState } from 'react';
import { BaseEditable } from './BaseEditable';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { RenderEditModeProps } from '../types';

const meta: Meta<typeof BaseEditable<string>> = {
  title: 'Components/inline-edit/BaseEditable',
  component: BaseEditable,
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
      description: 'Current value to display',
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
    renderEditMode: {
      description: 'Function to render the edit UI',
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
type Story = StoryObj<typeof BaseEditable<string>>;

/**
 * Edit mode component - proper React component that can use hooks
 */
function EditModeInput({
  value,
  onSave,
  onCancel,
  inputRef,
}: RenderEditModeProps<string>) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <div className="flex items-center gap-1">
      <Input
        ref={inputRef as RefObject<HTMLInputElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSave(localValue);
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        className="h-8 w-48"
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => onSave(localValue)}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Render prop function that renders EditModeInput as a proper component
 */
const renderEditMode = (props: RenderEditModeProps<string>) => (
  <EditModeInput {...props} />
);

/**
 * Default state - displays value with hover interaction.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <BaseEditable {...args} />
    </div>
  ),
  args: {
    label: 'Name',
    value: 'John Doe',
    onSave: async (newValue) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
    renderEditMode: renderEditMode,
  },
};

/**
 * Interactive example with stateful value
 */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [value, setValue] = useState('John Doe');

    return (
      <div className="p-4">
        <BaseEditable
          label="Name"
          value={value}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
          renderEditMode={renderEditMode}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Current value: {value}
        </p>
      </div>
    );
  },
};

/**
 * Custom display value rendering
 */
export const CustomDisplayValue: Story = {
  args: {
    label: 'Status',
    value: 'active',
    displayValue: (
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Active
      </span>
    ),
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    renderEditMode: renderEditMode,
  },
};

/**
 * Empty/placeholder state
 */
export const EmptyValue: Story = {
  args: {
    label: 'Description',
    value: '',
    displayValue: <span className="text-muted-foreground italic">Not set</span>,
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    renderEditMode: renderEditMode,
  },
};

/**
 * Read-only mode - no interaction possible
 */
export const ReadOnly: Story = {
  args: {
    label: 'Created By',
    value: 'System Admin',
    readonly: true,
    onSave: async () => {},
    renderEditMode: renderEditMode,
  },
};

/**
 * With Zod validation
 */
export const WithZodValidation: Story = {
  render: function ValidationStory() {
    const [value, setValue] = useState('');

    return (
      <BaseEditable
        label="Email"
        value={value}
        displayValue={
          value || <span className="text-muted-foreground italic">Not set</span>
        }
        validate={z.string().email('Please enter a valid email')}
        onSave={async (newValue) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setValue(newValue);
        }}
        renderEditMode={renderEditMode}
      />
    );
  },
};

/**
 * With custom validation function
 */
export const WithCustomValidation: Story = {
  render: function CustomValidationStory() {
    const [value, setValue] = useState('hello');

    return (
      <BaseEditable
        label="Username"
        value={value}
        validate={(val) => {
          if (val.length < 3) return 'Must be at least 3 characters';
          if (val.length > 20) return 'Must be less than 20 characters';
          if (!/^[a-zA-Z0-9_]+$/.test(val))
            return 'Only letters, numbers, and underscores allowed';
          return null;
        }}
        onSave={async (newValue) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setValue(newValue);
        }}
        renderEditMode={renderEditMode}
      />
    );
  },
};

/**
 * Simulating save error
 */
export const SaveError: Story = {
  args: {
    label: 'Title',
    value: 'Original Title',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('Network connection failed. Please try again.');
    },
    renderEditMode: renderEditMode,
  },
};

/**
 * Controlled editing state
 */
export const ControlledEditing: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('Controlled Value');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="p-4">
        <BaseEditable
          label="Controlled Field"
          value={value}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
          renderEditMode={renderEditMode}
        />
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Start Editing
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel Editing
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          isEditing: {String(isEditing)}
        </p>
      </div>
    );
  },
};

/**
 * Long saving delay to demonstrate loading state
 */
export const LongSave: Story = {
  args: {
    label: 'Slow Save Field',
    value: 'Click to edit',
    onSave: async () => {
      // Simulate slow API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    renderEditMode: renderEditMode,
  },
};

/**
 * Multiple fields example
 */
export const MultipleFields: Story = {
  render: function MultipleFieldsStory() {
    const [data, setData] = useState({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });

    const handleSave =
      (field: keyof typeof data) => async (newValue: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData((prev) => ({ ...prev, [field]: newValue }));
      };

    return (
      <div className="flex flex-col gap-4 p-4">
        <BaseEditable
          label="First Name"
          value={data.firstName}
          onSave={handleSave('firstName')}
          renderEditMode={renderEditMode}
        />
        <BaseEditable
          label="Last Name"
          value={data.lastName}
          onSave={handleSave('lastName')}
          renderEditMode={renderEditMode}
        />
        <BaseEditable
          label="Email"
          value={data.email}
          validate={z.string().email('Invalid email')}
          onSave={handleSave('email')}
          renderEditMode={renderEditMode}
        />
      </div>
    );
  },
};
