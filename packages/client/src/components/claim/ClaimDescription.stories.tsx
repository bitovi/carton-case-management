import type { Meta, StoryObj } from '@storybook/react';
import { ClaimDescription } from './ClaimDescription';

const meta: Meta<typeof ClaimDescription> = {
  title: 'Claim/ClaimDescription',
  component: ClaimDescription,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ClaimDescription>;

export const Default: Story = {
  args: {
    description:
      'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
  },
};

export const Short: Story = {
  args: {
    description: 'Customer inquiring about coverage limits for recent home damage claim.',
  },
};

export const Long: Story = {
  args: {
    description: `This is a complex insurance claim involving multiple parties and various stages of investigation.

The incident occurred on November 15, 2025, when the policyholder reported water damage to their property. Initial assessment indicated the damage was extensive and required immediate attention.

Several follow-up inspections were conducted, and the claim has been escalated to the senior adjusters team for review. The estimated cost of repairs is currently being evaluated, and we expect to provide a final determination within the next 10 business days.

The policyholder has been cooperative throughout the process and has provided all requested documentation in a timely manner.`,
  },
};
