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

export const ThreeButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </>
    ),
  },
};

export const WithCustomContent: Story = {
  render: () => (
    <DialogFooter>
      <div className="flex items-center justify-between w-full">
        <p className="text-sm text-muted-foreground">Last saved: 2 min ago</p>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
    </DialogFooter>
  ),
};
