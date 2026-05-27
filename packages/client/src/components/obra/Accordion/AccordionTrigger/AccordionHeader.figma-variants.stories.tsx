import type { Meta, StoryObj } from '@storybook/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { AccordionTrigger } from './AccordionTrigger';

const meta: Meta<typeof AccordionTrigger> = {
  title: 'Figma Variants/AccordionHeader',
  component: AccordionTrigger,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={args.defaultValue}
      className="w-[480px]"
    >
      <AccordionPrimitive.Item value="item-1">
        <AccordionTrigger>{args.children || 'Section Title'}</AccordionTrigger>
        <AccordionPrimitive.Content className="p-4">
          Content placeholder
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenClosedInteractionDefault: Story = {
  args: {
    children: 'Section Title',
    defaultValue: undefined,
  },
};

export const OpenOpenInteractionDefault: Story = {
  args: {
    children: 'Section Title',
    defaultValue: 'item-1',
  },
};

export const OpenClosedInteractionFocus: Story = {
  args: {
    children: 'Section Title',
    defaultValue: undefined,
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  },
};

export const OpenOpenInteractionFocus: Story = {
  args: {
    children: 'Section Title',
    defaultValue: 'item-1',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  },
};
