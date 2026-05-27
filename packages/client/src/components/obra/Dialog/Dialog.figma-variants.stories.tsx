import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader/DialogHeader';
import { DialogFooter } from './DialogFooter/DialogFooter';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const DialogWrapper = ({ children, ...props }: Omit<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      {children}
    </Dialog>
  );
};

export const TypeDesktop: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop',
    children: (
      <div className="p-6">
        <p className="text-sm">Dialog content</p>
      </div>
    ),
  },
};

export const TypeDesktopScrollable: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    children: (
      <div className="p-6">
        <p className="text-sm">Dialog content</p>
      </div>
    ),
  },
};

export const TypeMobile: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Mobile',
    children: (
      <div className="p-4">
        <p className="text-xs">Dialog content</p>
      </div>
    ),
  },
};

export const TypeMobileFullScreenScrollable: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Mobile Full Screen Scrollable',
    children: (
      <div className="p-4">
        <p className="text-sm">Dialog content</p>
      </div>
    ),
  },
};

export const TypeDesktopScrollableWithHeader: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    header: <DialogHeader type="Header" title="Dialog Title" onClose={() => {}} />,
    children: (
      <div className="p-6">
        <p className="text-sm">Content area</p>
      </div>
    ),
  },
};

export const TypeDesktopScrollableWithFooter: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    footer: (
      <DialogFooter type="2 Buttons Right">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-6">
        <p className="text-sm">Content area</p>
      </div>
    ),
  },
};

export const TypeDesktopScrollableWithHeaderFooter: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    header: <DialogHeader type="Header" title="Full Dialog" onClose={() => {}} />,
    footer: (
      <DialogFooter type="2 Buttons Right">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-6">
        <p className="text-sm">Content area</p>
      </div>
    ),
  },
};

export const TypeMobileFullScreenScrollableWithHeaderFooter: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Mobile Full Screen Scrollable',
    header: <DialogHeader type="Header" title="Mobile Full Screen" onClose={() => {}} />,
    footer: (
      <DialogFooter type="Single Full-width Button">
        <Button className="w-full">Action</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-4">
        <p className="text-sm">Content area</p>
      </div>
    ),
  },
};
