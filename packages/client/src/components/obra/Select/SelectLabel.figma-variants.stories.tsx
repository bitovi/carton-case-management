import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectLabel',
  component: SelectLabel,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectLabelPreview({ size = 'small', indented = false }: { size?: 'small' | 'regular'; indented?: boolean }) {
  return (
    <div className="w-[280px] p-6">
      <Select defaultOpen>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel size={size} indented={indented}>
              Label
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export const SizeSmallIndentedFalse: Story = {
  render: () => <SelectLabelPreview size="small" indented={false} />,
};

export const SizeRegularIndentedFalse: Story = {
  render: () => <SelectLabelPreview size="regular" indented={false} />,
};

export const SizeSmallIndentedTrue: Story = {
  render: () => <SelectLabelPreview size="small" indented={true} />,
};

export const SizeRegularIndentedTrue: Story = {
  render: () => <SelectLabelPreview size="regular" indented={true} />,
};
