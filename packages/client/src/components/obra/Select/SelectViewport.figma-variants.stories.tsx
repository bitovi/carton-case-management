import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectViewport } from './Select';

const meta = {
  title: 'Figma Variants/SelectViewport',
  component: SelectViewport,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectViewport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="item1">
      <SelectTrigger>
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectViewport>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
          <SelectItem value="item4">Item 4</SelectItem>
          <SelectItem value="item5">Item 5</SelectItem>
        </SelectViewport>
      </SelectContent>
    </Select>
  ),
};
