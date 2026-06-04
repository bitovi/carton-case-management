import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

const meta = {
  title: 'Figma Variants/Link',
  component: Link,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateDefault: Story = {
  args: {
    to: '/example',
    children: 'Link',
  },
};

export const StateHover: Story = {
  args: {
    to: '/example',
    children: 'Link',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('a') || canvasElement.firstElementChild;
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (el as HTMLElement).classList.add('hover');
    }
  },
};

export const StateFocus: Story = {
  args: {
    to: '/example',
    children: 'Link',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('a') || canvasElement.firstElementChild;
    if (el) {
      (el as HTMLElement).focus();
    }
  },
};

export const StateActive: Story = {
  args: {
    to: '/example',
    children: 'Link',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('a') || canvasElement.firstElementChild;
    if (el) {
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      (el as HTMLElement).classList.add('active');
    }
  },
};

export const StateVisited: Story = {
  args: {
    to: '/example',
    children: 'Link',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('a') || canvasElement.firstElementChild;
    if (el) {
      (el as HTMLElement).classList.add('visited');
    }
  },
};
