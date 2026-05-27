import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Figma Variants/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckedUncheckedErrorFalseStateDefault: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
};

export const CheckedUncheckedErrorFalseStateFocus: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedUncheckedErrorFalseStateDisabled: Story = {
  args: {
    checked: false,
    error: false,
    disabled: true,
  },
};

export const CheckedUncheckedErrorTrueStateDefault: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
};

export const CheckedUncheckedErrorTrueStateFocus: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedUncheckedErrorTrueStateDisabled: Story = {
  args: {
    checked: false,
    error: true,
    disabled: true,
  },
};

export const CheckedCheckedErrorFalseStateDefault: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
};

export const CheckedCheckedErrorFalseStateFocus: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedCheckedErrorFalseStateDisabled: Story = {
  args: {
    checked: true,
    error: false,
    disabled: true,
  },
};

export const CheckedCheckedErrorTrueStateDefault: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
};

export const CheckedCheckedErrorTrueStateFocus: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedCheckedErrorTrueStateDisabled: Story = {
  args: {
    checked: true,
    error: true,
    disabled: true,
  },
};

export const CheckedIndeterminateErrorFalseStateDefault: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: false,
    disabled: false,
  },
};

export const CheckedIndeterminateErrorFalseStateFocus: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedIndeterminateErrorFalseStateDisabled: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: false,
    disabled: true,
  },
};

export const CheckedIndeterminateErrorTrueStateDefault: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: true,
    disabled: false,
  },
};

export const CheckedIndeterminateErrorTrueStateFocus: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

export const CheckedIndeterminateErrorTrueStateDisabled: Story = {
  args: {
    checked: 'indeterminate' as const,
    error: true,
    disabled: true,
  },
};
