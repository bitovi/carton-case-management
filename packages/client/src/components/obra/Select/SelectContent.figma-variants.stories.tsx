import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectContent',
  component: SelectContent,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SelectContent>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SelectContentPreviewProps {
  spacing?: 'none' | '2px' | '8px' | '16px' | '24px';
  children: ReactNode;
}

function SelectContentPreview({ spacing = 'none', children }: SelectContentPreviewProps) {
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

const defaultOptions = (
  <>
    <SelectItem value="item-1">Item 1</SelectItem>
    <SelectItem value="item-2">Item 2</SelectItem>
    <SelectItem value="item-3">Item 3</SelectItem>
  </>
);

export const SpacingNone: Story = {
  render: () => <SelectContentPreview spacing="none">{defaultOptions}</SelectContentPreview>,
};

export const Spacing2Px: Story = {
  render: () => <SelectContentPreview spacing="2px">{defaultOptions}</SelectContentPreview>,
};

export const Spacing8Px: Story = {
  render: () => <SelectContentPreview spacing="8px">{defaultOptions}</SelectContentPreview>,
};

export const Spacing16Px: Story = {
  render: () => <SelectContentPreview spacing="16px">{defaultOptions}</SelectContentPreview>,
};

export const Spacing24Px: Story = {
  render: () => <SelectContentPreview spacing="24px">{defaultOptions}</SelectContentPreview>,
};

export const SpacingNoneChildrenCustomOptionList: Story = {
  render: () => (
    <SelectContentPreview spacing="none">
      <SelectGroup>
        <SelectLabel size="small">Popular</SelectLabel>
        <SelectItem value="design-system">Design System</SelectItem>
        <SelectItem value="typography">Typography</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel size="small">Settings</SelectLabel>
        <SelectItem value="notifications">Notifications</SelectItem>
        <SelectItem value="security">Security</SelectItem>
      </SelectGroup>
    </SelectContentPreview>
  ),
};