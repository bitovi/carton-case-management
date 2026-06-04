import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectContent',
  component: SelectContent,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectContent>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SelectContentPreviewProps {
  spacing?: 'none' | '2px' | '8px' | '16px' | '24px';
  children?: ReactNode;
}

function SelectContentPreview({
  spacing = 'none',
  children = (
    <>
      <SelectItem value="item-1">Item 1</SelectItem>
      <SelectItem value="item-2">Item 2</SelectItem>
      <SelectItem value="item-3">Item 3</SelectItem>
    </>
  ),
}: SelectContentPreviewProps) {
  return (
    <div className="w-[280px] p-6">
      <Select defaultOpen defaultValue="item-2">
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent spacing={spacing}>{children}</SelectContent>
      </Select>
    </div>
  );
}

export const SpacingNone: Story = {
  render: () => <SelectContentPreview spacing="none" />,
};

export const Spacing2px: Story = {
  render: () => <SelectContentPreview spacing="2px" />,
};

export const Spacing8px: Story = {
  render: () => <SelectContentPreview spacing="8px" />,
};

export const Spacing16px: Story = {
  render: () => <SelectContentPreview spacing="16px" />,
};

export const Spacing24px: Story = {
  render: () => <SelectContentPreview spacing="24px" />,
};