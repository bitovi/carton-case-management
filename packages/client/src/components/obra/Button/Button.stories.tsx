import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Trash2, Download } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Obra/Button',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=9-1071&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};


export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const GhostMuted: Story = {
  args: {
    variant: 'ghost-muted',
    children: 'Ghost Muted',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};


export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Regular: Story = {
  args: {
    size: 'regular',
    children: 'Regular',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Mini: Story = {
  args: {
    size: 'mini',
    children: 'Mini',
  },
};


export const DefaultRoundness: Story = {
  args: {
    roundness: 'default',
    children: 'Default Roundness',
  },
};

export const Round: Story = {
  args: {
    roundness: 'round',
    children: 'Round',
  },
};


export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Plus size={16} />,
    children: 'Add Item',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <Download size={16} />,
    children: 'Download',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <Plus size={16} />,
    rightIcon: <Download size={16} />,
    children: 'Add & Download',
  },
};

export const IconOnly: Story = {
  args: {
    leftIcon: <Trash2 size={16} />,
    'aria-label': 'Delete item',
    children: '',
  },
};


export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};


export const LargePrimaryRound: Story = {
  args: {
    size: 'large',
    variant: 'primary',
    roundness: 'round',
    children: 'Get Started',
  },
};

export const SmallOutlineRound: Story = {
  args: {
    size: 'small',
    variant: 'outline',
    roundness: 'round',
    children: 'Tag',
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: 'destructive',
    leftIcon: <Trash2 size={16} />,
    children: 'Delete',
  },
};

export const SecondaryLargeWithIcons: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    leftIcon: <Plus size={16} />,
    rightIcon: <Download size={16} />,
    children: 'Multiple Actions',
  },
};


export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost-muted">Ghost Muted</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end space-x-2">
      <Button size="large">Large</Button>
      <Button size="regular">Regular</Button>
      <Button size="small">Small</Button>
      <Button size="mini">Mini</Button>
    </div>
  ),
};

export const AllRoundness: Story = {
  render: () => (
    <div className="space-x-2">
      <Button roundness="default">Default</Button>
      <Button roundness="round">Round</Button>
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Large</h3>
        <div className="space-x-2">
          <Button size="large" variant="primary">
            Primary
          </Button>
          <Button size="large" variant="secondary">
            Secondary
          </Button>
          <Button size="large" variant="outline">
            Outline
          </Button>
          <Button size="large" variant="ghost">
            Ghost
          </Button>
          <Button size="large" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="large" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Regular</h3>
        <div className="space-x-2">
          <Button size="regular" variant="primary">
            Primary
          </Button>
          <Button size="regular" variant="secondary">
            Secondary
          </Button>
          <Button size="regular" variant="outline">
            Outline
          </Button>
          <Button size="regular" variant="ghost">
            Ghost
          </Button>
          <Button size="regular" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="regular" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Small</h3>
        <div className="space-x-2">
          <Button size="small" variant="primary">
            Primary
          </Button>
          <Button size="small" variant="secondary">
            Secondary
          </Button>
          <Button size="small" variant="outline">
            Outline
          </Button>
          <Button size="small" variant="ghost">
            Ghost
          </Button>
          <Button size="small" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="small" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Mini</h3>
        <div className="space-x-2">
          <Button size="mini" variant="primary">
            Primary
          </Button>
          <Button size="mini" variant="secondary">
            Secondary
          </Button>
          <Button size="mini" variant="outline">
            Outline
          </Button>
          <Button size="mini" variant="ghost">
            Ghost
          </Button>
          <Button size="mini" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="mini" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
    </div>
  ),
};

