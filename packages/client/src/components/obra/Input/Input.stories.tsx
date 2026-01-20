import type { Meta, StoryObj } from '@storybook/react';
import { Info, Search, Mail } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Obra/Input',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Community-?node-id=279-98539',
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'sm', 'md', 'lg'],
      description: 'Size variant of the input',
    },
    roundness: {
      control: 'select',
      options: ['default', 'round'],
      description: 'Border radius style',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has a validation error',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// =============================================================================
// DEFAULT STATE
// =============================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter value...',
  },
};

// =============================================================================
// SIZE VARIANTS (Figma: Size)
// =============================================================================

export const SizeMini: Story = {
  name: 'Size: Mini',
  args: {
    size: 'mini',
    placeholder: 'Mini input',
  },
};

export const SizeSmall: Story = {
  name: 'Size: Small',
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const SizeRegular: Story = {
  name: 'Size: Regular (Default)',
  args: {
    size: 'md',
    placeholder: 'Regular input',
  },
};

export const SizeLarge: Story = {
  name: 'Size: Large',
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

export const AllSizes: Story = {
  name: 'All Sizes Comparison',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Mini</span>
        <Input size="mini" placeholder="Mini input" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Small</span>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Regular</span>
        <Input size="md" placeholder="Regular input" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Large</span>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
};

// =============================================================================
// ROUNDNESS VARIANTS (Figma: Roundness)
// =============================================================================

export const RoundnessDefault: Story = {
  name: 'Roundness: Default',
  args: {
    roundness: 'default',
    placeholder: 'Default corners',
  },
};

export const RoundnessRound: Story = {
  name: 'Roundness: Round',
  args: {
    roundness: 'round',
    placeholder: 'Pill-shaped input',
  },
};

export const AllRoundness: Story = {
  name: 'All Roundness Comparison',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Default</span>
        <Input roundness="default" defaultValue="Default corners" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Round</span>
        <Input roundness="round" defaultValue="Pill-shaped" />
      </div>
    </div>
  ),
};

// =============================================================================
// STATE VARIANTS (Figma: State)
// =============================================================================

export const StateEmpty: Story = {
  name: 'State: Empty',
  args: {
    placeholder: '',
  },
};

export const StatePlaceholder: Story = {
  name: 'State: Placeholder',
  args: {
    placeholder: 'Placeholder text',
  },
};

export const StateValue: Story = {
  name: 'State: Value',
  args: {
    defaultValue: 'Entered value',
  },
};

export const StateError: Story = {
  name: 'State: Error',
  args: {
    error: true,
    defaultValue: 'Invalid value',
  },
};

export const StateDisabled: Story = {
  name: 'State: Disabled',
  args: {
    disabled: true,
    defaultValue: 'Disabled input',
  },
};

export const AllStates: Story = {
  name: 'All States Comparison',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Empty</span>
        <Input />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Placeholder</span>
        <Input placeholder="Placeholder" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Value</span>
        <Input defaultValue="Value" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Error</span>
        <Input error defaultValue="Error value" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Disabled</span>
        <Input disabled defaultValue="Disabled" />
      </div>
    </div>
  ),
};

// =============================================================================
// WITH DECORATORS (Figma: Decoration left/right)
// =============================================================================

export const WithLeftIcon: Story = {
  name: 'With Left Icon',
  args: {
    leftDecorator: <Search className="h-4 w-4" />,
    placeholder: 'Search...',
  },
};

export const WithRightIcon: Story = {
  name: 'With Right Icon',
  args: {
    rightDecorator: <Info className="h-4 w-4" />,
    placeholder: 'Enter value...',
  },
};

export const WithBothIcons: Story = {
  name: 'With Both Icons',
  args: {
    leftDecorator: <Mail className="h-4 w-4" />,
    rightDecorator: <Info className="h-4 w-4" />,
    placeholder: 'Email address',
  },
};

export const WithTextPrefix: Story = {
  name: 'With Text Prefix (URL)',
  args: {
    leftDecorator: <span>https://</span>,
    placeholder: 'example.com',
  },
};

