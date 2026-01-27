import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { Sheet } from './Sheet';
import type { SheetProps } from './types';
import { DialogHeader } from '../Dialog/DialogHeader';
import { DialogFooter } from '../Dialog/DialogFooter';
import { Button } from '../Button';
import { Label } from '../Label';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  title: 'Obra/Sheet',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

function SheetWrapper({ children, ...props }: { children: ReactNode } & Omit<SheetProps, 'open' | 'onOpenChange'>) {
  const [open, setOpen] = useState(true);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet {...props} open={open} onOpenChange={setOpen}>
        {children}
      </Sheet>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <SheetWrapper
      header={
        <DialogHeader 
          title="Sheet Title"
          onClose={() => {}}
        />
      }
    >
      <div className="space-y-4">
        <p>This is the default sheet with scrollable content.</p>
        <p>Add your content here.</p>
      </div>
    </SheetWrapper>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <SheetWrapper
      header={
        <DialogHeader 
          title="Edit Settings"
          onClose={() => {}}
        />
      }
      footer={
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </DialogFooter>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Email</Label>
          <input 
            type="email" 
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <input 
            type="text" 
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="username"
          />
        </div>
      </div>
    </SheetWrapper>
  ),
};

export const WithForm: Story = {
  render: () => (
    <SheetWrapper
      header={
        <DialogHeader 
          title="Create New Item"
          onClose={() => {}}
        />
      }
      footer={
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Create</Button>
        </DialogFooter>
      }
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <input 
            type="text" 
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Item name"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea 
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            rows={4}
            placeholder="Item description"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2">
            <option>Select a category</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      </form>
    </SheetWrapper>
  ),
};
