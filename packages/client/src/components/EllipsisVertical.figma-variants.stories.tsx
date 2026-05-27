import type { Meta, StoryObj } from '@storybook/react';
import { EllipsisVertical } from 'lucide-react';

const meta = {
  title: 'Figma Variants/EllipsisVertical',
  component: EllipsisVertical,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof EllipsisVertical>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
