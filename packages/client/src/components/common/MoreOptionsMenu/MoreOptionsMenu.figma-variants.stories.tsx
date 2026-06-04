import type { Meta, StoryObj } from '@storybook/react';
import { Edit2, Trash2, Share2, UserCircle } from 'lucide-react';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Button } from '@/components/obra/Button';

const meta = {
  title: 'Figma Variants/MoreOptionsMenu',
  component: MoreOptionsMenu,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof MoreOptionsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultChildren = (
  <>
    <MenuItem icon={<Edit2 className="h-4 w-4" />} onClick={() => {}}>Edit</MenuItem>
    <MenuItem icon={<Share2 className="h-4 w-4" />} onClick={() => {}}>Share</MenuItem>
    <MenuItem
      icon={<Trash2 className="h-4 w-4 text-destructive" />}
      className="text-destructive hover:text-destructive"
      onClick={() => {}}
    >
      Delete
    </MenuItem>
  </>
);

export const StateClosed: Story = {
  args: {
    children: defaultChildren,
    open: false,
  },
};

export const StateOpen: Story = {
  args: {
    children: defaultChildren,
    open: true,
  },
};

export const StateOpenTriggerCustom: Story = {
  args: {
    trigger: (
      <Button variant="ghost" size="small" roundness="round">
        <UserCircle className="h-5 w-5" />
      </Button>
    ),
    children: defaultChildren,
    open: true,
  },
};
