import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Figma Variants/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckedUncheckedErrorFalseStateDefault: Story = {
  args: { checked: false, error: false, disabled: false },
};

export const CheckedUncheckedErrorTrueStateDefault: Story = {
  args: { checked: false, error: true, disabled: false },
};

export const CheckedCheckedErrorFalseStateDefault: Story = {
  args: { checked: true, error: false, disabled: false },
};

export const CheckedCheckedErrorTrueStateDefault: Story = {
  args: { checked: true, error: true, disabled: false },
};

export const CheckedIndeterminateErrorFalseStateDefault: Story = {
  args: { checked: 'indeterminate', error: false, disabled: false },
};

export const CheckedIndeterminateErrorTrueStateDefault: Story = {
  args: { checked: 'indeterminate', error: true, disabled: false },
};

export const CheckedUncheckedErrorFalseStateFocus: Story = {
  args: { checked: false, error: false, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedUncheckedErrorTrueStateFocus: Story = {
  args: { checked: false, error: true, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedCheckedErrorFalseStateFocus: Story = {
  args: { checked: true, error: false, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedCheckedErrorTrueStateFocus: Story = {
  args: { checked: true, error: true, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedIndeterminateErrorFalseStateFocus: Story = {
  args: { checked: 'indeterminate', error: false, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedIndeterminateErrorTrueStateFocus: Story = {
  args: { checked: 'indeterminate', error: true, disabled: false },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (el) el.focus();
  },
};

export const CheckedUncheckedErrorFalseStateDisabled: Story = {
  args: { checked: false, error: false, disabled: true },
};

export const CheckedUncheckedErrorTrueStateDisabled: Story = {
  args: { checked: false, error: true, disabled: true },
};

export const CheckedCheckedErrorFalseStateDisabled: Story = {
  args: { checked: true, error: false, disabled: true },
};

export const CheckedCheckedErrorTrueStateDisabled: Story = {
  args: { checked: true, error: true, disabled: true },
};

export const CheckedIndeterminateErrorFalseStateDisabled: Story = {
  args: { checked: 'indeterminate', error: false, disabled: true },
};

export const CheckedIndeterminateErrorTrueStateDisabled: Story = {
  args: { checked: 'indeterminate', error: true, disabled: true },
};
