import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'Figma Variants/Label',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9453&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * Layout: inline (default)
 * - Displays as inline-flex
 * - Allows inline text flow wrapping
 * - Respects surrounding text content
 */
export const LayoutInline: Story = {
  args: {
    layout: 'inline',
    children: 'Label',
  },
};

/**
 * Layout: block
 * - Displays as block element
 * - Full width behavior
 * - Starts new line, typical for form labels
 */
export const LayoutBlock: Story = {
  args: {
    layout: 'block',
    children: 'Label',
  },
};
