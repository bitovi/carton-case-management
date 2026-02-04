import type { Meta, StoryObj } from '@storybook/react';
import { RelatedCasesAccordion } from './RelatedCasesAccordion';

const meta: Meta<typeof RelatedCasesAccordion> = {
  component: RelatedCasesAccordion,
  title: 'Components/CaseDetails/CaseEssentialDetails/RelatedCasesAccordion',
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
type Story = StoryObj<typeof RelatedCasesAccordion>;

const mockCases = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    caseNumber: '#CAS-242315-2125',
  },
];

export const Closed: Story = {
  args: {
    cases: mockCases,
    defaultOpen: false,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const Open: Story = {
  args: {
    cases: mockCases,
    defaultOpen: true,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const MultipleCases: Story = {
  args: {
    cases: [
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
    ],
    defaultOpen: true,
    onAddClick: () => console.log('Add clicked'),
  },
};

export const WithoutAddButton: Story = {
  args: {
    cases: mockCases,
    defaultOpen: true,
  },
};
