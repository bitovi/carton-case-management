import type { Meta, StoryObj } from '@storybook/react';
import { DialogFooter } from './DialogFooter';
import { Button } from '../../Button';

const meta: Meta<typeof DialogFooter> = {
  component: DialogFooter,
  title: 'Obra/DialogFooter',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DialogFooter>;

export const TwoButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </>
    ),
  },
};

export const SingleButton: Story = {
  args: {
    children: <Button variant="primary">Got it</Button>,
  },
};

export const DestructiveAction: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete Item</Button>
      </>
    ),
  },
};
