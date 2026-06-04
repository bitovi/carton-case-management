import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader/DialogHeader';
import { DialogFooter } from './DialogFooter/DialogFooter';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const SimpleContent = () => (
  <div className="p-6 space-y-3">
    <h3 className="text-lg font-semibold">Dialog Content</h3>
    <p className="text-sm text-muted-foreground">
      This is the main content area of the dialog.
    </p>
  </div>
);

const ScrollableContent = () => (
  <div className="p-4 space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <p key={i} className="text-sm">
        Content line {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    ))}
  </div>
);

const HeaderContent = () => (
  <DialogHeader
    type="Header"
    title="Dialog Header"
    onClose={() => {}}
  />
);

const FooterContent = () => (
  <DialogFooter type="2 Buttons Right">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Confirm</Button>
  </DialogFooter>
);

export const TypeDesktop: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    type: 'Desktop',
    children: <SimpleContent />,
  },
};

export const TypeDesktopScrollable: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    type: 'Desktop Scrollable',
    header: <HeaderContent />,
    footer: <FooterContent />,
    children: <ScrollableContent />,
  },
};

export const TypeMobile: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    type: 'Mobile',
    children: <SimpleContent />,
  },
};

export const TypeMobileFullScreenScrollable: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    type: 'Mobile Full Screen Scrollable',
    header: <HeaderContent />,
    footer: <FooterContent />,
    children: <ScrollableContent />,
  },
};
