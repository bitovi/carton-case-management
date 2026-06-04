import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/PopoverTrigger',
  component: PopoverTrigger,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof PopoverTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

function PopoverTriggerPreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
          <p className="text-sm text-slate-700">Popover content</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const StateDefault: Story = {
  render: () => (
    <PopoverTriggerPreview>
      <Button variant="outline">Trigger</Button>
    </PopoverTriggerPreview>
  ),
};

export const StateHover: Story = {
  render: () => (
    <PopoverTriggerPreview>
      <Button variant="outline">Trigger</Button>
    </PopoverTriggerPreview>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const StateFocus: Story = {
  render: () => (
    <PopoverTriggerPreview>
      <Button variant="outline">Trigger</Button>
    </PopoverTriggerPreview>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button && button instanceof HTMLElement) {
      button.focus();
    }
  },
};

export const StateActive: Story = {
  render: () => (
    <PopoverTriggerPreview>
      <Button variant="outline">Trigger</Button>
    </PopoverTriggerPreview>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};
