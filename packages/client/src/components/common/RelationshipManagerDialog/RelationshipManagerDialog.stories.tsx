// type import removed:  Meta, StoryObj  from '@storybook/react';
import { RelationshipManagerDialog } from './RelationshipManagerDialog';

const meta = {
  component: RelationshipManagerDialog,
  title: 'Components/Common/RelationshipManagerDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-1742',
    },
  },
};

export default meta;


const mockItems = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
  },
  {
    id: '3',
    title: 'Claim Status Update',
    subtitle: '#CAS-242315-2127',
  },
  {
    id: '4',
    title: 'Fraud Investigation',
    subtitle: '#CAS-242315-2128',
  },
];

export const Default = {
  args: {
    open: true,
    onOpenChange: () => {},
    items: mockItems,
    selectedItems: ['1'],
    onSelectionChange: () => {},
    onAdd: (selectedIds) => console.log('Add clicked', selectedIds),
  },
};


export const NoSelection = {
  args: {
    open: true,
    onOpenChange: () => {},
    items: mockItems,
    selectedItems: [],
    onSelectionChange: () => {},
    onAdd: () => console.log('Add clicked'),
  },
};
