import type { Meta, StoryObj } from '@storybook/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { AccordionTrigger } from './AccordionTrigger';

const meta = {
  title: 'Figma Variants/AccordionTrigger',
  component: AccordionTrigger,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  render: (args) => (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={args.defaultValue}
      className="w-[480px]"
    >
      <AccordionPrimitive.Item value="item-1">
        <AccordionTrigger>{args.children || 'Trigger Label'}</AccordionTrigger>
        <AccordionPrimitive.Content className="p-4">
          Content placeholder
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
} satisfies Meta<typeof AccordionTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateClosed: Story = {
  args: {
    children: 'Trigger Label',
    defaultValue: undefined,
  },
};

export const StateOpen: Story = {
  args: {
    children: 'Trigger Label',
    defaultValue: 'item-1',
  },
};

export const WithFocusRing: Story = {
  args: {
    children: 'Trigger Label',
    defaultValue: undefined,
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
  },
};
