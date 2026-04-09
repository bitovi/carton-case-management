import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { CaseRelatedCasesAccordion } from './CaseRelatedCasesAccordion';

const meta: Meta<typeof CaseRelatedCasesAccordion> = {
  component: CaseRelatedCasesAccordion,
  title: 'Components/CaseDetails/CaseRelatedCasesAccordion',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CaseRelatedCasesAccordion>;

export const Default: Story = {
  args: {
    caseId: 'example-case-id',
  },
};
