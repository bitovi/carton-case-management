import type { Meta, StoryObj } from '@storybook/react';
import { CaseDetails } from './CaseDetails';

const meta = {
  title: 'Components/CaseDetails',
  component: CaseDetails,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CaseDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
