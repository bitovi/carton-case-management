import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Download } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Figma Variants/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Core variants — all variant × state at size=regular, roundness=default
// ---------------------------------------------------------------------------

export const VariantPrimaryStateDefault: Story = {
  args: { variant: 'primary', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantPrimaryStateHover: Story = {
  args: { variant: 'primary', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantPrimaryStateFocus: Story = {
  args: { variant: 'primary', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantPrimaryStateDisabled: Story = {
  args: { variant: 'primary', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

export const VariantSecondaryStateDefault: Story = {
  args: { variant: 'secondary', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantSecondaryStateHover: Story = {
  args: { variant: 'secondary', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantSecondaryStateFocus: Story = {
  args: { variant: 'secondary', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantSecondaryStateDisabled: Story = {
  args: { variant: 'secondary', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

export const VariantOutlineStateDefault: Story = {
  args: { variant: 'outline', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantOutlineStateHover: Story = {
  args: { variant: 'outline', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantOutlineStateFocus: Story = {
  args: { variant: 'outline', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantOutlineStateDisabled: Story = {
  args: { variant: 'outline', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

export const VariantGhostStateDefault: Story = {
  args: { variant: 'ghost', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantGhostStateHover: Story = {
  args: { variant: 'ghost', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantGhostStateFocus: Story = {
  args: { variant: 'ghost', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantGhostStateDisabled: Story = {
  args: { variant: 'ghost', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

export const VariantGhostMutedStateDefault: Story = {
  args: { variant: 'ghost-muted', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantGhostMutedStateHover: Story = {
  args: { variant: 'ghost-muted', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantGhostMutedStateFocus: Story = {
  args: { variant: 'ghost-muted', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantGhostMutedStateDisabled: Story = {
  args: { variant: 'ghost-muted', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

export const VariantDestructiveStateDefault: Story = {
  args: { variant: 'destructive', size: 'regular', roundness: 'default', children: 'Label' },
};

export const VariantDestructiveStateHover: Story = {
  args: { variant: 'destructive', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const VariantDestructiveStateFocus: Story = {
  args: { variant: 'destructive', size: 'regular', roundness: 'default', children: 'Label' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const VariantDestructiveStateDisabled: Story = {
  args: { variant: 'destructive', size: 'regular', roundness: 'default', children: 'Label', disabled: true },
};

// ---------------------------------------------------------------------------
// Size variants — all sizes at variant=primary, roundness=default, state=default
// (primary/regular already covered by VariantPrimaryStateDefault)
// ---------------------------------------------------------------------------

export const SizeLarge: Story = {
  args: { variant: 'primary', size: 'large', roundness: 'default', children: 'Label' },
};

export const SizeSmall: Story = {
  args: { variant: 'primary', size: 'small', roundness: 'default', children: 'Label' },
};

export const SizeMini: Story = {
  args: { variant: 'primary', size: 'mini', roundness: 'default', children: 'Label' },
};

// ---------------------------------------------------------------------------
// Roundness variants — at variant=primary, size=regular, state=default
// (roundness=default already covered by VariantPrimaryStateDefault)
// ---------------------------------------------------------------------------

export const RoundnessRound: Story = {
  args: { variant: 'primary', size: 'regular', roundness: 'round', children: 'Label' },
};

// ---------------------------------------------------------------------------
// Cross-axis spot checks — each variant at each non-regular size, state=default, roundness=default
// (primary sizes already covered above)
// ---------------------------------------------------------------------------

export const VariantSecondarySizeLarge: Story = {
  args: { variant: 'secondary', size: 'large', roundness: 'default', children: 'Label' },
};

export const VariantSecondarySizeSmall: Story = {
  args: { variant: 'secondary', size: 'small', roundness: 'default', children: 'Label' },
};

export const VariantSecondarySizeMini: Story = {
  args: { variant: 'secondary', size: 'mini', roundness: 'default', children: 'Label' },
};

export const VariantOutlineSizeLarge: Story = {
  args: { variant: 'outline', size: 'large', roundness: 'default', children: 'Label' },
};

export const VariantOutlineSizeSmall: Story = {
  args: { variant: 'outline', size: 'small', roundness: 'default', children: 'Label' },
};

export const VariantOutlineSizeMini: Story = {
  args: { variant: 'outline', size: 'mini', roundness: 'default', children: 'Label' },
};

export const VariantGhostSizeLarge: Story = {
  args: { variant: 'ghost', size: 'large', roundness: 'default', children: 'Label' },
};

export const VariantGhostSizeSmall: Story = {
  args: { variant: 'ghost', size: 'small', roundness: 'default', children: 'Label' },
};

export const VariantGhostSizeMini: Story = {
  args: { variant: 'ghost', size: 'mini', roundness: 'default', children: 'Label' },
};

export const VariantGhostMutedSizeLarge: Story = {
  args: { variant: 'ghost-muted', size: 'large', roundness: 'default', children: 'Label' },
};

export const VariantGhostMutedSizeSmall: Story = {
  args: { variant: 'ghost-muted', size: 'small', roundness: 'default', children: 'Label' },
};

export const VariantGhostMutedSizeMini: Story = {
  args: { variant: 'ghost-muted', size: 'mini', roundness: 'default', children: 'Label' },
};

export const VariantDestructiveSizeLarge: Story = {
  args: { variant: 'destructive', size: 'large', roundness: 'default', children: 'Label' },
};

export const VariantDestructiveSizeSmall: Story = {
  args: { variant: 'destructive', size: 'small', roundness: 'default', children: 'Label' },
};

export const VariantDestructiveSizeMini: Story = {
  args: { variant: 'destructive', size: 'mini', roundness: 'default', children: 'Label' },
};

// ---------------------------------------------------------------------------
// Roundness cross-checks — each variant at roundness=round, size=regular, state=default
// (primary/round already covered by RoundnessRound)
// ---------------------------------------------------------------------------

export const VariantSecondaryRoundnessRound: Story = {
  args: { variant: 'secondary', size: 'regular', roundness: 'round', children: 'Label' },
};

export const VariantOutlineRoundnessRound: Story = {
  args: { variant: 'outline', size: 'regular', roundness: 'round', children: 'Label' },
};

export const VariantGhostRoundnessRound: Story = {
  args: { variant: 'ghost', size: 'regular', roundness: 'round', children: 'Label' },
};

export const VariantGhostMutedRoundnessRound: Story = {
  args: { variant: 'ghost-muted', size: 'regular', roundness: 'round', children: 'Label' },
};

export const VariantDestructiveRoundnessRound: Story = {
  args: { variant: 'destructive', size: 'regular', roundness: 'round', children: 'Label' },
};

// ---------------------------------------------------------------------------
// Independent axis screenshots — at baseline (primary/regular/default/default)
// ---------------------------------------------------------------------------

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    leftIcon: <Plus size={16} />,
    children: 'Label',
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    rightIcon: <Download size={16} />,
    children: 'Label',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    roundness: 'default',
    leftIcon: <Plus size={16} />,
    rightIcon: <Download size={16} />,
    children: 'Label',
  },
};
