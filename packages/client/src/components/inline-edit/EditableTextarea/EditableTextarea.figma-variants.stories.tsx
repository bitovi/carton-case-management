import type { Meta, StoryObj } from '@storybook/react';
import { EditableTextarea } from './EditableTextarea';

const meta = {
  title: 'Figma Variants/EditableTextarea',
  component: EditableTextarea,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
  args: {
    label: 'Description',
    value: 'This is a sample description text that spans multiple lines to demonstrate the textarea display behavior.',
    onSave: async () => {
      await new Promise(() => {});
    },
  },
} as Meta<typeof EditableTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ModeRestContentWithValueReadonlyFalse: Story = {
  args: {
    value: 'This is a sample description text that spans multiple lines to demonstrate the textarea display behavior.',
    readonly: false,
  },
};

export const ModeRestContentWithValueReadonlyTrue: Story = {
  args: {
    value: 'This is a sample description text that spans multiple lines to demonstrate the textarea display behavior.',
    readonly: true,
  },
};

export const ModeRestContentEmptyReadonlyFalse: Story = {
  args: {
    value: '',
    readonly: false,
    placeholder: 'Enter description...',
  },
};

export const ModeEditStateDefault: Story = {
  args: {
    isEditing: true,
  },
};

export const ModeEditStateSaving: Story = {
  args: {
    isEditing: true,
    onSave: () => new Promise(() => {}),
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 200));
    const buttons = Array.from(canvasElement.querySelectorAll('button'));
    const saveBtn = buttons.find((b) => b.textContent?.trim() === 'Save');
    if (saveBtn) saveBtn.click();
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const ModeEditStateError: Story = {
  args: {
    isEditing: true,
    onSave: async () => {
      throw new Error('Save failed');
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 200));
    const buttons = Array.from(canvasElement.querySelectorAll('button'));
    const saveBtn = buttons.find((b) => b.textContent?.trim() === 'Save');
    if (saveBtn) saveBtn.click();
    await new Promise((r) => setTimeout(r, 300));
  },
};

export const WithCustomDisplayValue: Story = {
  args: {
    value: 'This is a sample description text.',
    readonly: false,
    displayValue: (
      <span style={{ color: '#6366f1', fontStyle: 'italic' }}>
        Custom rendered description content
      </span>
    ),
  },
};
