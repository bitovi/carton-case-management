import type { Meta, StoryObj } from '@storybook/react';
import { CaseEssentialDetails } from './CaseEssentialDetails';

const meta = {
  title: 'Components/CaseDetails/CaseEssentialDetails',
  component: CaseEssentialDetails,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CaseEssentialDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
