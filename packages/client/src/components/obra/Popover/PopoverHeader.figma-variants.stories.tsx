import type { Meta, StoryObj } from '@storybook/react';
import { PopoverHeader } from './PopoverHeader';

// # 6 Get Component Context and Implement in Figma
// ## 6.1 Get Component Context
// ### 6.1.2 Generate Variant Stories

const meta: Meta<typeof PopoverHeader> = {
  component: PopoverHeader,
  title: 'Figma Variants/PopoverHeader',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A header component for Popover content with title and optional description.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2322-135488',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopoverHeader>;

// ============================================================================
// VARIANT: WithDescription
// ============================================================================

export const WithDescription: Story = {
  args: {
    title: 'Popover Title',
    description: 'This is an optional description that provides additional context.',
  },
  parameters: {
    docs: {
      description: {
        story: 'PopoverHeader with both title and description. Description is optional and creates a two-line layout.',
      },
    },
  },
};

// ============================================================================
// VARIANT: WithoutDescription
// ============================================================================

export const WithoutDescription: Story = {
  args: {
    title: 'Popover Title',
  },
  parameters: {
    docs: {
      description: {
        story: 'PopoverHeader with title only. No description text is rendered.',
      },
    },
  },
};
