import type { Meta, StoryObj } from '@storybook/react';
import { CasePage } from './CasePage';

const meta = {
  title: 'Components/CasePage',
  component: CasePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CasePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
