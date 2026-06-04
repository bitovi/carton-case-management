import type { Meta, StoryObj } from '@storybook/react';
import { DialogFooter } from './DialogFooter';
import { Button } from '../../Button';

const meta = {
  title: 'Figma Variants/DialogFooter',
  component: DialogFooter,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DialogFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Type2ButtonsRight: Story = {
  args: {
    type: '2 Buttons Right',
    children: (
      <>
        <Button variant="outline">Label</Button>
        <Button variant="primary">Label</Button>
      </>
    ),
  },
};

export const Type2FullWidthButtons: Story = {
  args: {
    type: '2 Full-width Buttons',
    children: (
      <>
        <Button variant="outline" className="flex-1">Label</Button>
        <Button variant="primary" className="flex-1">Label</Button>
      </>
    ),
  },
};

export const TypeSingleFullWidthButton: Story = {
  args: {
    type: 'Single Full-width Button',
    children: <Button variant="primary" className="w-full">Label</Button>,
  },
};
