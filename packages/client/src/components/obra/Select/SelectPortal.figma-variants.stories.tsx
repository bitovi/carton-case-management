import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

type SelectPortalProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Portal>;

function SelectPortalPreview({ children, container, ...props }: SelectPortalProps) {
  return (
    <>
      <div className="w-[280px] rounded-md border border-dashed border-border p-4 text-xs text-muted-foreground">
        Select trigger area
      </div>
      <SelectPrimitive.Portal container={container} {...props}>
        <div className="fixed left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--border-3)] bg-white p-3 shadow-md">
          {children ?? (
            <div className="space-y-1 text-sm leading-[21px] tracking-[0.07px] text-foreground">
              <div>Portal content</div>
              <div className="text-muted-foreground">Rendered through SelectPortal</div>
            </div>
          )}
        </div>
      </SelectPrimitive.Portal>
    </>
  );
}

const meta = {
  title: 'Figma Variants/SelectPortal',
  component: SelectPortalPreview,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectPortalPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
