import type { Meta, StoryObj } from '@storybook/react';
import { RelatedCasesList } from './RelatedCasesList';
import type { RelatedCaseItem } from './types';

const meta: Meta<typeof RelatedCasesList> = {
  component: RelatedCasesList,
  title: 'Components/CaseDetails/AddRelatedCaseDialog/RelatedCasesList',
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
type Story = StoryObj<typeof RelatedCasesList>;

const mockCases: RelatedCaseItem[] = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    caseNumber: '#CAS-242315-2125',
    selected: true,
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    caseNumber: '#CAS-242315-2126',
    selected: false,
  },
  {
    id: '3',
    title: 'Claim Status Update',
    caseNumber: '#CAS-242315-2127',
    selected: false,
  },
  {
    id: '4',
    title: 'Fraud Investigation',
    caseNumber: '#CAS-242315-2128',
    selected: false,
  },
];

export const Default: Story = {
  args: {
    cases: mockCases,
    onCaseToggle: (id) => console.log('Toggled:', id),
  },
};


export const AllSelected: Story = {
  args: {
    cases: mockCases.map((c) => ({ ...c, selected: true })),
    onCaseToggle: (id) => console.log('Toggled:', id),
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Select Related Cases',
    cases: mockCases,
    onCaseToggle: (id) => console.log('Toggled:', id),
  },
};
