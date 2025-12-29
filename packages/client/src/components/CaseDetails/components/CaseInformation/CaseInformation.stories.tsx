import type { Meta, StoryObj } from '@storybook/react';
import { CaseInformation } from './CaseInformation';

const meta = {
  title: 'Components/CaseDetails/CaseInformation',
  component: CaseInformation,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CaseInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
