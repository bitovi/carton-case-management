import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectPreview({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="w-[280px] p-6">
      <Select disabled={disabled} defaultValue="item-2">
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item-1">Item 1</SelectItem>
          <SelectItem value="item-2">Item 2</SelectItem>
          <SelectItem value="item-3">Item 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export const StateDefault: Story = {
  render: () => <SelectPreview disabled={false} />,
};

export const StateDisabled: Story = {
  render: () => <SelectPreview disabled={true} />,
};
