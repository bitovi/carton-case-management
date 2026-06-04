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
} as Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderContent = () => (
  <div className="space-y-4">
    <p>Sheet content area</p>
    <p className="text-sm text-muted-foreground">
      This demonstrates the sheet panel rendering with placeholder content.
    </p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
);

const LongContent = () => (
  <div className="space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i}>Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    ))}
  </div>
);

export const ScrollableTrue: Story = {
  args: {
    open: true,
    scrollable: true,
    children: <LongContent />,
  },
};

export const ScrollableFalse: Story = {
  args: {
    open: true,
    scrollable: false,
    children: <PlaceholderContent />,
  },
};

export const WithHeader: Story = {
  args: {
    open: true,
    scrollable: true,
    header: (
      <DialogHeader
        title="Sheet Title"
        onClose={() => {}}
      />
    ),
    children: <PlaceholderContent />,
  },
};

export const WithFooter: Story = {
  args: {
    open: true,
    scrollable: true,
    children: <PlaceholderContent />,
    footer: (
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </DialogFooter>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    open: true,
    scrollable: true,
    header: (
      <DialogHeader
        title="Edit Settings"
        onClose={() => {}}
      />
    ),
    children: <PlaceholderContent />,
    footer: (
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </DialogFooter>
    ),
  },
};

