import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Figma Variants/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const threeItems = [
  { value: 'item-0', trigger: 'Section 1', content: 'Content for section 1' },
  { value: 'item-1', trigger: 'Section 2', content: 'Content for section 2' },
  { value: 'item-2', trigger: 'Section 3', content: 'Content for section 3' },
];

export const TypeSingleCollapsibleTrueThreeItemsAllClosed: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: threeItems,
  },
};

export const TypeSingleCollapsibleFalseThreeItemsFirstOpen: Story = {
  args: {
    type: 'single',
    collapsible: false,
    value: 'item-0',
    className: 'w-[480px]',
    items: threeItems,
  },
};

export const TypeMultipleThreeItemsNoOpen: Story = {
  args: {
    type: 'multiple',
    value: [],
    className: 'w-[480px]',
    items: threeItems,
  },
};

export const TypeMultipleOneItemOpen: Story = {
  args: {
    type: 'multiple',
    value: ['item-0'],
    className: 'w-[480px]',
    items: threeItems,
  },
};

export const TypeMultipleThreeItemsFirstAndSecondOpen: Story = {
  args: {
    type: 'multiple',
    value: ['item-0', 'item-1'],
    className: 'w-[480px]',
    items: threeItems,
  },
};
