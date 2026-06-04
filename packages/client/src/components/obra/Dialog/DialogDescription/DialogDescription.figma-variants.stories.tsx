import type { Meta, StoryObj } from '@storybook/react';
import { DialogDescription } from './DialogDescription';

const meta = {
  title: 'Figma Variants/DialogDescription',
  component: DialogDescription,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'DialogDescription is a screen-reader-only wrapper component that renders with sr-only styling. It has no visual representation in the UI and is used solely for semantic HTML and screen reader announcements.',
      },
    },
  },
} as Meta<typeof DialogDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dependent axis: none (only 1 default combination)
export const Default: Story = {
  args: {
    children: 'Description',
  },
};

// Independent properties
export const WithCustomChildren: Story = {
  args: {
    children: 'This is a custom description text that provides more context about the dialog.',
  },
};

export const WithEmptyChildren: Story = {
  args: {
    children: '',
  },
};

export const WithLongChildren: Story = {
  args: {
    children:
      'This is a very long description that explains in detail what the dialog is about. It contains multiple sentences and provides comprehensive information to screen reader users about the purpose and content of the modal dialog.',
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: 'Description',
    className: 'custom-class',
  },
};
