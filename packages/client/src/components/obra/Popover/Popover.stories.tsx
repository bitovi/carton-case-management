import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { calendarIcon } from '@progress/kendo-svg-icons';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Obra/Popover',
  argTypes: {
    modal: {
      control: 'boolean',
      description: 'Whether clicking outside closes the popover',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A popover displays rich content in a floating container anchored to a trigger element.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2322-135488',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

function InteractivePopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SvgIcon icon={calendarIcon} size="small" />
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        headerTitle="Popover Content"
        headerDescription="This is a popover with some example content. It can contain any React components."
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="small" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button size="small" variant="outline">
              Action
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: () => <InteractivePopover />,
};

export const WithCustomAlignment: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align Start</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64"
        headerTitle="Aligned to start"
        headerDescription="This popover is aligned to the start of the trigger element."
      >
        <div>
          <p className="text-sm">Additional content can go here.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const DifferentSides: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="small">
            Top
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Top side</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="small">
            Right
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Right side</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="small">
            Bottom
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Bottom side</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="small">
            Left
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Left side</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const MenuVariant: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Menu Style</Button>
      </PopoverTrigger>
      <PopoverContent content="Menu" className="w-auto">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="small"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal"
          >
            Option 1
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal"
          >
            Option 2
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal"
          >
            Option 3
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'The Menu variant uses 8px padding instead of the default 16px, optimized for menu-style content.',
      },
    },
  },
};

export const WithHeader: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings Panel</Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        headerTitle="Dimensions"
        headerDescription="Set the dimensions for the layer."
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Width</label>
              <input
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
                placeholder="100%"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Height</label>
              <input
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
                placeholder="25px"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="small" variant="primary">
              Apply
            </Button>
            <Button size="small" variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Popover with header containing title and description. Headers are automatically shown for non-Menu variants.',
      },
    },
  },
};
