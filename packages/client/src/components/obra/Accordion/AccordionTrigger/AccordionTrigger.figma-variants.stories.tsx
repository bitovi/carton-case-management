import type { Meta, StoryObj } from '@storybook/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { AccordionTrigger } from './AccordionTrigger';

const meta: Meta<typeof AccordionTrigger> = {
  title: 'Figma Variants/AccordionTrigger',
  component: AccordionTrigger,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={args.defaultValue || 'item-1'}
      className="w-[480px]"
    >
      <AccordionPrimitive.Item value="item-1">
        <AccordionTrigger>{args.children || 'Section Label'}</AccordionTrigger>
        <AccordionPrimitive.Content className="p-4">
          Content placeholder
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

// State=Closed, Interactive=Default
export const StateClosedInteractiveDefault: Story = {
  args: {
    children: 'Section Label',
    defaultValue: undefined, // Accordion starts with no item open
  },
};

// State=Closed, Interactive=Hover
export const StateClosedInteractiveHover: Story = {
  args: {
    children: 'Section Label',
    defaultValue: undefined,
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-state="closed"]') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

// State=Closed, Interactive=Focus
export const StateClosedInteractiveFocus: Story = {
  args: {
    children: 'Section Label',
    defaultValue: undefined,
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  },
};

// State=Closed, Interactive=Disabled
export const StateClosedInteractiveDisabled: Story = {
  args: {
    children: 'Section Label',
    defaultValue: undefined,
  },
  render: (args) => (
    <AccordionPrimitive.Root type="single" collapsible disabled className="w-[480px]">
      <AccordionPrimitive.Item value="item-1">
        <AccordionTrigger>{args.children || 'Section Label'}</AccordionTrigger>
        <AccordionPrimitive.Content className="p-4">
          Content placeholder
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
};

// State=Open, Interactive=Default
export const StateOpenInteractiveDefault: Story = {
  args: {
    children: 'Section Label',
    defaultValue: 'item-1', // Accordion starts with item-1 open
  },
};

// State=Open, Interactive=Hover
export const StateOpenInteractiveHover: Story = {
  args: {
    children: 'Section Label',
    defaultValue: 'item-1',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-state="open"]') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

// State=Open, Interactive=Focus
export const StateOpenInteractiveFocus: Story = {
  args: {
    children: 'Section Label',
    defaultValue: 'item-1',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  },
};

// State=Open, Interactive=Disabled
export const StateOpenInteractiveDisabled: Story = {
  args: {
    children: 'Section Label',
    defaultValue: 'item-1',
  },
  render: (args) => (
    <AccordionPrimitive.Root type="single" collapsible disabled defaultValue="item-1" className="w-[480px]">
      <AccordionPrimitive.Item value="item-1">
        <AccordionTrigger>{args.children || 'Section Label'}</AccordionTrigger>
        <AccordionPrimitive.Content className="p-4">
          Content placeholder
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
};
