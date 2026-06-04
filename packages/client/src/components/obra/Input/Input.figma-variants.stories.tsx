import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, X } from 'lucide-react';

const meta = {
  title: 'Figma Variants/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SizeMiniRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Mini input',
  },
};

export const SizeMiniRoundnessDefaultErrorFalseStateFocus: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Mini input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeMiniRoundnessDefaultErrorFalseStateDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Mini input',
    disabled: true,
  },
};

export const SizeMiniRoundnessDefaultErrorTrueStateDefault: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: true,
    placeholder: 'Mini input',
  },
};

export const SizeMiniRoundnessDefaultErrorTrueStateFocus: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: true,
    placeholder: 'Mini input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeMiniRoundnessDefaultErrorTrueStateDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: true,
    placeholder: 'Mini input',
    disabled: true,
  },
};

export const SizeMiniRoundnessRoundErrorFalseStateDefault: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: false,
    placeholder: 'Mini input',
  },
};

export const SizeMiniRoundnessRoundErrorFalseStateFocus: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: false,
    placeholder: 'Mini input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeMiniRoundnessRoundErrorFalseStateDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: false,
    placeholder: 'Mini input',
    disabled: true,
  },
};

export const SizeMiniRoundnessRoundErrorTrueStateDefault: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: true,
    placeholder: 'Mini input',
  },
};

export const SizeMiniRoundnessRoundErrorTrueStateFocus: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: true,
    placeholder: 'Mini input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeMiniRoundnessRoundErrorTrueStateDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: true,
    placeholder: 'Mini input',
    disabled: true,
  },
};

export const SizeSmallRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: false,
    placeholder: 'Small input',
  },
};

export const SizeSmallRoundnessDefaultErrorFalseStateFocus: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: false,
    placeholder: 'Small input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeSmallRoundnessDefaultErrorFalseStateDisabled: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: false,
    placeholder: 'Small input',
    disabled: true,
  },
};

export const SizeSmallRoundnessDefaultErrorTrueStateDefault: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: true,
    placeholder: 'Small input',
  },
};

export const SizeSmallRoundnessDefaultErrorTrueStateFocus: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: true,
    placeholder: 'Small input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeSmallRoundnessDefaultErrorTrueStateDisabled: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: true,
    placeholder: 'Small input',
    disabled: true,
  },
};

export const SizeSmallRoundnessRoundErrorFalseStateDefault: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: false,
    placeholder: 'Small input',
  },
};

export const SizeSmallRoundnessRoundErrorFalseStateFocus: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: false,
    placeholder: 'Small input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeSmallRoundnessRoundErrorFalseStateDisabled: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: false,
    placeholder: 'Small input',
    disabled: true,
  },
};

export const SizeSmallRoundnessRoundErrorTrueStateDefault: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: true,
    placeholder: 'Small input',
  },
};

export const SizeSmallRoundnessRoundErrorTrueStateFocus: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: true,
    placeholder: 'Small input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeSmallRoundnessRoundErrorTrueStateDisabled: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: true,
    placeholder: 'Small input',
    disabled: true,
  },
};

export const SizeRegularRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Regular input',
  },
};

export const SizeRegularRoundnessDefaultErrorFalseStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Regular input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeRegularRoundnessDefaultErrorFalseStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Regular input',
    disabled: true,
  },
};

export const SizeRegularRoundnessDefaultErrorTrueStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Regular input',
  },
};

export const SizeRegularRoundnessDefaultErrorTrueStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Regular input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeRegularRoundnessDefaultErrorTrueStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Regular input',
    disabled: true,
  },
};

export const SizeRegularRoundnessRoundErrorFalseStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: false,
    placeholder: 'Regular input',
  },
};

export const SizeRegularRoundnessRoundErrorFalseStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: false,
    placeholder: 'Regular input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeRegularRoundnessRoundErrorFalseStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: false,
    placeholder: 'Regular input',
    disabled: true,
  },
};

export const SizeRegularRoundnessRoundErrorTrueStateDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: true,
    placeholder: 'Regular input',
  },
};

export const SizeRegularRoundnessRoundErrorTrueStateFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: true,
    placeholder: 'Regular input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeRegularRoundnessRoundErrorTrueStateDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: true,
    placeholder: 'Regular input',
    disabled: true,
  },
};

export const SizeLargeRoundnessDefaultErrorFalseStateDefault: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: false,
    placeholder: 'Large input',
  },
};

export const SizeLargeRoundnessDefaultErrorFalseStateFocus: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: false,
    placeholder: 'Large input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeLargeRoundnessDefaultErrorFalseStateDisabled: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: false,
    placeholder: 'Large input',
    disabled: true,
  },
};

export const SizeLargeRoundnessDefaultErrorTrueStateDefault: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: true,
    placeholder: 'Large input',
  },
};

export const SizeLargeRoundnessDefaultErrorTrueStateFocus: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: true,
    placeholder: 'Large input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeLargeRoundnessDefaultErrorTrueStateDisabled: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: true,
    placeholder: 'Large input',
    disabled: true,
  },
};

export const SizeLargeRoundnessRoundErrorFalseStateDefault: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: false,
    placeholder: 'Large input',
  },
};

export const SizeLargeRoundnessRoundErrorFalseStateFocus: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: false,
    placeholder: 'Large input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeLargeRoundnessRoundErrorFalseStateDisabled: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: false,
    placeholder: 'Large input',
    disabled: true,
  },
};

export const SizeLargeRoundnessRoundErrorTrueStateDefault: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: true,
    placeholder: 'Large input',
  },
};

export const SizeLargeRoundnessRoundErrorTrueStateFocus: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: true,
    placeholder: 'Large input',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('input');
    if (el) el.focus();
  },
};

export const SizeLargeRoundnessRoundErrorTrueStateDisabled: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: true,
    placeholder: 'Large input',
    disabled: true,
  },
};

export const WithLeftDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Search...',
    leftDecoration: <Search className="h-4 w-4 text-muted-foreground" />,
  },
};

export const WithRightDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Clear me',
    rightDecoration: <X className="h-4 w-4 text-muted-foreground" />,
  },
};

export const WithBothDecorations: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Search...',
    leftDecoration: <Search className="h-4 w-4 text-muted-foreground" />,
    rightDecoration: <X className="h-4 w-4 text-muted-foreground" />,
  },
};
