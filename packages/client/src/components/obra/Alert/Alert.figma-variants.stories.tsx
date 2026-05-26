import type { Meta, StoryObj } from '@storybook/react';
import { Info, AlertCircle } from 'lucide-react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'Figma Variants/Alert',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=58-5416&t=I5A0QLIu4RNqO53t-4',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Dependent Variant Matrix
export const TypeNeutral: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
  },
};

export const TypeError: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
  },
};

// Independent Axis Combinations - Neutral Type Baseline
export const WithLeftIcon: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: false,
  },
};

export const WithRightIcon: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
  },
};

export const WithDescription: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    description: 'Line 2',
    showLine2: true,
  },
};

export const WithIconAndDescription: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: false,
    description: 'Line 2',
    showLine2: true,
  },
};

export const WithButton: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

export const WithIconAndButton: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: false,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

export const Complete: Story = {
  args: {
    type: 'Neutral',
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: false,
    description: 'Line 2',
    showLine2: true,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

// Error Type Combinations
export const ErrorWithIcon: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
  },
};

export const ErrorWithDescription: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
    description: 'Line 2',
    showLine2: true,
  },
};

export const ErrorWithIconAndDescription: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
    description: 'Line 2',
    showLine2: true,
  },
};

export const ErrorWithButton: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

export const ErrorComplete: Story = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
    description: 'Line 2',
    showLine2: true,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};
