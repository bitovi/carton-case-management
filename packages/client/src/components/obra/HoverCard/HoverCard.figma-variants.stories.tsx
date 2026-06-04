import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';

const meta = {
  title: 'Figma Variants/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerButton = (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
);
const cardContent = (
  <div className="text-sm font-semibold">HoverCard Content</div>
);

export const SideBottomAlignCenterStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'bottom',
    align: 'center',
    __storyDefaultOpen: true,
  },
};

export const SideTopAlignCenterStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'top',
    align: 'center',
    __storyDefaultOpen: true,
  },
};

export const SideLeftAlignCenterStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'left',
    align: 'center',
    __storyDefaultOpen: true,
  },
};

export const SideRightAlignCenterStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'right',
    align: 'center',
    __storyDefaultOpen: true,
  },
};

export const SideBottomAlignStartStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'bottom',
    align: 'start',
    __storyDefaultOpen: true,
  },
};

export const SideBottomAlignEndStateOpen: Story = {
  args: {
    trigger: triggerButton,
    children: cardContent,
    side: 'bottom',
    align: 'end',
    __storyDefaultOpen: true,
  },
};

export const SideBottomAlignCenterStateClosed: Story = {
  args: {
    trigger: (
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Trigger (closed)
      </button>
    ),
    children: cardContent,
    side: 'bottom',
    align: 'center',
  },
};
