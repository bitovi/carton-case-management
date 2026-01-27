import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'Obra/Textarea',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1745&m=dev',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

export const Error: Story = {
  args: {
    defaultValue: 'Value',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Value',
    disabled: true,
  },
};

export const Resizable: Story = {
  args: {
    placeholder: 'This textarea can be resized vertically',
    showResizable: true,
  },
};

export const NonResizable: Story = {
  args: {
    placeholder: 'This textarea cannot be resized',
    showResizable: false,
  },
};

