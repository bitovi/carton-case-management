import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';
import { DialogHeader } from '../Dialog/DialogHeader';
import { DialogFooter } from '../Dialog/DialogFooter';
import { Button } from '../Button';

const meta = {
  title: 'Figma Variants/Sheet',
  component: Sheet,
  decorators: [],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Content components for consistent story rendering
const DefaultContent = () => (
  <div className="space-y-4">
    <p>Sheet content area</p>
    <p className="text-sm text-muted-foreground">
      This demonstrates the sheet panel rendering.
    </p>
  </div>
);

const FormContent = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <input
        type="email"
        className="w-full rounded-lg border border-border bg-background px-3 py-2"
        placeholder="email@example.com"
        defaultValue="user@example.com"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Username</label>
      <input
        type="text"
        className="w-full rounded-lg border border-border bg-background px-3 py-2"
        placeholder="username"
        defaultValue="johndoe"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Description</label>
      <textarea
        className="w-full rounded-lg border border-border bg-background px-3 py-2"
        placeholder="Enter description"
        defaultValue="This is a sample description for the sheet content."
        rows={4}
      />
    </div>
  </div>
);

// Dependent axis: State + Scrollable combinations

export const StateClosed: Story = {
  args: {
    open: false,
    scrollable: true,
    children: <DefaultContent />,
  },
};

export const StateOpen: Story = {
  args: {
    open: true,
    scrollable: true,
    children: <DefaultContent />,
  },
};

export const StateOpenScrollableFalse: Story = {
  args: {
    open: true,
    scrollable: false,
    children: <DefaultContent />,
  },
};

// Independent axis: Header slot (at default dependent values: state=open, scrollable=true)

export const StateOpenWithHeader: Story = {
  args: {
    open: true,
    scrollable: true,
    header: (
      <DialogHeader
        title="Edit Settings"
        onClose={() => {}}
      />
    ),
    children: <DefaultContent />,
  },
};

// Independent axis: Footer slot

export const StateOpenWithFooter: Story = {
  args: {
    open: true,
    scrollable: true,
    children: <DefaultContent />,
    footer: (
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </DialogFooter>
    ),
  },
};

// Independent axis: Header + Footer combined

export const StateOpenWithHeaderAndFooter: Story = {
  args: {
    open: true,
    scrollable: true,
    header: (
      <DialogHeader
        title="Create New Item"
        onClose={() => {}}
      />
    ),
    children: <FormContent />,
    footer: (
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Create</Button>
      </DialogFooter>
    ),
  },
};


