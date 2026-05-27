import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/PopoverTrigger',
  component: PopoverTrigger,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof PopoverTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

function TriggerVariant({ children }: { children: ReactNode }) {
  return (
    <div className="h-[220px] w-[420px] flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
          <p className="text-sm text-slate-700">Popover content</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const RenderModeAsChildTrue: Story = {
  render: () => (
    <TriggerVariant>
      <Button variant="outline">Trigger</Button>
    </TriggerVariant>
  ),
};

export const TriggerContentCustomButton: Story = {
  render: () => (
    <TriggerVariant>
      <Button variant="primary" className="min-w-[140px]">
        Open Popover
      </Button>
    </TriggerVariant>
  ),
};
