import type { Meta, StoryObj } from '@storybook/react';
import { RelationshipManagerAccordion } from './RelationshipManagerAccordion';

const meta: Meta<typeof RelationshipManagerAccordion> = {
  component: RelationshipManagerAccordion,
  title: 'Components/Common/RelationshipManagerAccordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1040-1662',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RelationshipManagerAccordion>;

const mockItems = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
  },
];

export const Closed: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: mockItems,
    defaultOpen: false,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const Open: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: mockItems,
    defaultOpen: true,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const MultipleCases: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: [
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
    ],
    defaultOpen: true,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const WithoutAddButton: Story = {
  args: {
    accordionTitle: 'Related Cases',
    items: mockItems,
    defaultOpen: true,
  },
};
