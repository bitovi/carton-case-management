import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './Select';
import { Mail, User, Settings } from 'lucide-react';

const meta = {
  title: 'Figma Variants/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

interface InteractiveSelectProps {
  value?: string;
  children?: ReactNode;
}

function InteractiveSelect({ value: initialValue, children }: InteractiveSelectProps) {
  const [value, setValue] = useState(initialValue || '');
  return (
    <Select value={value} onValueChange={setValue}>
      {children}
    </Select>
  );
}

// ============================================================================
// Dependent Axis Variants: Size × Layout × Error × Disabled (32 total)
// ============================================================================

// MINI SIZE

export const SizeMiniLayoutSingleErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="single" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutSingleErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="single" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutSingleErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="single" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutSingleErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="single" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutStackedErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="stacked" label="Choose" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutStackedErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="stacked" label="Choose" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutStackedErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="stacked" label="Choose" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeMiniLayoutStackedErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="mini" layout="stacked" label="Choose" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

// SMALL SIZE

export const SizeSmallLayoutSingleErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="single" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutSingleErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="single" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutSingleErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="single" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutSingleErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="single" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutStackedErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="stacked" label="Choose" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutStackedErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="stacked" label="Choose" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutStackedErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="stacked" label="Choose" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeSmallLayoutStackedErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="small" layout="stacked" label="Choose" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

// REGULAR SIZE

export const SizeRegularLayoutSingleErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutSingleErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutSingleErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutSingleErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutStackedErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="stacked" label="Choose" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutStackedErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="stacked" label="Choose" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutStackedErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="stacked" label="Choose" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeRegularLayoutStackedErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="stacked" label="Choose" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

// LARGE SIZE

export const SizeLargeLayoutSingleErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="single" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutSingleErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="single" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutSingleErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="single" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutSingleErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="single" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutStackedErrorFalseDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="stacked" label="Choose" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutStackedErrorFalseDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="stacked" label="Choose" error={false} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutStackedErrorTrueDisabledFalse: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="stacked" label="Choose" error={true} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const SizeLargeLayoutStackedErrorTrueDisabledTrue: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="large" layout="stacked" label="Choose" error={true} disabled={true}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

// ============================================================================
// Independent Axis Variants (at default dependent values)
// ============================================================================

export const WithLeftDecoration: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={false} disabled={false} leftDecoration={<User className="w-4 h-4" />}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithPrependText: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={false} disabled={false} prependText="Category:">
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithLeftDecorationAndPrependText: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="single" error={false} disabled={false} leftDecoration={<User className="w-4 h-4" />} prependText="Category:">
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const StackedWithLabel: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger size="regular" layout="stacked" label="Contact Method" error={false} disabled={false}>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="email" leftDecoration={<Mail className="w-4 h-4" />}>Email</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="settings" leftDecoration={<Settings className="w-4 h-4" />}>Settings</SelectItem>
        </SelectContent>
      </>
    ),
  },
};
