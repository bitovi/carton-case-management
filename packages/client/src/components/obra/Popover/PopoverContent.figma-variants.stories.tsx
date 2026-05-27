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
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function VariantPopoverContent({
  open,
  content,
  headerTitle,
  headerDescription,
  children,
}: {
  open: boolean;
  content?: 'Menu';
  headerTitle?: string;
  headerDescription?: string;
  children?: ReactNode;
}) {
  return (
    <div className="h-[280px] w-[520px] flex items-center justify-center">
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover Trigger</Button>
        </PopoverTrigger>
        <PopoverContent
          content={content}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
          className="w-80"
        >
          {children ?? <p className="text-sm text-slate-700">Popover content</p>}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const StateClosedContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopoverContent open={false} />,
};

export const StateOpenContentDefaultHeaderWithoutHeader: Story = {
  render: () => <VariantPopoverContent open />,
};

export const StateOpenContentDefaultHeaderWithHeader: Story = {
  render: () => (
    <VariantPopoverContent
      open
      headerTitle="Popover Title"
      headerDescription="Optional description"
    />
  ),
};

export const StateOpenContentMenuHeaderWithoutHeader: Story = {
  render: () => (
    <VariantPopoverContent open content="Menu">
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

export const BodyContentCustomMenuList: Story = {
  render: () => (
    <VariantPopoverContent open>
      <ul className="space-y-1 text-sm text-slate-700">
        <li className="rounded px-2 py-1 hover:bg-slate-100">Menu Item One</li>
        <li className="rounded px-2 py-1 hover:bg-slate-100">Menu Item Two</li>
        <li className="rounded px-2 py-1 hover:bg-slate-100">Menu Item Three</li>
      </ul>
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
