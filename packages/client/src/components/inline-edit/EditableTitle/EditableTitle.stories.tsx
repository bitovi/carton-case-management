import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { EditableTitle } from './EditableTitle';

const meta = {
  title: 'Components/inline-edit/EditableTitle',
  component: EditableTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'EditableTitle is a specialized inline editable component for page/section titles with heading typography in display mode and input field in edit mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'The current title value',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when value is empty',
      control: 'text',
    },
    readonly: {
      description: 'Whether the title is readonly',
      control: 'boolean',
    },
    isEditing: {
      description: 'Controlled editing state',
      control: 'boolean',
    },
    onSave: {
      description: 'Callback when the title is saved',
    },
    validate: {
      description: 'Optional validation function',
    },
    onEditingChange: {
      description: 'Callback when editing state changes',
    },
  },
  args: {
    onSave: fn(),
  },
} satisfies Meta<typeof EditableTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default editable title in rest state.
 * Wrapped in a bordered container to demonstrate container-filling behavior.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96 p-4 border border-dashed border-gray-300 rounded-lg">
      <EditableTitle {...args} />
    </div>
  ),
  args: {
    value: 'Insurance Claim Dispute',
    onSave: fn(),
  },
};

/**
 * Empty title with placeholder
 */
export const EmptyWithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Enter case title...',
    onSave: fn(),
  },
};

/**
 * Readonly title that cannot be edited
 */
export const Readonly: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    readonly: true,
    onSave: fn(),
  },
};

/**
 * Title in edit mode (controlled)
 */
export const EditMode: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    isEditing: true,
    onSave: fn(),
    onEditingChange: fn(),
  },
};

/**
 * Title with validation
 */
export const WithValidation: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    validate: (value) => {
      if (value.length < 3) return 'Title must be at least 3 characters';
      if (value.length > 100) return 'Title must be less than 100 characters';
      return null;
    },
    onSave: fn(),
  },
};

/**
 * Title with async save (shows saving state)
 */
export const WithAsyncSave: Story = {
  args: {
    value: 'Insurance Claim Dispute',
  },
  render: (args) => (
    <EditableTitle
      {...args}
      onSave={async (newValue: string) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Saved:', newValue);
      }}
    />
  ),
};

/**
 * Title with save error
 */
export const WithSaveError: Story = {
  args: {
    value: 'Insurance Claim Dispute',
  },
  render: (args) => (
    <EditableTitle
      {...args}
      onSave={async () => {
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Failed to save title')), 1000)
        );
      }}
    />
  ),
};

/**
 * Long title that may overflow
 */
export const LongTitle: Story = {
  args: {
    value:
      'This is a very long case title that demonstrates how the component handles extended text content',
    onSave: fn(),
  },
};

/**
 * Interactive example with controlled state
 */
export const Interactive: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    onSave: fn(),
  },
  render: function InteractiveTitle() {
    const [title, setTitle] = useState('Insurance Claim Dispute');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async (newValue: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTitle(newValue);
    };

    return (
      <div className="space-y-4">
        <EditableTitle
          value={title}
          onSave={handleSave}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          validate={(value) => {
            if (value.trim().length === 0) return 'Title cannot be empty';
            return null;
          }}
        />
        <div className="text-sm text-muted-foreground">
          Current title: {title}
        </div>
      </div>
    );
  },
};

/**
 * Case page header example
 */
export const CasePageExample: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    onSave: fn(),
  },
  render: function CasePageHeader() {
    const [title, setTitle] = useState('Insurance Claim Dispute');

    const handleSave = async (newValue: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTitle(newValue);
    };

    return (
      <div className="w-[600px] border rounded-lg p-6 bg-white">
        <EditableTitle
          value={title}
          onSave={handleSave}
          placeholder="Enter case title..."
          validate={(value) => {
            if (value.trim().length === 0) return 'Title is required';
            if (value.length > 100)
              return 'Title must be less than 100 characters';
            return null;
          }}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Case #12345 • Created Jan 20, 2025
        </div>
      </div>
    );
  },
};
