import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Obra/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

/**
 * A basic popover with simple content.
 */
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>This is the popover content.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover with a form inside.
 */
export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Update dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Controlled popover with explicit close button.
 */
export const Controlled: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {open ? 'Close' : 'Open'} Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-4">
              <p>This popover is controlled.</p>
              <PopoverClose asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Close
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-sm text-muted-foreground">
          State: {open ? 'Open' : 'Closed'}
        </span>
      </div>
    );
  },
};

/**
 * Popover positioned to the top.
 */
export const Top: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Top</Button>
      </PopoverTrigger>
      <PopoverContent side="top">
        <p>This popover appears above the trigger.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover positioned to the right.
 */
export const Right: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Right</Button>
      </PopoverTrigger>
      <PopoverContent side="right">
        <p>This popover appears to the right.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover positioned to the left.
 */
export const Left: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Left</Button>
      </PopoverTrigger>
      <PopoverContent side="left">
        <p>This popover appears to the left.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover aligned to the start of the trigger.
 */
export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align Start</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p>This popover is aligned to the start.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover aligned to the end of the trigger.
 */
export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align End</Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p>This popover is aligned to the end.</p>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover with custom width.
 */
export const CustomWidth: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Wide Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-2">
          <h4 className="font-medium">Extended Content</h4>
          <p className="text-sm text-muted-foreground">
            This popover has a custom width of 24rem (384px) to accommodate more
            content. You can customize the width using Tailwind classes.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover without padding for custom layouts.
 */
export const NoPadding: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">No Padding</Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="divide-y">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
            Option 1
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
            Option 2
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
            Option 3
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
