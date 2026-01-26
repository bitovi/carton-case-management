import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sheet } from './sheet';
import { Button } from '../obra/Button';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: function Default() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="space-y-2">
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            ℹ️ <strong>Note:</strong> This component only renders on screens{' '}
            <strong>&lt; 1024px width (lg breakpoint)</strong>. Resize your browser window to see
            it.
          </div>
          <Button onClick={() => setOpen(true)}>Open Sheet</Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Sheet Content</h2>
            <p>This is a bottom sheet that slides up from the bottom of the screen.</p>
            <p className="mt-2 text-sm text-gray-600">Only visible on mobile/tablet viewports.</p>
          </div>
        </Sheet>
      </>
    );
  },
};

export const WithForm: Story = {
  render: function WithForm() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="space-y-2">
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            ℹ️ <strong>Note:</strong> This component only renders on screens{' '}
            <strong>&lt; 1024px width (lg breakpoint)</strong>. Resize your browser window to see
            it.
          </div>
          <Button onClick={() => setOpen(true)}>Edit Profile</Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                placeholder="john@example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Sheet>
      </>
    );
  },
};

export const WithLongContent: Story = {
  render: function WithLongContent() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="space-y-2">
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            ℹ️ <strong>Note:</strong> This component only renders on screens{' '}
            <strong>&lt; 1024px width (lg breakpoint)</strong>. Resize your browser window to see
            it.
          </div>
          <Button onClick={() => setOpen(true)}>Show More Info</Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Terms and Conditions</h2>
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </Sheet>
      </>
    );
  },
};
