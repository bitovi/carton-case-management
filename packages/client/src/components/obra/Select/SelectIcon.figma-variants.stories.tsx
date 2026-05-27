import type { Meta, StoryObj } from '@storybook/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SelectIcon = SelectPrimitive.Icon;

const meta = {
  title: 'Figma Variants/SelectIcon',
  component: SelectIcon,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SelectIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateDefault: Story = {
  render: () => (
    <SelectIcon className="shrink-0">
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </SelectIcon>
  ),
};

export const IconChevronUp: Story = {
  render: () => (
    <SelectIcon className="shrink-0">
      <ChevronUp className="w-4 h-4 text-muted-foreground" />
    </SelectIcon>
  ),
};
