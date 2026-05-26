import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Home, Settings, Users, Plus, Grid, LogOut } from 'lucide-react';
import { MenuList } from './MenuList';
import type { MenuItem } from './types';

const meta: Meta<typeof MenuList> = {
  component: MenuList,
  title: 'Figma Variants/MenuList',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuList>;

// Mock data
const singleItem: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> },
];

const singleItemNoIcon: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/' },
];

const threeItems: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  { id: 'users', label: 'Users', path: '/users', icon: <Users size={20} /> },
];

const threeItemsNoIcon: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'settings', label: 'Settings', path: '/settings' },
  { id: 'users', label: 'Users', path: '/users' },
];

const fiveItems: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  { id: 'users', label: 'Users', path: '/users', icon: <Users size={20} /> },
  { id: 'add', label: 'Add', path: '/add', icon: <Plus size={20} /> },
  { id: 'grid', label: 'Grid', path: '/grid', icon: <Grid size={20} /> },
];

// Desktop Variants
export const DesktopOneNone: Story = {
  args: { items: singleItem },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopOneFirst: Story = {
  args: {
    items: singleItem.map((item) => ({ ...item, isActive: true })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopThreeNone: Story = {
  args: { items: threeItems },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopThreeFirst: Story = {
  args: {
    items: threeItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopThreeLast: Story = {
  args: {
    items: threeItems.map((item, idx) => ({
      ...item,
      isActive: idx === threeItems.length - 1,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopFiveNone: Story = {
  args: { items: fiveItems },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopFiveFirst: Story = {
  args: {
    items: fiveItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

export const DesktopFiveLast: Story = {
  args: {
    items: fiveItems.map((item, idx) => ({
      ...item,
      isActive: idx === fiveItems.length - 1,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};

// Mobile Variants
export const MobileOneNone: Story = {
  args: { items: singleItem },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileOneFirst: Story = {
  args: {
    items: singleItem.map((item) => ({ ...item, isActive: true })),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileThreeNone: Story = {
  args: { items: threeItems },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileThreeFirst: Story = {
  args: {
    items: threeItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileThreeLast: Story = {
  args: {
    items: threeItems.map((item, idx) => ({
      ...item,
      isActive: idx === threeItems.length - 1,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileFiveNone: Story = {
  args: { items: fiveItems },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileFiveFirst: Story = {
  args: {
    items: fiveItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const MobileFiveLast: Story = {
  args: {
    items: fiveItems.map((item, idx) => ({
      ...item,
      isActive: idx === fiveItems.length - 1,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// Independent Axis Variants
export const WithoutIcons: Story = {
  args: {
    items: threeItemsNoIcon.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};
