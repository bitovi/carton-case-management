import type { Meta, StoryObj } from '@storybook/react';
import { useState, type RefObject } from 'react';
import { BaseEditable } from './BaseEditable';
import { Input } from '@/components/obra/Input';
import { Button } from '@/components/obra/Button';
import { Check, X } from 'lucide-react';
import type { RenderEditModeProps } from '../types';

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

const meta = {
  title: 'Figma Variants/BaseEditable',
  component: BaseEditable,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof BaseEditable<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateRest: Story = {
  args: {
    __storyState: 'rest',
    __storyError: null,
    label: 'Name',
    value: 'John Doe',
    readonly: false,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

export const StateInterest: Story = {
  args: {
    __storyState: 'interest',
    __storyError: null,
    label: 'Name',
    value: 'John Doe',
    readonly: false,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

export const StateEditNoError: Story = {
  args: {
    __storyState: 'edit',
    __storyError: null,
    label: 'Name',
    value: 'John Doe',
    readonly: false,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

export const StateEditWithError: Story = {
  args: {
    __storyState: 'edit',
    __storyError: 'Validation failed',
    label: 'Name',
    value: 'John Doe',
    readonly: false,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

export const StateSaving: Story = {
  args: {
    __storyState: 'saving',
    __storyError: null,
    label: 'Name',
    value: 'John Doe',
    readonly: false,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};

export const StateRestReadonly: Story = {
  args: {
    __storyState: 'rest',
    __storyError: null,
    label: 'Name',
    value: 'John Doe',
    readonly: true,
    renderEditMode: renderEditMode,
    onSave: async (newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved:', newValue);
    },
  },
};
