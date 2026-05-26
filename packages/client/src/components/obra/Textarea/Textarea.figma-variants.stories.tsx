import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'Figma Variants/Textarea',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=0-0',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ============================================================================
// REPRESENTATIVE SET — Core Variants (one value per axis)
// ============================================================================

// Baseline (all defaults)
export const DefaultRoundnessFalseErrorFalseDisabledFalseResizable: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: False | Disabled: False | Resizable: True',
};

// Roundness axis variant
export const RoundRoundnessFalseErrorFalseDisabledFalseResizable: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: False | Disabled: False | Resizable: True',
};

// Error axis variant
export const DefaultRoundnessTrueErrorFalseDisabledFalseResizable: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: True | Disabled: False | Resizable: True',
};

// Disabled axis variant
export const DefaultRoundnessFalseErrorFalseTrueDisabledFalseResizable: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: true,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: False | Disabled: True | Resizable: True',
};

// Resizable axis variant
export const DefaultRoundnessFalseErrorFalseDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: False | Disabled: False | Resizable: False',
};

// ============================================================================
// FOCUS STATE
// ============================================================================

export const DefaultRoundnessFalseErrorFalseDisabledFalseResizableFocus: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
    autoFocus: true,
  },
  name: 'Roundness: Default | Error: False | Disabled: False | Resizable: True | State: Focus',
  decorators: [
    (Story) => (
      <div className="p-4 bg-slate-50 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// ERROR STATE COMBINATIONS
// ============================================================================

export const RoundRoundnessTrueErrorFalseDisabledFalseResizable: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: True | Disabled: False | Resizable: True',
};

export const DefaultRoundnessTrueErrorTrueDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: false,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: True | Disabled: False | Resizable: False',
};

// ============================================================================
// DISABLED STATE COMBINATIONS
// ============================================================================

export const RoundRoundnessFalseErrorFalseTrueDisabledFalseResizable: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: true,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: False | Disabled: True | Resizable: True',
};

export const DefaultRoundnessTrueErrorTrueTrueDisabledFalseResizable: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: true,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: True | Disabled: True | Resizable: True',
};

// ============================================================================
// RESIZABLE STATE COMBINATIONS
// ============================================================================

export const RoundRoundnessFalseErrorFalseDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: false,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: False | Disabled: False | Resizable: False',
};

export const RoundRoundnessTrueErrorTrueDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: false,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: True | Disabled: False | Resizable: False',
};

// ============================================================================
// CONTENT VARIATIONS
// ============================================================================

export const DefaultRoundnessFalseErrorFalseDisabledFalseResizableWithValue: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
    value: 'This is some sample text that was already entered into the textarea.',
  },
  name: 'Roundness: Default | Error: False | Disabled: False | Resizable: True | With: Value',
};

export const DefaultRoundnessFalseErrorFalseDisabledFalseResizableWithRows: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Enter your message...',
    rows: 5,
  },
  name: 'Roundness: Default | Error: False | Disabled: False | Resizable: True | With: Custom Rows',
};

// ============================================================================
// ADDITIONAL IMPORTANT COMBINATIONS
// ============================================================================

export const RoundRoundnessTrueErrorTrueTrueDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: true,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: True | Disabled: True | Resizable: False',
};

export const RoundRoundnessTrueErrorTrueTrueDisabledFalseResizable: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: true,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Round | Error: True | Disabled: True | Resizable: True',
};

export const DefaultRoundnessTrueErrorFalseTrueDisabledFalseResizable: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: true,
    showResizable: true,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: True | Disabled: True | Resizable: True',
};

export const DefaultRoundnessTrueErrorFalseTrueDisabledFalseNoResizable: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: true,
    showResizable: false,
    placeholder: 'Enter your message...',
  },
  name: 'Roundness: Default | Error: True | Disabled: True | Resizable: False',
};
