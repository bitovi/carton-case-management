import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { Label } from '@/components/obra/Label';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'Obra/Textarea',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=279-99100',
    },
  },
  argTypes: {
    error: {
      control: 'boolean',
      description: 'Whether the textarea has an error',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether to use more rounded corners',
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the textarea is resizable',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/**
 * Default empty textarea.
 * Maps to Figma State: Empty, Roundness: Default
 */
export const Default: Story = {
  args: {},
};

/**
 * Textarea with placeholder text.
 * Maps to Figma State: Placeholder
 */
export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

/**
 * Textarea with value.
 * Maps to Figma State: Value
 */
export const WithValue: Story = {
  args: {
    defaultValue: 'This is some text content that has been entered into the textarea.',
  },
};

/**
 * Error state textarea.
 * Maps to Figma State: Error
 */
export const Error: Story = {
  args: {
    error: true,
    defaultValue: 'Invalid input',
  },
};

/**
 * Disabled textarea.
 * Maps to Figma State: Disabled
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Cannot edit this text',
  },
};

/**
 * Rounded variant.
 * Maps to Figma Roundness: Round
 */
export const Rounded: Story = {
  args: {
    rounded: true,
    placeholder: 'Rounded corners textarea',
  },
};

/**
 * Rounded variant with error.
 */
export const RoundedError: Story = {
  args: {
    rounded: true,
    error: true,
    defaultValue: 'Error with rounded corners',
  },
};

/**
 * Non-resizable textarea.
 * Maps to Figma showResizable: false
 */
export const NotResizable: Story = {
  args: {
    resizable: false,
    placeholder: 'This textarea cannot be resized',
  },
};

/**
 * Textarea with custom rows.
 */
export const CustomRows: Story = {
  args: {
    rows: 8,
    placeholder: 'Larger textarea with 8 rows',
  },
};

/**
 * Textarea with Label component.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
};

/**
 * Error state with Label and error message.
 */
export const WithLabelAndError: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        error
        aria-describedby="bio-error"
        defaultValue="Too short"
      />
      <p id="bio-error" className="text-sm text-destructive">
        Bio must be at least 50 characters
      </p>
    </div>
  ),
};

/**
 * All states comparison grid.
 * Shows Default and Round variants across all states.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Roundness</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Empty</Label>
            <Textarea />
          </div>
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Textarea placeholder="Type your message here." />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Textarea defaultValue="Some value" />
          </div>
          <div className="space-y-2">
            <Label>Error</Label>
            <Textarea error defaultValue="Invalid" />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Textarea disabled defaultValue="Disabled" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Round Variant</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Empty</Label>
            <Textarea rounded />
          </div>
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Textarea rounded placeholder="Type your message here." />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Textarea rounded defaultValue="Some value" />
          </div>
          <div className="space-y-2">
            <Label>Error</Label>
            <Textarea rounded error defaultValue="Invalid" />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Textarea rounded disabled defaultValue="Disabled" />
          </div>
        </div>
      </div>
    </div>
  ),
};
