import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DialogHeader } from './DialogHeader';

const meta: Meta<typeof DialogHeader> = {
  component: DialogHeader,
  title: 'Obra/DialogHeader',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22345&m=dev',
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Header title - when provided shows title with close button, when omitted shows only close button',
    },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DialogHeader>;

export const WithTitle: Story = {
  args: {
    title: 'Sheet Title',
  },
};

export const CloseOnly: Story = {
  args: {
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a longer title that demonstrates how the header handles extended text content',
  },
};
