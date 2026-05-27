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
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof BaseEditable>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const defaultOnSave = async () => {
  await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
};

export const StateRestReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: defaultOnSave,
  },
};

export const StateInterestReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'interest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: defaultOnSave,
  },
};

export const StateEditReadonlyFalse: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'edit',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: defaultOnSave,
  },
};

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
    onSave: defaultOnSave,
  },
};

export const StateRestReadonlyTrue: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: true,
    __storyState: 'rest',
    __storyError: null,
    renderEditMode: renderEditMode,
    onSave: defaultOnSave,
  },
};

export const StateEditWithError: Story = {
  args: {
    label: 'Field label',
    value: 'Display value',
    displayValue: 'Display value',
    readonly: false,
    __storyState: 'edit',
    __storyError: 'Validation error',
    renderEditMode: renderEditMode,
    onSave: defaultOnSave,
  },
};
