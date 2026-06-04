import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta = {
  title: 'Figma Variants/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutInlineStateDefault: Story = {
  args: {
    children: 'Label',
    layout: 'inline',
  },
};

export const LayoutInlineStateDisabled: Story = {
  args: {
    children: 'Label',
    layout: 'inline',
  },
  render: (args) => (
    <div>
      <input className="peer" disabled hidden />
      <Label {...args} />
    </div>
  ),
};

export const LayoutBlockStateDefault: Story = {
  args: {
    children: 'Label',
    layout: 'block',
  },
};

export const LayoutBlockStateDisabled: Story = {
  args: {
    children: 'Label',
    layout: 'block',
  },
  render: (args) => (
    <div>
      <input className="peer" disabled hidden />
      <Label {...args} />
    </div>
  ),
};
