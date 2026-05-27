import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'Figma Variants/Textarea',
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dependent variants matrix (12 total from variants.md)
 * Axes: Roundness (2) × Error (2) × Disabled (2) × State (2, pruned when disabled=true)
 */

// Roundness: default, Error: false, Disabled: false, State: default
export const RoundnessDefaultErrorFalseDisabledFalseStateDefault: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: default, Error: false, Disabled: false, State: focus
export const RoundnessDefaultErrorFalseDisabledFalseStateFocus: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
    autoFocus: true,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  },
};

// Roundness: default, Error: false, Disabled: true, State: default
export const RoundnessDefaultErrorFalseDisabledTrueStateDefault: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: true,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: default, Error: true, Disabled: false, State: default
export const RoundnessDefaultErrorTrueDisabledFalseStateDefault: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: default, Error: true, Disabled: false, State: focus
export const RoundnessDefaultErrorTrueDisabledFalseStateFocus: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
    autoFocus: true,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  },
};

// Roundness: default, Error: true, Disabled: true, State: default
export const RoundnessDefaultErrorTrueDisabledTrueStateDefault: Story = {
  args: {
    roundness: 'default',
    error: true,
    disabled: true,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: round, Error: false, Disabled: false, State: default
export const RoundnessRoundErrorFalseDisabledFalseStateDefault: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: round, Error: false, Disabled: false, State: focus
export const RoundnessRoundErrorFalseDisabledFalseStateFocus: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
    autoFocus: true,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  },
};

// Roundness: round, Error: false, Disabled: true, State: default
export const RoundnessRoundErrorFalseDisabledTrueStateDefault: Story = {
  args: {
    roundness: 'round',
    error: false,
    disabled: true,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: round, Error: true, Disabled: false, State: default
export const RoundnessRoundErrorTrueDisabledFalseStateDefault: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

// Roundness: round, Error: true, Disabled: false, State: focus
export const RoundnessRoundErrorTrueDisabledFalseStateFocus: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: false,
    showResizable: true,
    placeholder: 'Placeholder text',
    autoFocus: true,
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  },
};

// Roundness: round, Error: true, Disabled: true, State: default
export const RoundnessRoundErrorTrueDisabledTrueStateDefault: Story = {
  args: {
    roundness: 'round',
    error: true,
    disabled: true,
    showResizable: true,
    placeholder: 'Placeholder text',
  },
};

/**
 * Independent axis: ShowResizable=false (at default dependent values)
 */

// ShowResizable: false (at roundness=default, error=false, disabled=false, state=default)
export const ShowResizableFalse: Story = {
  args: {
    roundness: 'default',
    error: false,
    disabled: false,
    showResizable: false,
    placeholder: 'Placeholder text',
  },
};
