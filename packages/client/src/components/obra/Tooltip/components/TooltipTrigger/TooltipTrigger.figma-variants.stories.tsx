import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './index';
import { Button } from '../Button';
import { Zap } from 'lucide-react';

const meta = {
  title: 'Figma Variants/TooltipTrigger',
  component: TooltipTrigger,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-[200px] items-center justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TooltipTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dependent axis: State
// All state stories use default content

export const StateDefault: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip content</TooltipContent>
    </Tooltip>
  ),
};

export const StateHover: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip content</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-state="closed"]') || 
                   canvasElement.querySelector('button') || 
                   canvasElement.firstElementChild;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const StateFocus: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip content</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-state="closed"]') || 
                   canvasElement.querySelector('button') || 
                   canvasElement.firstElementChild;
    if (trigger && trigger instanceof HTMLElement) {
      trigger.focus();
    }
  },
};

export const StateActive: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip content</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-state="closed"]') || 
                   canvasElement.querySelector('button') || 
                   canvasElement.firstElementChild;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const StateDisabled: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger aria-disabled="true" className="opacity-50 cursor-not-allowed">
        Disabled trigger
      </TooltipTrigger>
      <TooltipContent side="top">Tooltip content</TooltipContent>
    </Tooltip>
  ),
};

// Independent axis: Content variations
// All rendered at State: default

export const AsChildWithButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Button Trigger</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Additional information</TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="inline-flex items-center justify-center">
        <Zap className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent side="top">Trigger icon</TooltipContent>
    </Tooltip>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="max-w-xs text-wrap">
        This is a much longer text that might wrap across multiple lines
      </TooltipTrigger>
      <TooltipContent side="top">Tooltip for long text trigger</TooltipContent>
    </Tooltip>
  ),
};
