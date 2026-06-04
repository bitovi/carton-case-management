import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const bodyContent = (
  <div className="space-y-2">
    <p className="text-sm text-muted-foreground">
      This is the popover body content. It can contain any elements.
    </p>
  </div>
);

const menuContent = (
  <div className="flex flex-col">
    <button className="px-2 py-1.5 text-sm text-left rounded hover:bg-slate-100">Option 1</button>
    <button className="px-2 py-1.5 text-sm text-left rounded hover:bg-slate-100">Option 2</button>
    <button className="px-2 py-1.5 text-sm text-left rounded hover:bg-slate-100">Option 3</button>
  </div>
);

export const StateClosed: Story = {
  render: () => (
    <Popover open={false}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>{bodyContent}</PopoverContent>
    </Popover>
  ),
};

export const StateOpenContentDefaultHeaderWithout: Story = {
  render: () => (
    <Popover open={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>{bodyContent}</PopoverContent>
    </Popover>
  ),
};

export const StateOpenContentDefaultHeaderWithTitle: Story = {
  render: () => (
    <Popover open={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent headerTitle="Popover Title">{bodyContent}</PopoverContent>
    </Popover>
  ),
};

export const StateOpenContentDefaultHeaderWithTitleAndDescription: Story = {
  render: () => (
    <Popover open={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent
        headerTitle="Popover Title"
        headerDescription="A short description providing additional context."
      >
        {bodyContent}
      </PopoverContent>
    </Popover>
  ),
};

export const StateOpenContentMenuHeaderWithout: Story = {
  render: () => (
    <Popover open={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent content="Menu">{menuContent}</PopoverContent>
    </Popover>
  ),
};
