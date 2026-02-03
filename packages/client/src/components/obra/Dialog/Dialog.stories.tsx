import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader/DialogHeader';
import { DialogFooter } from './DialogFooter/DialogFooter';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Obra/Dialog',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=151-12298&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Desktop: Story = {
  args: {
    type: 'Desktop',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Desktop Dialog</h3>
        <p className="text-sm text-muted-foreground">
          This is a standard desktop dialog with a close button.
        </p>
      </div>
    ),
  },
};

export const DesktopScrollable: Story = {
  args: {
    type: 'Desktop Scrollable',
    header: (
      <DialogHeader 
        type="Header"
        title="Scrollable Dialog" 
        onClose={() => console.log('Close clicked')} 
      />
    ),
    footer: (
      <DialogFooter type="2 Buttons Right">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-6 space-y-4">
        <p className="text-sm">
          This is a desktop scrollable dialog with header and footer.
        </p>
        <p className="text-sm text-muted-foreground">
          Content can scroll while header and footer remain fixed.
        </p>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} className="text-sm">
              Scrollable content line {i + 1}
            </p>
          ))}
        </div>
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: {
    type: 'Mobile',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-4">
        <h3 className="text-base font-semibold mb-2">Mobile Dialog</h3>
        <p className="text-xs text-muted-foreground">
          Compact mobile dialog.
        </p>
      </div>
    ),
  },
};

export const MobileFullScreenScrollable: Story = {
  args: {
    type: 'Mobile Full Screen Scrollable',
    header: (
      <DialogHeader 
        type="Close Only"
        onClose={() => console.log('Close clicked')} 
      />
    ),
    footer: (
      <DialogFooter type="Single Full-width Button">
        <Button className="w-full">Action</Button>
      </DialogFooter>
    ),
    children: (
      <div className="p-4 space-y-4">
        <p className="text-sm">
          Full screen mobile dialog with scrolling content.
        </p>
        <div className="space-y-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <p key={i} className="text-sm">
              Content line {i + 1}
            </p>
          ))}
        </div>
      </div>
    ),
  },
};

export const WithCustomContent: Story = {
  args: {
    type: 'Desktop',
    onClose: () => console.log('Close clicked'),
    children: (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Custom Content</h2>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input 
              type="text" 
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Enter email"
            />
          </div>
        </form>
      </div>
    ),
  },
};
