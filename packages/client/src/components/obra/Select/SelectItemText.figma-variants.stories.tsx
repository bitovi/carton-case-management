import type { Meta, StoryObj } from '@storybook/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';

type SelectItemTextProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemText>;

function SelectItemTextPreview({ children = 'Select item', className, ...props }: SelectItemTextProps) {
  return (
    <Select open defaultValue="item1">
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">
          <SelectPrimitive.ItemText className={className ?? 'truncate'} {...props}>
            {children}
          </SelectPrimitive.ItemText>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

const meta = {
  title: 'Figma Variants/SelectItemText',
  component: SelectItemTextPreview,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SelectItemTextPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Select item',
  },
};

export const LabelToDo: Story = {
  args: {
    children: 'To Do',
  },
};

export const LabelInProgress: Story = {
  args: {
    children: 'In Progress',
  },
};

export const LabelVeryLongOptionLabelThatTruncates: Story = {
  args: {
    children: 'A very long option label that truncates',
  },
};