export const WithTextPrefixAndSuffix: Story = {
  name: 'With Text Prefix & Suffix (Currency)',
  args: {
    leftDecorator: <span>$</span>,
    rightDecorator: <span>USD</span>,
    placeholder: '0.00',
  },
};

export const URLInputExample: Story = {
  name: 'Example: URL Input',
  args: {
    leftDecorator: <span>https://</span>,
    rightDecorator: <Info className="h-4 w-4" />,
    defaultValue: 'example.com',
  },
};

// =============================================================================
// COMBINED VARIANTS
// =============================================================================

export const RoundWithIcon: Story = {
  name: 'Round with Icon',
  args: {
    roundness: 'round',
    leftDecorator: <Search className="h-4 w-4" />,
    placeholder: 'Search...',
  },
};

export const LargeWithDecorators: Story = {
  name: 'Large with Decorators',
  args: {
    size: 'lg',
    leftDecorator: <Mail className="h-5 w-5" />,
    rightDecorator: <Info className="h-5 w-5" />,
    placeholder: 'Email address',
  },
};

export const MiniRoundError: Story = {
  name: 'Mini + Round + Error',
  args: {
    size: 'mini',
    roundness: 'round',
    error: true,
    defaultValue: 'Error',
  },
};

// =============================================================================
// FIGMA VARIANT MATRIX
// =============================================================================

export const VariantMatrix: Story = {
  name: 'Figma Variant Matrix (Default Roundness)',
  render: () => (
    <div className="space-y-8">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium text-muted-foreground" />
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Regular
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Large
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Small
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Mini
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Empty</td>
            <td className="p-2">
              <Input size="md" />
            </td>
            <td className="p-2">
              <Input size="lg" />
            </td>
            <td className="p-2">
              <Input size="sm" />
            </td>
            <td className="p-2">
              <Input size="mini" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Placeholder</td>
            <td className="p-2">
              <Input size="md" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" placeholder="Value" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Value</td>
            <td className="p-2">
              <Input size="md" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Error</td>
            <td className="p-2">
              <Input size="md" error defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" error defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" error defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" error defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Disabled</td>
            <td className="p-2">
              <Input size="md" disabled defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" disabled defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" disabled defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" disabled defaultValue="Value" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

export const VariantMatrixRound: Story = {
  name: 'Figma Variant Matrix (Round)',
  render: () => (
    <div className="space-y-8">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium text-muted-foreground" />
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Regular
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Large
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Small
            </th>
            <th className="p-2 text-center text-sm font-medium text-muted-foreground">
              Mini
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Empty</td>
            <td className="p-2">
              <Input size="md" roundness="round" />
            </td>
            <td className="p-2">
              <Input size="lg" roundness="round" />
            </td>
            <td className="p-2">
              <Input size="sm" roundness="round" />
            </td>
            <td className="p-2">
              <Input size="mini" roundness="round" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Placeholder</td>
            <td className="p-2">
              <Input size="md" roundness="round" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" roundness="round" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" roundness="round" placeholder="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" roundness="round" placeholder="Value" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Value</td>
            <td className="p-2">
              <Input size="md" roundness="round" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="lg" roundness="round" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="sm" roundness="round" defaultValue="Value" />
            </td>
            <td className="p-2">
              <Input size="mini" roundness="round" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Error</td>
            <td className="p-2">
              <Input
                size="md"
                roundness="round"
                error
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="lg"
                roundness="round"
                error
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="sm"
                roundness="round"
                error
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="mini"
                roundness="round"
                error
                defaultValue="Value"
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm text-muted-foreground">Disabled</td>
            <td className="p-2">
              <Input
                size="md"
                roundness="round"
                disabled
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="lg"
                roundness="round"
                disabled
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="sm"
                roundness="round"
                disabled
                defaultValue="Value"
              />
            </td>
            <td className="p-2">
              <Input
                size="mini"
                roundness="round"
                disabled
                defaultValue="Value"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
