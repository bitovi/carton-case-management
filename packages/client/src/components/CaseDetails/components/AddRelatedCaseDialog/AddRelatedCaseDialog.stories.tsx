import type { Meta, StoryObj } from '@storybook/react';
import { AddRelatedCaseDialog } from './AddRelatedCaseDialog';

const meta: Meta<typeof AddRelatedCaseDialog> = {
  component: AddRelatedCaseDialog,
  title: 'Components/CaseDetails/AddRelatedCaseDialog',
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
type Story = StoryObj<typeof AddRelatedCaseDialog>;

const mockCases = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    caseNumber: '#CAS-242315-2125',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    caseNumber: '#CAS-242315-2126',
  },
  {
    id: '3',
    title: 'Claim Status Update',
    caseNumber: '#CAS-242315-2127',
  },
  {
    id: '4',
    title: 'Fraud Investigation',
    caseNumber: '#CAS-242315-2128',
  },
];

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    cases: mockCases,
    selectedCases: ['1'],
    onSelectionChange: () => {},
    onAdd: () => console.log('Add clicked'),
  },
};


export const NoSelection: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    cases: mockCases,
    selectedCases: [],
    onSelectionChange: () => {},
    onAdd: () => console.log('Add clicked'),
  },
};
