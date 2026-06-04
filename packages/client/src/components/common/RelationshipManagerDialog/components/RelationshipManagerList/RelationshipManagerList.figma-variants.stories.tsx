import type { Meta, StoryObj } from '@storybook/react';
import { RelationshipManagerList } from './RelationshipManagerList';
import type { RelationshipManagerListItem } from './types';

const mixedItems: RelationshipManagerListItem[] = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    selected: true,
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
    selected: false,
  },
  {
    id: '3',
    title: 'Claim Status Update',
    subtitle: '#CAS-242315-2127',
    selected: false,
  },
  {
    id: '4',
    title: 'Fraud Investigation',
    subtitle: '#CAS-242315-2128',
    selected: false,
  },
];

const allSelectedItems: RelationshipManagerListItem[] = mixedItems.map(
  (item) => ({ ...item, selected: true })
);

const noneSelectedItems: RelationshipManagerListItem[] = mixedItems.map(
  (item) => ({ ...item, selected: false })
);

const manyItems: RelationshipManagerListItem[] = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    selected: true,
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
    selected: false,
  },
  {
    id: '3',
    title: 'Claim Status Update',
    subtitle: '#CAS-242315-2127',
    selected: true,
  },
  {
    id: '4',
    title: 'Fraud Investigation',
    subtitle: '#CAS-242315-2128',
    selected: false,
  },
  {
    id: '5',
    title: 'Beneficiary Change Request',
    subtitle: '#CAS-242315-2129',
    selected: true,
  },
  {
    id: '6',
    title: 'Policy Renewal Review',
    subtitle: '#CAS-242315-2130',
    selected: false,
  },
  {
    id: '7',
    title: 'Underwriting Assessment',
    subtitle: '#CAS-242315-2131',
    selected: true,
  },
  {
    id: '8',
    title: 'Compliance Audit Follow-up',
    subtitle: '#CAS-242315-2132',
    selected: false,
  },
];

const meta = {
  title: 'Figma Variants/RelationshipManagerList',
  component: RelationshipManagerList,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RelationshipManagerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionMixed: Story = {
  args: {
    title: 'Add Relationships',
    items: mixedItems,
    onItemToggle: () => {},
  },
};

export const SelectionAllSelected: Story = {
  args: {
    title: 'Add Relationships',
    items: allSelectedItems,
    onItemToggle: () => {},
  },
};

export const SelectionNoneSelected: Story = {
  args: {
    title: 'Add Relationships',
    items: noneSelectedItems,
    onItemToggle: () => {},
  },
};

export const StateEmpty: Story = {
  args: {
    title: 'Add Relationships',
    items: [],
    onItemToggle: () => {},
  },
};

export const StateManyItems: Story = {
  args: {
    title: 'Add Relationships',
    items: manyItems,
    onItemToggle: () => {},
  },
};
