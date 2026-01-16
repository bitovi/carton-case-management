import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditableText } from './EditableText';
import { z } from 'zod';

const meta: Meta<typeof EditableText> = {
  title: 'Components/inline-edit/EditableText',
  component: EditableText,
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
      description: 'Current text value',
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
    type: {
      description: 'Input type (text, email, url, tel)',
      control: 'select',
      options: ['text', 'email', 'url', 'tel'],
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
type Story = StoryObj<typeof EditableText>;

/**
 * Default text field with basic value.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableText {...args} />
    </div>
  ),
  args: {
    label: 'Name',
    value: 'John Doe',
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
    const [value, setValue] = useState('Insurance Claim Dispute');

    return (
      <div className="w-[300px]">
        <EditableText
          label="Notes"
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
 * Empty value with placeholder
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Description',
    value: '',
    placeholder: 'Enter a description...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Email input type with validation
 */
export const EmailField: Story = {
  render: function EmailStory() {
    const [value, setValue] = useState('john@example.com');

    return (
      <div className="w-[300px]">
        <EditableText
          label="Email"
          value={value}
          type="email"
          placeholder="Enter email..."
          validate={z.string().email('Please enter a valid email address')}
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
 * URL input type
 */
export const UrlField: Story = {
  args: {
    label: 'Website',
    value: 'https://example.com',
    type: 'url',
    placeholder: 'Enter URL...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * Phone input type
 */
export const PhoneField: Story = {
  args: {
    label: 'Phone',
    value: '+1 (555) 123-4567',
    type: 'tel',
    placeholder: 'Enter phone number...',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

/**
 * With max length constraint
 */
export const WithMaxLength: Story = {
  args: {
    label: 'Short Name',
    value: 'John',
    maxLength: 20,
    placeholder: 'Max 20 characters',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
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
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-medium">Active</span>
      </span>
    ),
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
    label: 'Created By',
    value: 'System Administrator',
    readonly: true,
    onSave: async () => {},
  },
};

/**
 * With Zod validation
 */
export const WithZodValidation: Story = {
  render: function ValidationStory() {
    const [value, setValue] = useState('ab');

    return (
      <div className="w-[300px]">
        <EditableText
          label="Username"
          value={value}
          validate={z
            .string()
            .min(3, 'Must be at least 3 characters')
            .max(20, 'Must be at most 20 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Try saving &quot;ab&quot; to see validation error
        </p>
      </div>
    );
  },
};

/**
 * With custom validation function
 */
export const WithCustomValidation: Story = {
  render: function CustomValidationStory() {
    const [value, setValue] = useState('hello world');

    return (
      <div className="w-[300px]">
        <EditableText
          label="Title"
          value={value}
          validate={(val) => {
            if (!val.trim()) return 'Title is required';
            if (val.length < 5) return 'Title must be at least 5 characters';
            if (val.length > 50) return 'Title must be at most 50 characters';
            return null;
          }}
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
 * Simulating save error
 */
export const SaveError: Story = {
  args: {
    label: 'Field with Error',
    value: 'Original Value',
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('Network connection failed. Please try again.');
    },
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
      <div className="w-[300px]">
        <EditableText
          label="Controlled Field"
          value={value}
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
 * Long save delay to demonstrate loading state
 */
export const LongSave: Story = {
  args: {
    label: 'Slow Save Field',
    value: 'Click to edit and save',
    onSave: async () => {
      // Simulate slow API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
  },
};

/**
 * Multiple text fields example
 */
export const MultipleFields: Story = {
  render: function MultipleFieldsStory() {
    const [data, setData] = useState({
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corp',
      title: 'Software Engineer',
    });

    const handleSave =
      (field: keyof typeof data) => async (newValue: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData((prev) => ({ ...prev, [field]: newValue }));
      };

    return (
      <div className="flex flex-col gap-4 w-[300px]">
        <EditableText
          label="First Name"
          value={data.firstName}
          onSave={handleSave('firstName')}
        />
        <EditableText
          label="Last Name"
          value={data.lastName}
          onSave={handleSave('lastName')}
        />
        <EditableText
          label="Company"
          value={data.company}
          onSave={handleSave('company')}
        />
        <EditableText
          label="Title"
          value={data.title}
          onSave={handleSave('title')}
        />
      </div>
    );
  },
};
