import type { Meta, StoryObj } from '@storybook/react';
import { SvgIcon } from '@progress/kendo-react-common';
import { pencilIcon, trashIcon, shareIcon, userIcon } from '@progress/kendo-svg-icons';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof MoreOptionsMenu> = {
  title: 'Components/Common/MoreOptionsMenu',
  component: MoreOptionsMenu,
  parameters: {
    docs: {
      description: {
        component: `A flexible dropdown menu component with configurable trigger. Based on Figma design: https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1179-62911`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MoreOptionsMenu>;

export const Default: Story = {
  args: {
    children: (
      <>
        <MenuItem icon={<SvgIcon icon={pencilIcon} size="small" />}>Edit</MenuItem>
        <MenuItem icon={<SvgIcon icon={shareIcon} size="small" />}>Share</MenuItem>
        <MenuItem
          icon={<SvgIcon icon={trashIcon} size="small" className="text-destructive" />}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </MenuItem>
      </>
    ),
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    open: true,
  },
};

export const WithAvatarTrigger: Story = {
  args: {
    trigger: (
      <Button variant="ghost" size="small" roundness="round">
        <SvgIcon icon={userIcon} size="small" />
      </Button>
    ),
    children: (
      <>
        <MenuItem icon={<SvgIcon icon={userIcon} size="small" />}>Profile</MenuItem>
        <MenuItem icon={<SvgIcon icon={pencilIcon} size="small" />}>Settings</MenuItem>
        <MenuItem>Sign out</MenuItem>
      </>
    ),
  },
};

export const WithButtonTrigger: Story = {
  args: {
    trigger: (
      <Button variant="outline" size="small">
        Options
      </Button>
    ),
    children: (
      <>
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem disabled>Disabled Option</MenuItem>
      </>
    ),
  },
};

export const Positioning: Story = {
  render: () => (
    <div className="flex gap-8 p-8">
      <div>
        <p className="mb-2 text-sm font-medium">Side: top</p>
        <MoreOptionsMenu side="top">
          <MenuItem>Above trigger</MenuItem>
          <MenuItem>Second item</MenuItem>
        </MoreOptionsMenu>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Side: right</p>
        <MoreOptionsMenu side="right">
          <MenuItem>Right of trigger</MenuItem>
          <MenuItem>Second item</MenuItem>
        </MoreOptionsMenu>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Side: bottom (default)</p>
        <MoreOptionsMenu side="bottom">
          <MenuItem>Below trigger</MenuItem>
          <MenuItem>Second item</MenuItem>
        </MoreOptionsMenu>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Side: left</p>
        <MoreOptionsMenu side="left">
          <MenuItem>Left of trigger</MenuItem>
          <MenuItem>Second item</MenuItem>
        </MoreOptionsMenu>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  args: {
    children: (
      <>
        <MenuItem icon={<SvgIcon icon={pencilIcon} size="small" className="text-blue-600" />}>
          <span className="text-blue-600">Custom Blue</span>
        </MenuItem>
        <MenuItem icon={<SvgIcon icon={shareIcon} size="small" className="text-green-600" />}>
          <span className="text-green-600">Custom Green</span>
        </MenuItem>
        <MenuItem icon={<SvgIcon icon={trashIcon} size="small" className="text-red-600" />}>
          <span className="text-red-600">Custom Red (Non-destructive)</span>
        </MenuItem>
      </>
    ),
  },
};

export const ItemStates: Story = {
  args: {
    children: (
      <>
        <MenuItem icon={<SvgIcon icon={pencilIcon} size="small" />}>Normal item</MenuItem>
        <MenuItem icon={<SvgIcon icon={shareIcon} size="small" />} disabled>
          Disabled item
        </MenuItem>
        <MenuItem
          icon={<SvgIcon icon={trashIcon} size="small" className="text-destructive" />}
          className="text-destructive hover:text-destructive"
        >
          Destructive item
        </MenuItem>
        <MenuItem>No icon item</MenuItem>
      </>
    ),
  },
};

export const Interactive: Story = {
  render: () => (
    <MoreOptionsMenu>
      <MenuItem
        icon={<SvgIcon icon={pencilIcon} size="small" />}
        onClick={() => alert('Edit clicked!')}
      >
        Edit
      </MenuItem>
      <MenuItem
        icon={<SvgIcon icon={shareIcon} size="small" />}
        onClick={() => alert('Share clicked!')}
      >
        Share
      </MenuItem>
      <MenuItem
        icon={<SvgIcon icon={trashIcon} size="small" className="text-destructive" />}
        className="text-destructive hover:text-destructive"
        onClick={() => confirm('Are you sure you want to delete?')}
      >
        Delete
      </MenuItem>
    </MoreOptionsMenu>
  ),
};
