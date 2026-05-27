import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Input } from './Input';

const meta = {
  title: 'Figma Variants/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// =========== REPRESENTATIVE SET (11 dependent combinations) ===========

// Core baseline
export const SizeRegularRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
};

// Size variants
export const SizeMiniRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
};

export const SizeSmallRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
};

export const SizeLargeRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
};

// Roundness variant
export const SizeRegularRoundnessRoundErrorFalseStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: false,
    placeholder: 'Enter text...',
  },
};

// Error variant
export const SizeRegularRoundnessDefaultErrorTrueStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Invalid input',
  },
};

// State variants - Focus
export const SizeRegularRoundnessDefaultErrorFalseStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input) {
      input.focus();
    }
  },
};

// State variants - Disabled
export const SizeRegularRoundnessDefaultErrorFalseStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    disabled: true,
    placeholder: 'Disabled input',
  },
};

// Cross-axis: Error + Focus
export const SizeRegularRoundnessDefaultErrorTrueStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Invalid input',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input) {
      input.focus();
    }
  },
};

// Cross-axis: Roundness + Error
export const SizeRegularRoundnessRoundErrorTrueStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: true,
    placeholder: 'Invalid input',
  },
};

// Cross-axis: Error + Disabled
export const SizeRegularRoundnessDefaultErrorTrueStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    disabled: true,
    placeholder: 'Disabled with error',
  },
};

// =========== INDEPENDENT COMPONENT PROPERTIES ===========

// Left decoration
export const WithLeftDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'With left decoration',
    leftDecoration: (
      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
};

// Right decoration
export const WithRightDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'With right decoration',
    rightDecoration: (
      <button type="button" className="text-muted-foreground hover:text-foreground">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ),
  },
};

// Both decorations
export const WithBothDecorations: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'With both decorations',
    leftDecoration: (
      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    rightDecoration: (
      <button type="button" className="text-muted-foreground hover:text-foreground">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ),
  },
};
