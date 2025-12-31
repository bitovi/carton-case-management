import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Gauge, Folder, ListTodo, Calendar, Users, FileText, BarChart, Settings } from 'lucide-react';
import { MenuList } from './MenuList';

const meta: Meta<typeof MenuList> = {
  component: MenuList,
  title: 'Components/MenuList',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ minHeight: '600px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: <Gauge size={20} />, isActive: true },
  { id: 'cases', label: 'Cases', path: '/cases', icon: <Folder size={20} /> },
  { id: 'tasks', label: 'Tasks', path: '/tasks', icon: <ListTodo size={20} /> },
  { id: 'calendar', label: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
  { id: 'clients', label: 'Clients', path: '/clients', icon: <Users size={20} /> },
  { id: 'documents', label: 'Documents', path: '/documents', icon: <FileText size={20} /> },
  { id: 'reports', label: 'Reports', path: '/reports', icon: <BarChart size={20} /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

/**
 * Default collapsed state - menu starts collapsed on every page load.
 * Desktop viewport (≥1024px) shows vertical icon-only navigation.
 */
export const DefaultCollapsed: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

/**
 * Desktop view showing the collapsible menu.
 * Users can click the expand button to see text labels.
 */
export const Desktop: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

/**
 * Mobile view (< 1024px) - shows horizontal navigation bar with active item.
 * Collapse/expand controls are hidden on mobile.
 */
export const Mobile: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
  },
};
