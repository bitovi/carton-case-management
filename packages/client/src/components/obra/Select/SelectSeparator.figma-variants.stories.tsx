import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectSeparator',
  component: SelectSeparator,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseDefault: Story = {
  render: () => (
    <Select open value="item-1">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item-1">Option One</SelectItem>
        <SelectSeparator />
        <SelectItem value="item-2">Option Two</SelectItem>
      </SelectContent>
    </Select>
  ),
};