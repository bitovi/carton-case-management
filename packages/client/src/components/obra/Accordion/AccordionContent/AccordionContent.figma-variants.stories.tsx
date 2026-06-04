import type { Meta, StoryObj } from '@storybook/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { AccordionTrigger } from '../AccordionTrigger';
import { AccordionContent } from './AccordionContent';

const meta = {
  title: 'Figma Variants/AccordionContent',
  component: AccordionContent,
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
        <AccordionTrigger>Section Title</AccordionTrigger>
        <AccordionContent>{args.children}</AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  ),
} as Meta<typeof AccordionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateOpen: Story = {
  args: {
    defaultValue: 'item-1',
    children: 'This is sample accordion content.',
  },
};

export const StateClosed: Story = {
  args: {
    defaultValue: undefined,
    children: 'This is sample accordion content.',
  },
};

export const StateOpenWithLongContent: Story = {
  args: {
    defaultValue: 'item-1',
    children:
      'Long content text that spans multiple lines to show how AccordionContent handles overflow and text wrapping with proper padding and line-height. This demonstrates the component\'s ability to handle longer text blocks while maintaining consistent styling and spacing throughout the content area.',
  },
};

export const StateOpenWithRichContent: Story = {
  args: {
    defaultValue: 'item-1',
    children: (
      <div className="space-y-4">
        <p>This is a paragraph with rich content.</p>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>First item in list</li>
          <li>Second item in list</li>
          <li>Third item in list</li>
        </ul>
        <p>Another paragraph after the list.</p>
      </div>
    ),
  },
};
