// type import removed:  Meta, StoryObj  from '@storybook/react';
import { Edit2, Trash2, Share2, UserCircle } from 'lucide-react';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Button } from '@/components/obra/Button';

const meta = {
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



export const Default = {
  args: {
    children: (
      <>
        <MenuItem icon={<Edit2 className="h-4 w-4" />}>Edit</MenuItem>
        <MenuItem icon={<Share2 className="h-4 w-4" />}>Share</MenuItem>
        <MenuItem icon={<Trash2 className="h-4 w-4 text-destructive" />} className="text-destructive hover:text-destructive">Delete</MenuItem>
      </>
    ),
  },
};


export const Active = {
  args: {
    ...Default.args,
    open: true,
  },
};


export const WithAvatarTrigger = {
  args: {
    trigger: (
      <Button variant="ghost" size="small" roundness="round">
        <UserCircle className="h-5 w-5" />
      </Button>
    ),
    children: (
      <>
        <MenuItem icon={<UserCircle className="h-4 w-4" />}>Profile</MenuItem>
        <MenuItem icon={<Edit2 className="h-4 w-4" />}>Settings</MenuItem>
        <MenuItem>Sign out</MenuItem>
      </>
    ),
  },
};


export const WithButtonTrigger = {
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


export const Positioning = {
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


export const CustomColors = {
  args: {
    children: (
      <>
        <MenuItem icon={<Edit2 className="h-4 w-4 text-blue-600" />}>
          <span className="text-blue-600">Custom Blue</span>
        </MenuItem>
        <MenuItem icon={<Share2 className="h-4 w-4 text-green-600" />}>
          <span className="text-green-600">Custom Green</span>
        </MenuItem>
        <MenuItem icon={<Trash2 className="h-4 w-4 text-red-600" />}>
          <span className="text-red-600">Custom Red (Non-destructive)</span>
        </MenuItem>
      </>
    ),
  },
};

export const ItemStates = {
  args: {
    children: (
      <>
        <MenuItem icon={<Edit2 className="h-4 w-4" />}>Normal item</MenuItem>
        <MenuItem icon={<Share2 className="h-4 w-4" />} disabled>Disabled item</MenuItem>
        <MenuItem icon={<Trash2 className="h-4 w-4 text-destructive" />} className="text-destructive hover:text-destructive">Destructive item</MenuItem>
        <MenuItem>No icon item</MenuItem>
      </>
    ),
  },
};


export const Interactive = {
  render: () => (
    <MoreOptionsMenu>
      <MenuItem 
        icon={<Edit2 className="h-4 w-4" />}
        onClick={() => alert('Edit clicked!')}
      >
        Edit
      </MenuItem>
      <MenuItem 
        icon={<Share2 className="h-4 w-4" />}
        onClick={() => alert('Share clicked!')}
      >
        Share
      </MenuItem>
      <MenuItem 
        icon={<Trash2 className="h-4 w-4 text-destructive" />}
        className="text-destructive hover:text-destructive"
        onClick={() => confirm('Are you sure you want to delete?')}
      >
        Delete
      </MenuItem>
    </MoreOptionsMenu>
  ),
};
