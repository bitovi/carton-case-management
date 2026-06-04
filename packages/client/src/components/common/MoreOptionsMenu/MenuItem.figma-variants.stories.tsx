import type { Meta, StoryObj } from '@storybook/react';
import { Edit2 } from 'lucide-react';
import { MenuItem } from './MoreOptionsMenu';

const meta = {
  title: 'Figma Variants/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateDefault: Story = {
  args: {
    children: 'Menu Item',
    onClick: () => {},
  },
};

export const StateHover: Story = {
  args: {
    children: 'Menu Item',
    onClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      el.classList.add('hover');
    }
  },
};

export const StateFocus: Story = {
  args: {
    children: 'Menu Item',
    onClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button');
    if (el) (el as HTMLElement).focus();
  },
};

export const StateDisabled: Story = {
  args: {
    children: 'Menu Item',
    onClick: () => {},
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Menu Item',
    onClick: () => {},
    icon: <Edit2 className="h-4 w-4" />,
  },
};
