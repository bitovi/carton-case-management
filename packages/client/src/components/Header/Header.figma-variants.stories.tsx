import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const meta = {
  title: 'Figma Variants/Header',
  component: Header,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'responsive' },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateDefaultLayoutDesktopMenuClosed: Story = {};

export const StateHoverLayoutDesktopMenuClosed: Story = {
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const StateFocusLayoutDesktopMenuClosed: Story = {
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) (link as HTMLElement).focus();
  },
};

export const StateDefaultLayoutDesktopMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label="User menu"]');
    if (btn) (btn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 500));
  },
};

export const StateHoverLayoutDesktopMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label="User menu"]');
    if (btn) (btn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 500));
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const StateFocusLayoutDesktopMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label="User menu"]');
    if (btn) (btn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 500));
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) (link as HTMLElement).focus();
  },
};

export const StateDefaultLayoutMobileMenuClosed: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const StateHoverLayoutMobileMenuClosed: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const StateDefaultLayoutMobileMenuOpen: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label="User menu"]');
    if (btn) (btn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 500));
  },
};

export const StateFocusLayoutMobileMenuOpen: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label="User menu"]');
    if (btn) (btn as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 500));
    const link = canvasElement.querySelector('a[aria-label="Navigate to home"]');
    if (link) (link as HTMLElement).focus();
  },
};

export const UserInitialsJd: Story = {
  args: {
    userInitials: 'JD',
  },
};
