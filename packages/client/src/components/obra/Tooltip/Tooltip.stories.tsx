import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip';

const meta: Meta<typeof TooltipContent> = {
  title: 'Obra/Tooltip',
  component: TooltipContent,
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <div className="flex items-center justify-center p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipContent>;

/**
 * The default tooltip appears on top of the trigger element.
 */
export const Default: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Helpful tooltip content</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned below the trigger element.
 */
export const Bottom: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Bottom tooltip</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>This appears below</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned to the left of the trigger element.
 */
export const Left: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Left tooltip</Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>This appears on the left</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned to the right of the trigger element.
 */
export const Right: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Right tooltip</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>This appears on the right</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip without the arrow pointer.
 */
export const NoArrow: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">No arrow</Button>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>
        <p>Tooltip without arrow</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip with longer content that wraps.
 */
export const LongContent: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Long content</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          This is a longer tooltip with more content that demonstrates how the
          tooltip handles multi-line text and wrapping behavior.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip can be used with any trigger element using asChild.
 */
export const WithIconButton: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button className="rounded-full p-2 hover:bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Help information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Demonstration of all tooltip sides.
 */
export const AllSides: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <div />
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <div />

      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
      <div />
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>

      <div />
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <div />
    </div>
  ),
};

/**
 * Interactive tooltip that opens on hover (not defaultOpen).
 */
export const Interactive: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover to see tooltip</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This tooltip appears on hover</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip with custom delay duration.
 */
export const CustomDelay: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={1000}>
        <div className="flex items-center justify-center p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">1 second delay</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This tooltip has a 1 second delay</p>
      </TooltipContent>
    </Tooltip>
  ),
};
