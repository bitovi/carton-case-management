import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Check, ChevronRight } from 'lucide-react';

const meta = {
  title: 'Figma Variants/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Baseline and Variant Axis (6 stories)
// ============================================================================

export const VariantPrimarySizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantSecondarySizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'secondary',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantOutlineSizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'outline',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantGhostSizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'ghost',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantGhostMutedSizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'ghost-muted',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantDestructiveSizeRegularRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'destructive',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
};

// ============================================================================
// Size Axis (3 stories, variant=primary)
// ============================================================================

export const VariantPrimarySizeLargeRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantPrimarySizeSmallRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    roundness: 'default',
    children: 'Button',
  },
};

export const VariantPrimarySizeMiniRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'primary',
    size: 'mini',
    roundness: 'default',
    children: 'Button',
  },
};

// ============================================================================
// Roundness Axis (1 story, variant=primary, size=regular)
// ============================================================================

export const VariantPrimarySizeRegularRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'round',
    children: 'Button',
  },
};

// ============================================================================
// State Axis (4 stories, variant=primary, size=regular, roundness=default)
// ============================================================================

export const VariantPrimarySizeRegularRoundnessDefaultStateHover: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      button.classList.add('hover');
    }
  },
};

export const VariantPrimarySizeRegularRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    if (button) {
      button.focus();
    }
  },
};

export const VariantPrimarySizeRegularRoundnessDefaultStateActive: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    children: 'Button',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const VariantPrimarySizeRegularRoundnessDefaultStateDisabled: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    disabled: true,
    children: 'Button',
  },
};

// ============================================================================
// Independent Axis: Icons (3 stories)
// ============================================================================

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    leftIcon: <Check className="w-4 h-4" />,
    children: 'Button',
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    rightIcon: <ChevronRight className="w-4 h-4" />,
    children: 'Button',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    leftIcon: <Check className="w-4 h-4" />,
    rightIcon: <ChevronRight className="w-4 h-4" />,
    children: 'Button',
  },
};
