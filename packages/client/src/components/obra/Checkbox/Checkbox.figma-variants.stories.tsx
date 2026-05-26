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

// Unchecked, No Error
export const UncheckedDefault: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
};

export const UncheckedHover: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const UncheckedFocus: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const UncheckedActive: Story = {
  args: {
    checked: false,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const UncheckedDisabled: Story = {
  args: {
    checked: false,
    error: false,
    disabled: true,
  },
};

// Unchecked, Error
export const UncheckedErrorDefault: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
};

export const UncheckedErrorHover: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const UncheckedErrorFocus: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const UncheckedErrorActive: Story = {
  args: {
    checked: false,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const UncheckedErrorDisabled: Story = {
  args: {
    checked: false,
    error: true,
    disabled: true,
  },
};

// Checked, No Error
export const CheckedDefault: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
};

export const CheckedHover: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const CheckedFocus: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const CheckedActive: Story = {
  args: {
    checked: true,
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    error: false,
    disabled: true,
  },
};

// Checked, Error
export const CheckedErrorDefault: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
};

export const CheckedErrorHover: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const CheckedErrorFocus: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const CheckedErrorActive: Story = {
  args: {
    checked: true,
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const CheckedErrorDisabled: Story = {
  args: {
    checked: true,
    error: true,
    disabled: true,
  },
};

// Indeterminate, No Error
export const IndeterminateDefault: Story = {
  args: {
    checked: 'indeterminate',
    error: false,
    disabled: false,
  },
};

export const IndeterminateHover: Story = {
  args: {
    checked: 'indeterminate',
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const IndeterminateFocus: Story = {
  args: {
    checked: 'indeterminate',
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const IndeterminateActive: Story = {
  args: {
    checked: 'indeterminate',
    error: false,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const IndeterminateDisabled: Story = {
  args: {
    checked: 'indeterminate',
    error: false,
    disabled: true,
  },
};

// Indeterminate, Error
export const IndeterminateErrorDefault: Story = {
  args: {
    checked: 'indeterminate',
    error: true,
    disabled: false,
  },
};

export const IndeterminateErrorHover: Story = {
  args: {
    checked: 'indeterminate',
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (checkbox as HTMLElement).classList.add('hover');
    }
  },
};

export const IndeterminateErrorFocus: Story = {
  args: {
    checked: 'indeterminate',
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).focus();
    }
  },
};

export const IndeterminateErrorActive: Story = {
  args: {
    checked: 'indeterminate',
    error: true,
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') || canvasElement.firstElementChild;
    if (checkbox) {
      (checkbox as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const IndeterminateErrorDisabled: Story = {
  args: {
    checked: 'indeterminate',
    error: true,
    disabled: true,
  },
};
