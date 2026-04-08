import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogHeader } from './DialogHeader';

const meta: Meta<typeof DialogHeader> = {
  component: DialogHeader,
  title: 'Obra/DialogHeader',
  tags: ['autodocs', 'design-system'],
  decorators: [
    (Story) => (
      <RadixDialog.Root open>
        <RadixDialog.Portal>
          <Story />
        </RadixDialog.Portal>
      </RadixDialog.Root>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22344&m=dev',
    },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DialogHeader>;

export const Header: Story = {
  args: {
    type: 'Header',
    title: 'Dialog Title',
  },
};

export const CloseOnly: Story = {
  args: {
    type: 'Close Only',
  },
};

export const IconButtonClose: Story = {
  args: {
    type: 'Icon Button Close',
  },
};

export const LongTitle: Story = {
  args: {
    type: 'Header',
    title: 'This is a longer title that demonstrates how the header handles extended text content',
  },
};
