import type { Meta, StoryObj } from '@storybook/react';
import { CaseDetailsPage } from './CaseDetailsPage';

const meta = {
  title: 'Pages/CaseDetailsPage',
  component: CaseDetailsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CaseDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
