import type { Meta, StoryObj } from '@storybook/react';
import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectItemIndicator',
  component: SelectItemIndicator,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectItemIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

function IndicatorPreview() {
  return (
    <div className="w-[320px] p-6">
      <Select open value="selected-item" onValueChange={() => undefined}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="selected-item">
            Selected Item
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export const ChildrenCheckIcon: Story = {
  render: () => <IndicatorPreview />,
};
