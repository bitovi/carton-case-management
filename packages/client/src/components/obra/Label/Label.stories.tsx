import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'Obra/Label',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9453&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithInput: Story = {
  args: {
    layout: 'block',
    children: 'Email address',
    htmlFor: 'email',
  },
  render: (args) => (
    <div className="space-y-2 w-64">
      <Label {...args} />
      <input
        id="email"
        type="email"
        placeholder="email@example.com"
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      />
    </div>
  ),
};

export const Required: Story = {
  args: {
    layout: 'block',
    htmlFor: 'password',
  },
  render: (args) => (
    <div className="space-y-2 w-64">
      <Label {...args}>
        Password <span className="text-destructive">*</span>
      </Label>
      <input
        id="password"
        type="password"
        placeholder="Enter password"
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    layout: 'block',
    children: 'Disabled field',
    htmlFor: 'disabled-input',
  },
  render: (args) => (
    <div className="space-y-2 w-64">
      <Label {...args} />
      <input
        id="disabled-input"
        type="text"
        disabled
        placeholder="Disabled input"
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      />
    </div>
  ),
};

