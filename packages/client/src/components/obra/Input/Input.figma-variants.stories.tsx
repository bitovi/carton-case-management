import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, AlertCircle } from 'lucide-react';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Figma Variants/Input',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=0-0',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ============================================================================
// REPRESENTATIVE SET — 10 Core Variants (one value per axis)
// ============================================================================

// Baseline (all defaults)
export const RegularDefaultNoErrorResting: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Regular | Roundness: Default | Error: No | State: Default',
};

// Size axis variants
export const MiniDefaultNoErrorResting: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Mini | Roundness: Default | Error: No | State: Default',
};

export const SmallDefaultNoErrorResting: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Small | Roundness: Default | Error: No | State: Default',
};

export const LargeDefaultNoErrorResting: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Large | Roundness: Default | Error: No | State: Default',
};

// Roundness axis variant
export const RegularRoundNoErrorResting: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Regular | Roundness: Round | Error: No | State: Default',
};

// Error axis variant
export const RegularDefaultWithErrorResting: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Enter text...',
  },
  name: 'Size: Regular | Roundness: Default | Error: Yes | State: Default',
};

// State axis variants
export const RegularDefaultNoErrorDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    disabled: true,
  },
  name: 'Size: Regular | Roundness: Default | Error: No | State: Disabled',
};

export const RegularDefaultNoErrorFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    autoFocus: true,
  },
  name: 'Size: Regular | Roundness: Default | Error: No | State: Focus',
  decorators: [
    (Story) => (
      <div className="p-4 bg-slate-50 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const RegularDefaultNoErrorHover: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Size: Regular | Roundness: Default | Error: No | State: Hover',
  decorators: [
    (Story) => (
      <style>{`
        [data-testid="input-hover"] {
          opacity: 1;
        }
        [data-testid="input-hover"] input {
          border-color: hsl(var(--foreground));
          background-color: hsl(var(--background));
        }
      `}</style>
    ),
  ],
};

// ============================================================================
// INDEPENDENT AXES — Decoration and Content Variations
// ============================================================================

export const RegularDefaultNoErrorWithLeftDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Search...',
    leftDecoration: <Search className="w-4 h-4 text-muted-foreground" />,
  },
  name: 'Size: Regular | Roundness: Default | Error: No | With: Left Decoration',
};

export const RegularDefaultNoErrorWithRightDecoration: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    rightDecoration: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
  },
  name: 'Size: Regular | Roundness: Default | Error: No | With: Right Decoration',
};

export const RegularDefaultNoErrorWithBothDecorations: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Search...',
    leftDecoration: <Search className="w-4 h-4 text-muted-foreground" />,
    rightDecoration: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
  },
  name: 'Size: Regular | Roundness: Default | Error: No | With: Both Decorations',
};

export const RegularDefaultNoErrorWithCustomPlaceholder: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Email address',
  },
  name: 'Size: Regular | Roundness: Default | Error: No | With: Custom Placeholder',
};

// ============================================================================
// ADDITIONAL COMBINATIONS — Important State + Property Combinations
// ============================================================================

export const MiniRoundWithErrorDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'round',
    error: true,
    placeholder: 'Enter text...',
    disabled: true,
  },
  name: 'Size: Mini | Roundness: Round | Error: Yes | State: Disabled',
};

export const LargeRoundWithErrorResting: Story = {
  args: {
    size: 'large',
    roundness: 'round',
    error: true,
    placeholder: 'Enter text...',
  },
  name: 'Size: Large | Roundness: Round | Error: Yes | State: Default',
};

export const SmallDefaultWithErrorAndLeftDecoration: Story = {
  args: {
    size: 'small',
    roundness: 'default',
    error: true,
    placeholder: 'Enter text...',
    leftDecoration: <AlertCircle className="w-4 h-4 text-destructive" />,
  },
  name: 'Size: Small | Roundness: Default | Error: Yes | With: Left Decoration',
};

// ============================================================================
// COMPREHENSIVE STATE MATRIX — Key Size × Roundness × Error × State
// ============================================================================

export const MiniDefaultNoErrorDisabled: Story = {
  args: {
    size: 'mini',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    disabled: true,
  },
  name: 'Size: Mini | Roundness: Default | Error: No | State: Disabled',
};

export const SmallRoundWithErrorDisabled: Story = {
  args: {
    size: 'small',
    roundness: 'round',
    error: true,
    placeholder: 'Enter text...',
    disabled: true,
  },
  name: 'Size: Small | Roundness: Round | Error: Yes | State: Disabled',
};

export const LargeDefaultWithErrorDisabled: Story = {
  args: {
    size: 'large',
    roundness: 'default',
    error: true,
    placeholder: 'Enter text...',
    disabled: true,
  },
  name: 'Size: Large | Roundness: Default | Error: Yes | State: Disabled',
};

export const RegularRoundWithErrorFocus: Story = {
  args: {
    size: 'regular',
    roundness: 'round',
    error: true,
    placeholder: 'Enter text...',
    autoFocus: true,
  },
  name: 'Size: Regular | Roundness: Round | Error: Yes | State: Focus',
  decorators: [
    (Story) => (
      <div className="p-4 bg-slate-50 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// TYPE VARIATIONS
// ============================================================================

export const TypePassword: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter password...',
    type: 'password',
  },
  name: 'Size: Regular | Roundness: Default | Error: No | Type: Password',
};

export const TypeEmail: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter email...',
    type: 'email',
  },
  name: 'Size: Regular | Roundness: Default | Error: No | Type: Email',
};

// ============================================================================
// INTERACTIVE STATES
// ============================================================================

export const InteractiveDefault: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
  },
  name: 'Interactive: Default',
};

export const InteractiveWithValue: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    defaultValue: 'Sample text',
  },
  name: 'Interactive: With Value',
};

export const InteractiveError: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: true,
    placeholder: 'Enter text...',
    defaultValue: 'Invalid input',
  },
  name: 'Interactive: Error State',
};

export const InteractiveDisabled: Story = {
  args: {
    size: 'regular',
    roundness: 'default',
    error: false,
    placeholder: 'Enter text...',
    disabled: true,
    defaultValue: 'Disabled',
  },
  name: 'Interactive: Disabled',
};
