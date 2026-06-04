import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Figma Variants/Card',
  component: Card,
  decorators: [],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const HeaderContent = () => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">Card Header</h3>
    <span className="text-sm text-muted-foreground">Optional badge</span>
  </div>
);

const MainContent = () => (
  <div className="space-y-2">
    <p className="text-sm">This is the main content area of the card.</p>
    <p className="text-sm text-muted-foreground">
      It can contain any React components or content.
    </p>
  </div>
);

const FooterContent = () => (
  <div className="flex items-center justify-end gap-2">
    <button className="rounded bg-secondary px-4 py-2 text-sm font-medium">
      Cancel
    </button>
    <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
      Save
    </button>
  </div>
);

export const MainOnly: Story = {
  args: {
    main: <MainContent />,
  },
};

export const HeaderAndMain: Story = {
  args: {
    header: <HeaderContent />,
    main: <MainContent />,
  },
};

export const MainAndFooter: Story = {
  args: {
    main: <MainContent />,
    footer: <FooterContent />,
  },
};

export const AllSlots: Story = {
  args: {
    header: <HeaderContent />,
    main: <MainContent />,
    footer: <FooterContent />,
  },
};
