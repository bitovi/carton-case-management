import type { Meta, StoryObj } from '@storybook/react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogHeader } from './DialogHeader';
import type { DialogHeaderProps } from './types';

const DialogHeaderWrapper = (props: DialogHeaderProps) => (
  <RadixDialog.Root open={true}>
    <RadixDialog.Content className="bg-background border border-border rounded-xl w-[640px]">
      <DialogHeader {...props} />
    </RadixDialog.Content>
  </RadixDialog.Root>
);

const meta = {
  title: 'Figma Variants/DialogHeader',
  component: DialogHeader,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  render: (args) => <DialogHeaderWrapper {...args} />,
} as Meta<typeof DialogHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeHeaderDescriptionNone: Story = {
  args: {
    type: 'Header',
    title: 'Dialog Title',
    onClose: () => {},
  },
};

export const TypeHeaderWithDescription: Story = {
  args: {
    type: 'Header',
    title: 'Dialog Title',
    description: 'This is a dialog description',
    onClose: () => {},
  },
};

export const TypeCloseOnly: Story = {
  args: {
    type: 'Close Only',
    onClose: () => {},
  },
};

export const TypeIconButtonClose: Story = {
  args: {
    type: 'Icon Button Close',
    onClose: () => {},
  },
};
