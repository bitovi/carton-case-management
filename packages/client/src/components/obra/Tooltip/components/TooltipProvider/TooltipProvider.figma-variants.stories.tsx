import type { Meta, StoryObj } from '@storybook/react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../index';

const meta = {
  title: 'Figma Variants/TooltipProvider',
  component: TooltipProvider,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TooltipProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDelayDuration: Story = {
  args: {
    delayDuration: 700,
    skipDelayDuration: 300,
    disableHoverableContent: false,
  },
  render: ({ delayDuration, skipDelayDuration, disableHoverableContent }) => (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <div className="flex min-h-[200px] items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger>Hover me (700ms delay)</TooltipTrigger>
          <TooltipContent side="top">Tooltip text</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const ReducedDelayDuration: Story = {
  args: {
    delayDuration: 200,
    skipDelayDuration: 300,
    disableHoverableContent: false,
  },
  render: ({ delayDuration, skipDelayDuration, disableHoverableContent }) => (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <div className="flex min-h-[200px] items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger>Hover me (200ms delay)</TooltipTrigger>
          <TooltipContent side="top">Tooltip text</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const DisableHoverableContent: Story = {
  args: {
    delayDuration: 700,
    skipDelayDuration: 300,
    disableHoverableContent: true,
  },
  render: ({ delayDuration, skipDelayDuration, disableHoverableContent }) => (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <div className="flex min-h-[200px] items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger>Hover me (hoverable disabled)</TooltipTrigger>
          <TooltipContent side="top">Tooltip text</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const MultipleTooltips: Story = {
  args: {
    delayDuration: 700,
    skipDelayDuration: 300,
    disableHoverableContent: false,
  },
  render: ({ delayDuration, skipDelayDuration, disableHoverableContent }) => (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <div className="flex min-h-[200px] items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger>First</TooltipTrigger>
          <TooltipContent side="top">First tooltip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Second</TooltipTrigger>
          <TooltipContent side="top">Second tooltip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Third</TooltipTrigger>
          <TooltipContent side="top">Third tooltip</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
