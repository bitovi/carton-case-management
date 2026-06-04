import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RelationshipManagerAccordion } from './RelationshipManagerAccordion';

const singleItem = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    to: '/cases/1',
  },
];

const multipleItems = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    to: '/cases/1',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
    to: '/cases/2',
  },
  {
    id: '3',
    title: 'Claim Status Update',
    subtitle: '#CAS-242315-2127',
    to: '/cases/3',
  },
];

const noop = () => {};

const meta = {
  title: 'Figma Variants/RelationshipManagerAccordion',
  component: RelationshipManagerAccordion,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RelationshipManagerAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateClosedItemsSingle: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: singleItem,
    defaultOpen: false,
    onAddClick: noop,
  },
};

export const StateOpenItemsSingle: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: singleItem,
    defaultOpen: true,
    onAddClick: noop,
  },
};

export const StateOpenItemsMultiple: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: multipleItems,
    defaultOpen: true,
    onAddClick: noop,
  },
};

export const StateOpenItemsEmpty: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: [],
    defaultOpen: true,
    onAddClick: noop,
  },
};

export const StateClosedItemsMultiple: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: multipleItems,
    defaultOpen: false,
    onAddClick: noop,
  },
};

export const StateClosedItemsEmpty: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: [],
    defaultOpen: false,
    onAddClick: noop,
  },
};

export const ShowAddButtonFalse: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: singleItem,
    defaultOpen: true,
  },
};
