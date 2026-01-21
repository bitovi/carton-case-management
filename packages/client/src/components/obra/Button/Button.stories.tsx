import type { Meta, StoryObj } from '@storybook/react';
import { Plus, ChevronRight, Trash2, Mail, Download } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Obra/Button',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=273-30945&m=dev',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xs'],
      description: 'Size variant',
    },
    roundness: {
      control: 'select',
      options: ['default', 'round'],
      description: 'Border radius style',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// =============================================================================
// DEFAULT STATE
// =============================================================================

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// =============================================================================
// VARIANT STORIES (Figma: Variant)
// =============================================================================

export const VariantPrimary: Story = {
  name: 'Variant: Primary (Default)',
  args: {
    variant: 'default',
    children: 'Primary',
  },
};

export const VariantSecondary: Story = {
  name: 'Variant: Secondary',
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const VariantOutline: Story = {
  name: 'Variant: Outline',
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const VariantGhost: Story = {
  name: 'Variant: Ghost',
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const VariantDestructive: Story = {
  name: 'Variant: Destructive',
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const AllVariants: Story = {
  name: 'All Variants Comparison',
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

// =============================================================================
// SIZE STORIES (Figma: Size)
// =============================================================================

export const SizeDefault: Story = {
  name: 'Size: Default',
  args: {
    size: 'default',
    children: 'Default',
  },
};

export const SizeLarge: Story = {
  name: 'Size: Large',
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const SizeSmall: Story = {
  name: 'Size: Small',
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const SizeMini: Story = {
  name: 'Size: Mini',
  args: {
    size: 'xs',
    children: 'Mini',
  },
};

export const AllSizes: Story = {
  name: 'All Sizes Comparison',
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Mini</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// =============================================================================
// ROUNDNESS STORIES (Figma: Roundness)
// =============================================================================

export const RoundnessDefault: Story = {
  name: 'Roundness: Default',
  args: {
    roundness: 'default',
    children: 'Default',
  },
};

export const RoundnessRound: Story = {
  name: 'Roundness: Round (Pill)',
  args: {
    roundness: 'round',
    children: 'Round',
  },
};

export const AllRoundness: Story = {
  name: 'Roundness Comparison',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Default</span>
        <Button roundness="default">Default</Button>
        <Button roundness="default" variant="outline">
          Outline
        </Button>
        <Button roundness="default" variant="secondary">
          Secondary
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Round</span>
        <Button roundness="round">Round</Button>
        <Button roundness="round" variant="outline">
          Outline
        </Button>
        <Button roundness="round" variant="secondary">
          Secondary
        </Button>
      </div>
    </div>
  ),
};

// =============================================================================
// STATE STORIES (Figma: State)
// =============================================================================

export const StateDisabled: Story = {
  name: 'State: Disabled',
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const StateLoading: Story = {
  name: 'State: Loading',
  args: {
    loading: true,
    children: 'Loading',
  },
};

export const AllStates: Story = {
  name: 'All States Comparison',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(
        (variant) => (
          <div key={variant} className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground capitalize">
              {variant}
            </span>
            <Button variant={variant}>Default</Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} loading>
              Loading
            </Button>
          </div>
        )
      )}
    </div>
  ),
};

// =============================================================================
// ICON STORIES (Figma: Left/Right Icons)
// =============================================================================

export const WithLeftIcon: Story = {
  name: 'With Left Icon',
  args: {
    leftIcon: <Plus />,
    children: 'Add Item',
  },
};

export const WithRightIcon: Story = {
  name: 'With Right Icon',
  args: {
    rightIcon: <ChevronRight />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  name: 'With Both Icons',
  args: {
    leftIcon: <Mail />,
    rightIcon: <ChevronRight />,
    children: 'Send Email',
  },
};

export const IconVariations: Story = {
  name: 'Icon Variations',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={<Plus />}>Add Item</Button>
        <Button rightIcon={<ChevronRight />}>Continue</Button>
        <Button leftIcon={<Download />} rightIcon={<ChevronRight />}>
          Download
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" leftIcon={<Plus />}>
          Add Item
        </Button>
        <Button variant="destructive" leftIcon={<Trash2 />}>
          Delete
        </Button>
        <Button variant="ghost" rightIcon={<ChevronRight />}>
          View More
        </Button>
      </div>
    </div>
  ),
};

// =============================================================================
// COMPREHENSIVE MATRIX (All Variants × All Sizes)
// =============================================================================

export const VariantSizeMatrix: Story = {
  name: 'Variant × Size Matrix',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span className="text-sm font-medium capitalize">{variant}</span>
            <div className="flex items-end gap-4">
              <Button variant={variant} size="xs">
                Mini
              </Button>
              <Button variant={variant} size="sm">
                Small
              </Button>
              <Button variant={variant} size="default">
                Default
              </Button>
              <Button variant={variant} size="lg">
                Large
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  ),
};

export const RoundedVariantSizeMatrix: Story = {
  name: 'Rounded Variant × Size Matrix',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span className="text-sm font-medium capitalize">{variant}</span>
            <div className="flex items-end gap-4">
              <Button variant={variant} size="xs" roundness="round">
                Mini
              </Button>
              <Button variant={variant} size="sm" roundness="round">
                Small
              </Button>
              <Button variant={variant} size="default" roundness="round">
                Default
              </Button>
              <Button variant={variant} size="lg" roundness="round">
                Large
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  ),
};

// =============================================================================
// REAL-WORLD EXAMPLES
// =============================================================================

export const FormActions: Story = {
  name: 'Example: Form Actions',
  render: () => (
    <div className="flex justify-end gap-3 p-4 border rounded-lg">
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </div>
  ),
};

export const DangerZone: Story = {
  name: 'Example: Danger Zone',
  render: () => (
    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
      <div>
        <p className="font-medium">Delete Account</p>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
      </div>
      <Button variant="destructive" leftIcon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
};

export const Toolbar: Story = {
  name: 'Example: Toolbar',
  render: () => (
    <div className="flex gap-1 p-2 border rounded-lg">
      <Button variant="ghost" size="sm">
        File
      </Button>
      <Button variant="ghost" size="sm">
        Edit
      </Button>
      <Button variant="ghost" size="sm">
        View
      </Button>
      <Button variant="ghost" size="sm">
        Help
      </Button>
    </div>
  ),
};
