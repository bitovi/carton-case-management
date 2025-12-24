import type { Meta, StoryObj } from '@storybook/react';
import { CaseDescription } from './CaseDescription';

const meta = {
  title: 'Case Details/CaseDescription',
  component: CaseDescription,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CaseDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description:
      'Customer is disputing the denial of their insurance claim for vehicle damage that occurred on November 15, 2025. The claim was initially denied due to insufficient documentation. Customer has now provided additional photos and police report.',
  },
};

export const ShortDescription: Story = {
  args: {
    description: 'Simple case with minimal description.',
  },
};

export const LongDescription: Story = {
  args: {
    description: `This is a complex case involving multiple issues and requiring detailed documentation.

The customer initially submitted a claim on November 1, 2025, which was processed according to standard procedures. However, several discrepancies were noted during the initial review:

1. Missing documentation regarding the incident date
2. Incomplete witness statements
3. Conflicting information in the police report

The case was escalated to senior claims adjusters for further review. Additional information was requested from the customer on November 10, 2025.

As of December 1, 2025, we have received:
- Updated police report with corrected incident date
- Three witness statements corroborating the customer's account
- Additional photographic evidence of the damage

The case is currently under review and a decision is expected within 5-7 business days.`,
  },
};
