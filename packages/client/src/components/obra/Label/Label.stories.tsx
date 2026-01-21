import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Obra/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=279-98209',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['block', 'inline'],
      description: 'Layout variant for the label',
      table: {
        defaultValue: { summary: 'block' },
      },
    },
    children: {
      control: 'text',
      description: 'Label text content',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the associated form control',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * Block layout (default)
 * Figma node: 16:1663
 */
export const Block: Story = {
  args: {
    children: 'Label',
    layout: 'block',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=16:1663',
    },
  },
};

/**
 * Inline layout
 * Figma node: 103:9452
 */
export const Inline: Story = {
  args: {
    children: 'Label',
    layout: 'inline',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=103:9452',
    },
  },
};

/**
 * Default story (block layout)
 */
export const Default: Story = {
  args: {
    children: 'Email address',
  },
};

/**
 * With form input example
 */
export const WithInput: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  ),
};

/**
 * Inline with checkbox example
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <input type="checkbox" id="terms" className="h-4 w-4" />
      <Label htmlFor="terms" layout="inline">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

/**
 * Multiple labels in a form
 */
export const FormExample: Story = {
  render: () => (
    <form className="grid gap-4 w-[300px]">
      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-form">Email address</Label>
        <input
          id="email-form"
          type="email"
          placeholder="john@example.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="newsletter" className="h-4 w-4" />
        <Label htmlFor="newsletter" layout="inline">
          Subscribe to newsletter
        </Label>
      </div>
    </form>
  ),
};

/**
 * Disabled state (peer-disabled styling)
 */
export const WithDisabledInput: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="disabled-input">Disabled field</Label>
      <input
        id="disabled-input"
        type="text"
        disabled
        placeholder="Cannot edit"
        className="peer flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  ),
};
