import type { Meta, StoryObj } from '@storybook/react';
import { CaseComments } from './CaseComments';

const meta = {
  title: 'Components/CaseDetails/CaseComments',
  component: CaseComments,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CaseComments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
