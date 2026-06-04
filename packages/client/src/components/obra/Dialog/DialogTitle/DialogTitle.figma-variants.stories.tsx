import type { Meta, StoryObj } from '@storybook/react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogTitle } from './DialogTitle';

const meta = {
  title: 'Figma Variants/DialogTitle',
  component: DialogTitle,
  decorators: [
    (Story) => (
      <RadixDialog.Root open>
        <RadixDialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-4 shadow-lg rounded-lg">
          <Story />
        </RadixDialog.Content>
      </RadixDialog.Root>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DialogTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantDefault: Story = {
  args: {
    children: 'Dialog Title',
  },
};
