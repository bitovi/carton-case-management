import type { Meta, StoryObj } from '@storybook/react';
import { VoterTooltip } from './VoterTooltip';

const meta = {
  title: 'Figma Variants/VoterTooltip',
  component: VoterTooltip,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof VoterTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeUp: Story = {
  args: {
    type: 'up',
    __storyDefaultOpen: true,
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <span className="text-sm font-semibold">Alex Morgan</span>,
  },
};

export const TypeDown: Story = {
  args: {
    type: 'down',
    __storyDefaultOpen: true,
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <span className="text-sm font-semibold">Alex Morgan</span>,
  },
};
