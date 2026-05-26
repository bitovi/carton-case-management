import type { Meta, StoryObj } from '@storybook/react';
import type { RefObject } from 'react';
import { useState } from 'react';
import { BaseEditable } from './BaseEditable';
import { Input } from '@/components/obra/Input';
import { Button } from '@/components/obra/Button';
import { Check, X } from 'lucide-react';
import type { RenderEditModeProps } from '../types';

const meta = {
  title: 'Figma Variants/BaseEditable',
  component: BaseEditable,
  decorators: [],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BaseEditable>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        size="mini"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => onSave(localValue)}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="mini"
        variant="ghost"
        className="h-8 w-8"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

const renderEditMode = (props: RenderEditModeProps<string>) => (
  <EditModeInput {...props} />
);

/**
 * DEPENDENT VARIANT AXES (5 stories)
 * Combinations of State × Readonly at their base values
 */

/**
 * Variant 1: state=rest, readonly=false
 * Default display state (interactive, no background)
 */
export const StateRestReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Variant 2: state=interest, readonly=false
 * Hover/focus state with gray background
 */
export const StateInterestReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'interest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Variant 3: state=edit, readonly=false
 * Active editing mode with input field
 */
export const StateEditReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'edit',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Variant 4: state=saving, readonly=false
 * Async save in progress with spinner
 */
export const StateSavingReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'saving',
    __storyError: null,
    renderEditMode: renderEditMode,
    showSavingState: true,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Variant 5: state=rest, readonly=true
 * Non-interactive/read-only state
 */
export const StateRestReadonlyTrue: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: true,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * INDEPENDENT AXIS: Label Variations (at state=rest, readonly=false)
 */

/**
 * Long label variant - tests text wrapping and layout
 */
export const WithLongLabel: Story = {
  args: {
    label: 'Long field label with multiple words to test wrapping and layout',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * INDEPENDENT AXIS: Display Value Variations (at state=rest, readonly=false)
 */

/**
 * Short display value variant
 */
export const WithShortDisplayValue: Story = {
  args: {
    label: 'Field label',
    value: 'Short value',
    displayValue: 'Short value',
    readonly: false,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Long display value variant - tests text wrapping and flow
 */
export const WithLongDisplayValue: Story = {
  args: {
    label: 'Field label',
    value: 'A longer value to test text wrapping and how content flows',
    displayValue: 'A longer value to test text wrapping and how content flows',
    readonly: false,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * INDEPENDENT AXIS: Error State Variations
 */

/**
 * Error in edit mode - displays error message below edit UI
 */
export const StateEditReadonlyFalseWithError: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'edit',
    __storyError: 'Validation error message',
    renderEditMode: renderEditMode,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};

/**
 * Error during saving state - displays error message with spinner
 */
export const StateSavingReadonlyFalseWithError: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'saving',
    __storyError: 'Save failed: network error',
    renderEditMode: renderEditMode,
    showSavingState: true,
    onSave: async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
    },
  },
};
