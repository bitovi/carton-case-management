import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Check, AlertCircle, X } from 'lucide-react';

const meta = {
  title: 'Figma Variants/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary variant with default roundness, no icons
 * Baseline configuration: variant=primary, roundness=default, state=default, icons=none
 */
export const VariantPrimarySizeMdRoundDefault: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Label',
  },
};

/**
 * Primary variant with round (pill) shape, no icons
 * Tests roundness axis: variant=primary, roundness=round, state=default, icons=none
 */
export const VariantPrimaryRoundShape: Story = {
  args: {
    variant: 'primary',
    roundness: 'round',
    children: 'Label',
  },
};

/**
 * Secondary color variant with default settings
 * Tests variant axis: variant=secondary, roundness=default, state=default, icons=none
 */
export const VariantSecondary: Story = {
  args: {
    variant: 'secondary',
    roundness: 'default',
    children: 'Label',
  },
};

/**
 * Outline variant with transparent background and border
 * Tests variant axis: variant=outline, roundness=default, state=default, icons=none
 */
export const VariantOutline: Story = {
  args: {
    variant: 'outline',
    roundness: 'default',
    children: 'Label',
  },
};

/**
 * Ghost variant with transparent background and text only
 * Tests variant axis: variant=ghost, roundness=default, state=default, icons=none
 */
export const VariantGhost: Story = {
  args: {
    variant: 'ghost',
    roundness: 'default',
    children: 'Label',
  },
};

/**
 * Destructive variant with error colors
 * Tests variant axis: variant=destructive, roundness=default, state=default, icons=none
 */
export const VariantDestructive: Story = {
  args: {
    variant: 'destructive',
    roundness: 'default',
    children: 'Label',
  },
};

/**
 * Primary badge in default state with focus ring
 * Tests state axis: variant=primary, roundness=default, state=focus, icons=none
 */
export const StateFocus: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Label',
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('span');
    if (badge) {
      badge.setAttribute('tabindex', '0');
      badge.focus();
    }
  },
};

/**
 * Primary badge with left icon only
 * Tests icon axis: variant=primary, roundness=default, state=default, icons=left
 */
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Label',
    iconLeft: <Check size={14} />,
  },
};

/**
 * Primary badge with right icon only
 * Tests icon axis: variant=primary, roundness=default, state=default, icons=right
 */
export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Label',
    iconRight: <AlertCircle size={14} />,
  },
};

/**
 * Primary badge with both left and right icons
 * Tests icon axis: variant=primary, roundness=default, state=default, icons=both
 */
export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    roundness: 'default',
    children: 'Label',
    iconLeft: <Check size={14} />,
    iconRight: <X size={14} />,
  },
};
