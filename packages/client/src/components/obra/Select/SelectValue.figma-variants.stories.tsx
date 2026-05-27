import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';

const meta = {
  title: 'Figma Variants/SelectValue',
  component: SelectValue,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SelectValue>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectValueWrapper({ 
  showPlaceholder = true, 
  value = undefined,
  children = undefined,
}: any) {
  const [selectedValue, setSelectedValue] = useState(value || '');
  
  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger>
        <SelectValue placeholder={showPlaceholder ? 'Select an item' : undefined}>
          {children}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
        <SelectItem value="item3">Item 3</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const StateEmpty: Story = {
  render: (args) => <SelectValueWrapper {...args} />,
  args: {
    showPlaceholder: true,
    value: '',
    children: undefined,
  },
};

export const StateSelected: Story = {
  render: (args) => <SelectValueWrapper {...args} />,
  args: {
    showPlaceholder: false,
    value: 'item1',
    children: 'Item 1',
  },
};

export const StateCustom: Story = {
  render: (args) => <SelectValueWrapper {...args} />,
  args: {
    showPlaceholder: false,
    value: '',
    children: 'Custom Content',
  },
};
