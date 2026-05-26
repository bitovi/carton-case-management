import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Check, AlertCircle } from 'lucide-react';

const meta = {
  title: 'Figma Variants/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dependent axis combinations (20 total)
// variant × roundness × state

// Primary variant, default roundness
export const VariantPrimaryRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Badge',
  },
};

export const VariantPrimaryRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Primary variant, round roundness
export const VariantPrimaryRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'primary',
    roundness: 'round',
    children: 'Badge',
  },
};

export const VariantPrimaryRoundnessRoundStateFocus: Story = {
  args: {
    variant: 'primary',
    roundness: 'round',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Secondary variant, default roundness
export const VariantSecondaryRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'secondary',
    roundness: 'default',
    children: 'Badge',
  },
};

export const VariantSecondaryRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'secondary',
    roundness: 'default',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Secondary variant, round roundness
export const VariantSecondaryRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'secondary',
    roundness: 'round',
    children: 'Badge',
  },
};

export const VariantSecondaryRoundnessRoundStateFocus: Story = {
  args: {
    variant: 'secondary',
    roundness: 'round',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Outline variant, default roundness
export const VariantOutlineRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'outline',
    roundness: 'default',
    children: 'Badge',
  },
};

export const VariantOutlineRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'outline',
    roundness: 'default',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Outline variant, round roundness
export const VariantOutlineRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'outline',
    roundness: 'round',
    children: 'Badge',
  },
};

export const VariantOutlineRoundnessRoundStateFocus: Story = {
  args: {
    variant: 'outline',
    roundness: 'round',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Ghost variant, default roundness
export const VariantGhostRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'ghost',
    roundness: 'default',
    children: 'Badge',
  },
};

export const VariantGhostRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'ghost',
    roundness: 'default',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Ghost variant, round roundness
export const VariantGhostRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'ghost',
    roundness: 'round',
    children: 'Badge',
  },
};

export const VariantGhostRoundnessRoundStateFocus: Story = {
  args: {
    variant: 'ghost',
    roundness: 'round',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Destructive variant, default roundness
export const VariantDestructiveRoundnessDefaultStateDefault: Story = {
  args: {
    variant: 'destructive',
    roundness: 'default',
    children: 'Badge',
  },
};

export const VariantDestructiveRoundnessDefaultStateFocus: Story = {
  args: {
    variant: 'destructive',
    roundness: 'default',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Destructive variant, round roundness
export const VariantDestructiveRoundnessRoundStateDefault: Story = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Badge',
  },
};

export const VariantDestructiveRoundnessRoundStateFocus: Story = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.firstElementChild;
    if (el) (el as HTMLElement).focus();
  },
};

// Independent axis combinations (3 total)
// At default dependent values: variant=primary, roundness=default, state=default

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Badge',
    iconLeft: <Check size={14} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Badge',
    iconRight: <AlertCircle size={14} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Badge',
    iconLeft: <Check size={14} />,
    iconRight: <AlertCircle size={14} />,
  },
};
