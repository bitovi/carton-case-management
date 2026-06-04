import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { EditableTitle } from './EditableTitle';

const meta = {
  title: 'Figma Variants/EditableTitle',
  component: EditableTitle,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
  args: {
    onSave: fn(),
  },
} as Meta<typeof EditableTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateRestValueFilled: Story = {
  args: {
    value: 'Insurance Claim Dispute',
  },
};

export const StateRestValueEmpty: Story = {
  args: {
    value: '',
    placeholder: 'Enter title...',
  },
};

export const StateRestReadonly: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    readonly: true,
  },
};

export const StateHoverValueFilled: Story = {
  args: {
    value: 'Insurance Claim Dispute',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('heading');
    await userEvent.hover(title);
  },
};

export const StateEditValueFilled: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    isEditing: true,
    onEditingChange: fn(),
  },
};

export const StateEditValueFilledErrorTrue: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    isEditing: true,
    validate: () => 'Title already exists',
    onEditingChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const saveButton = canvas.getByLabelText('Save title');
    await userEvent.click(saveButton);
  },
};

export const StateSavingValueFilled: Story = {
  args: {
    value: 'Insurance Claim Dispute',
    onSave: () => new Promise<void>(() => {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('heading');
    await userEvent.click(title);
    const input = await canvas.findByLabelText('Edit title');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Title');
    const saveButton = canvas.getByLabelText('Save title');
    await userEvent.click(saveButton);
  },
};

export const StateEditValueEmpty: Story = {
  args: {
    value: '',
    isEditing: true,
    placeholder: 'Enter title...',
    onEditingChange: fn(),
  },
};
