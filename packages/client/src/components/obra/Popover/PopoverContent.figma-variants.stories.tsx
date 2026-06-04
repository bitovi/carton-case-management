import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/obra/Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const meta = {
  title: 'Figma Variants/PopoverContent',
  component: PopoverContent,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function VariantPopoverContent({
  content,
  headerTitle,
  headerDescription,
  children,
}: {
  content?: 'Menu';
  headerTitle?: string;
  headerDescription?: string;
  children?: ReactNode;
}) {
  return (
    <div className="h-[280px] w-[520px] flex items-center justify-center">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover Trigger</Button>
        </PopoverTrigger>
        <PopoverContent
          content={content}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
          className="w-80"
        >
          {children ?? <p className="text-sm text-slate-700">Popover content goes here with sample text.</p>}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const ContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopoverContent />,
};

export const ContentDefaultHeaderWithHeader: Story = {
  render: () => (
    <VariantPopoverContent
      headerTitle="Popover Title"
      headerDescription="Optional description text"
    />
  ),
};

export const ContentMenuHeaderWithoutHeader: Story = {
  render: () => (
    <VariantPopoverContent content="Menu">
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
    </VariantPopoverContent>
  ),
};

export const WithHeaderTitle: Story = {
  render: () => <VariantPopoverContent open headerTitle="Popover Title" />,
};

export const WithHeaderDescription: Story = {
  render: () => (
    <VariantPopoverContent
      open
      headerTitle="Popover Title"
      headerDescription="Optional description"
    />
  ),
};
