import type { Meta, StoryObj } from '@storybook/react';
import { RelationshipManagerList } from './RelationshipManagerList';
import type { RelationshipManagerListItem } from './types';

const meta: Meta<typeof RelationshipManagerList> = {
  component: RelationshipManagerList,
  title: 'Components/Common/RelationshipManagerDialog/RelationshipManagerList/RelationshipManagerList',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-2055',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RelationshipManagerList>;

const mockItems: RelationshipManagerListItem[] = [
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

export const Default: Story = {
  args: {
    title: 'Add Relationships',
    items: mockItems,
    onItemToggle: (id) => console.log('Toggled:', id),
  },
};


export const AllSelected: Story = {
  args: {
    title: 'Add Relationships',
    items: mockItems.map((item) => ({ ...item, selected: true })),
    onItemToggle: (id) => console.log('Toggled:', id),
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Select Related Items',
    items: mockItems,
    onItemToggle: (id) => console.log('Toggled:', id),
  },
};
