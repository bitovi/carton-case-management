import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../Accordion';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'Figma Variants/AccordionContent',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const StateOpen: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section Title',
        content:
          'This is sample accordion content that demonstrates the expanded state with the default padding and text styling applied by AccordionContent.',
      },
    ],
  },
};
