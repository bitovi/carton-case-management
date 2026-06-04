import type { Meta, StoryObj } from '@storybook/react';
import { RelationshipManagerDialog } from './RelationshipManagerDialog';

const fewItems = [
  { id: '1', title: 'Policy Coverage Inquiry', subtitle: '#CAS-242315-2125' },
  { id: '2', title: 'Premium Adjustment Request', subtitle: '#CAS-242315-2126' },
  { id: '3', title: 'Claim Status Update', subtitle: '#CAS-242315-2127' },
  { id: '4', title: 'Fraud Investigation', subtitle: '#CAS-242315-2128' },
];

const manyItems = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Related Case Item ${i + 1}`,
  subtitle: `#CAS-242315-${2125 + i}`,
}));

const noop = () => {};

const meta = {
  title: 'Figma Variants/RelationshipManagerDialog',
  component: RelationshipManagerDialog,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RelationshipManagerDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionNoneItemsEmptyScrollNoScroll: Story = {
  args: {
    open: true,
    onOpenChange: noop,
    title: 'Related Items',
    items: [],
    selectedItems: [],
    onSelectionChange: noop,
    onAdd: noop,
  },
};

export const SelectionNoneItemsPopulatedScrollNoScroll: Story = {
  args: {
    open: true,
    onOpenChange: noop,
    title: 'Related Items',
    items: fewItems,
    selectedItems: [],
    onSelectionChange: noop,
    onAdd: noop,
  },
};

export const SelectionSomeItemsPopulatedScrollNoScroll: Story = {
  args: {
    open: true,
    onOpenChange: noop,
    title: 'Related Items',
    items: fewItems,
    selectedItems: ['1', '2'],
    onSelectionChange: noop,
    onAdd: noop,
  },
};

export const SelectionNoneItemsPopulatedScrollScroll: Story = {
  args: {
    open: true,
    onOpenChange: noop,
    title: 'Related Items',
    items: manyItems,
    selectedItems: [],
    onSelectionChange: noop,
    onAdd: noop,
  },
};

export const SelectionSomeItemsPopulatedScrollScroll: Story = {
  args: {
    open: true,
    onOpenChange: noop,
    title: 'Related Items',
    items: manyItems,
    selectedItems: ['1', '2'],
    onSelectionChange: noop,
    onAdd: noop,
  },
};
