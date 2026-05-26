import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from '../../../../index';
import { Button } from '../../../Button';

const meta = {
  title: 'Figma Variants/TooltipContent',
  component: TooltipContent,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-[200px] items-center justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to render TooltipContent with a trigger
function TooltipContentStory({
  side,
  align,
}: {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
}) {
  return (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        Tooltip text
      </TooltipContent>
    </Tooltip>
  );
}

// Side: top
export const SideTopAlignStart: Story = {
  render: () => <TooltipContentStory side="top" align="start" />,
};

export const SideTopAlignCenter: Story = {
  render: () => <TooltipContentStory side="top" align="center" />,
};

export const SideTopAlignEnd: Story = {
  render: () => <TooltipContentStory side="top" align="end" />,
};

// Side: bottom
export const SideBottomAlignStart: Story = {
  render: () => <TooltipContentStory side="bottom" align="start" />,
};

export const SideBottomAlignCenter: Story = {
  render: () => <TooltipContentStory side="bottom" align="center" />,
};

export const SideBottomAlignEnd: Story = {
  render: () => <TooltipContentStory side="bottom" align="end" />,
};

// Side: left
export const SideLeftAlignStart: Story = {
  render: () => <TooltipContentStory side="left" align="start" />,
};

export const SideLeftAlignCenter: Story = {
  render: () => <TooltipContentStory side="left" align="center" />,
};

export const SideLeftAlignEnd: Story = {
  render: () => <TooltipContentStory side="left" align="end" />,
};

// Side: right
export const SideRightAlignStart: Story = {
  render: () => <TooltipContentStory side="right" align="start" />,
};

export const SideRightAlignCenter: Story = {
  render: () => <TooltipContentStory side="right" align="center" />,
};

export const SideRightAlignEnd: Story = {
  render: () => <TooltipContentStory side="right" align="end" />,
};
