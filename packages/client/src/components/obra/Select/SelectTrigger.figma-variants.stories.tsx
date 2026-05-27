import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';
import { User } from 'lucide-react';

const meta = {
  title: 'Figma Variants/SelectTrigger',
  component: SelectTrigger,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectTriggerWrapper({ size = 'regular', layout = 'single', error = false, disabled = false, leftDecoration = false, children = 'Select an item', state = 'default', label = 'Label', prependText = '' }: any) {
  const [value, setValue] = useState('');
  
  return (
    <Select value={value} onValueChange={setValue} disabled={disabled}>
      <SelectTrigger 
        size={size as any}
        layout={layout as any}
        error={error}
        disabled={disabled}
        label={layout === 'stacked' ? label : undefined}
        prependText={layout === 'single' ? prependText : ''}
        leftDecoration={leftDecoration ? <User className="w-4 h-4" /> : undefined}
      >
        <SelectValue placeholder={children} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
        <SelectItem value="item3">Item 3</SelectItem>
      </SelectContent>
    </Select>
  );
}

// Core variants - All size × layout × error at default state (16 combinations)

export const SizeMiniLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'mini',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeSmallLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'small',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeRegularLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeLargeLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'large',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeMiniLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'mini',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeSmallLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'small',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeRegularLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeLargeLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'large',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeMiniLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'mini',
    layout: 'single',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeSmallLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'small',
    layout: 'single',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeRegularLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeLargeLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'large',
    layout: 'single',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeMiniLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'mini',
    layout: 'stacked',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeSmallLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'small',
    layout: 'stacked',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeRegularLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

export const SizeLargeLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'large',
    layout: 'stacked',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};

// State variants - Focus and disabled at representative sizes (8 combinations)

export const SizeRegularLayoutSingleErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'focus',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    if (trigger) {
      (trigger as HTMLElement).focus();
    }
  },
};

export const SizeRegularLayoutSingleErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'focus',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    if (trigger) {
      (trigger as HTMLElement).focus();
    }
  },
};

export const SizeRegularLayoutStackedErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'focus',
    label: 'Label',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    if (trigger) {
      (trigger as HTMLElement).focus();
    }
  },
};

export const SizeRegularLayoutStackedErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: true,
    disabled: false,
    leftDecoration: false,
    children: 'Select an item',
    state: 'focus',
    label: 'Label',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    if (trigger) {
      (trigger as HTMLElement).focus();
    }
  },
};

export const SizeRegularLayoutSingleErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: false,
    disabled: true,
    leftDecoration: false,
    children: 'Select an item',
    state: 'disabled',
  },
};

export const SizeRegularLayoutSingleErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: true,
    disabled: true,
    leftDecoration: false,
    children: 'Select an item',
    state: 'disabled',
  },
};

export const SizeRegularLayoutStackedErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    disabled: true,
    leftDecoration: false,
    children: 'Select an item',
    state: 'disabled',
    label: 'Label',
  },
};

export const SizeRegularLayoutStackedErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: true,
    disabled: true,
    leftDecoration: false,
    children: 'Select an item',
    state: 'disabled',
    label: 'Label',
  },
};

// Independent axis screenshots (at default dependent values)

export const SizeRegularLayoutSingleErrorFalseStateDefaultWithLeftDecoration: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'single',
    error: false,
    disabled: false,
    leftDecoration: true,
    children: 'Select an item',
    state: 'default',
  },
};

export const SizeRegularLayoutStackedErrorFalseStateDefaultWithLeftDecoration: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    disabled: false,
    leftDecoration: true,
    children: 'Select an item',
    state: 'default',
    label: 'Label',
  },
};
