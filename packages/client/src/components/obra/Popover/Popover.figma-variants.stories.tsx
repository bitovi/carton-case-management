import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

function VariantPopover({
  open,
  side = 'bottom',
  align = 'center',
  content,
  headerTitle,
  headerDescription,
}: {
  open: boolean;
  side?: Side;
  align?: Align;
  content?: 'Menu';
  headerTitle?: string;
  headerDescription?: string;
}) {
  return (
    <div className="h-[280px] w-[520px] flex items-center justify-center">
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover Trigger</Button>
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          content={content}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
          className="w-80"
        >
          {content === 'Menu' ? (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="small" className="w-full justify-start">
                Action One
              </Button>
              <Button variant="ghost" size="small" className="w-full justify-start">
                Action Two
              </Button>
              <Button variant="ghost" size="small" className="w-full justify-start">
                Action Three
              </Button>
            </div>
          ) : (
            <p className="text-sm text-slate-700">Popover content</p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const StateClosed: Story = {
  render: () => <VariantPopover open={false} />,
};

export const StateOpenPositionBottomAlignmentCenterContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="bottom" align="center" />,
};

export const StateOpenPositionTopAlignmentStartContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="top" align="start" />,
};

export const StateOpenPositionTopAlignmentCenterContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="top" align="center" />,
};

export const StateOpenPositionTopAlignmentEndContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="top" align="end" />,
};

export const StateOpenPositionRightAlignmentStartContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="right" align="start" />,
};

export const StateOpenPositionRightAlignmentCenterContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="right" align="center" />,
};

export const StateOpenPositionRightAlignmentEndContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="right" align="end" />,
};

export const StateOpenPositionLeftAlignmentStartContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="left" align="start" />,
};

export const StateOpenPositionLeftAlignmentCenterContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="left" align="center" />,
};

export const StateOpenPositionLeftAlignmentEndContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="left" align="end" />,
};

export const StateOpenPositionBottomAlignmentStartContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="bottom" align="start" />,
};

export const StateOpenPositionBottomAlignmentEndContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="bottom" align="end" />,
};

export const StateOpenPositionBottomAlignmentCenterContentMenuHeaderWithoutHeader: Story = {
  render: () => <VariantPopover open side="bottom" align="center" content="Menu" />,
};

export const StateOpenPositionBottomAlignmentCenterContentDefaultHeaderWithHeader: Story = {
  render: () => (
    <VariantPopover
      open
      side="bottom"
      align="center"
      headerTitle="Popover Title"
      headerDescription="Optional description"
    />
  ),
};
