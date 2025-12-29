import type { Meta, StoryObj } from '@storybook/react';
import { CaseList } from './CaseList';

const meta = {
  title: 'Components/CaseList',
  component: CaseList,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CaseList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
