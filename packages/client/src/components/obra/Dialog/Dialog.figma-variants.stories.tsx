import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader/DialogHeader';
import { DialogFooter } from './DialogFooter/DialogFooter';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Figma Variants/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
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

export const TypeDesktopStateOpen: Story = {
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

export const TypeDesktopScrollableStateOpen: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    header: <DialogHeader type="Header" title="Dialog Title" onClose={() => {}} />,
    footer: (
      <DialogFooter type="2 Buttons Right">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-6">
        <p className="text-sm">Dialog content</p>
      </div>
    ),
  },
};

export const TypeMobileStateOpen: Story = {
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

export const TypeMobileFullScreenScrollableStateOpen: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Mobile Full Screen Scrollable',
    header: <DialogHeader type="Close Only" onClose={() => {}} />,
    footer: (
      <DialogFooter type="Single Full-width Button">
        <Button className="w-full">Action</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-4">
        <p className="text-sm">Dialog content</p>
      </div>
    ),
  },
};

export const DesktopScrollableWithHeaderContent: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop Scrollable',
    header: <DialogHeader type="Header" title="Header Content" onClose={() => {}} />,
    children: (
      <div className="p-6">
        <p className="text-sm">Content area</p>
      </div>
    ),
  },
};

export const DesktopScrollableWithFooterContent: Story = {
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

export const DesktopScrollableWithHeaderAndFooter: Story = {
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
        <p className="text-sm">Content area with header and footer</p>
      </div>
    ),
  },
};

export const MobileFullScreenScrollableWithHeaderAndFooter: Story = {
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

export const WithRichDialogContent: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    type: 'Desktop',
    children: (
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Dialog Title</h3>
        <p className="text-sm text-muted-foreground">
          This is rich content inside the dialog.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Items:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className="text-sm">Item one</li>
            <li className="text-sm">Item two</li>
            <li className="text-sm">Item three</li>
          </ul>
        </div>
      </div>
    ),
  },
};
