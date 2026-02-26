import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { SvgIcon } from '@progress/kendo-react-common';
import { homeIcon, gearIcon, tellAFriendIcon } from '@progress/kendo-svg-icons';
import { MenuList } from './MenuList';

const meta: Meta<typeof MenuList> = {
  component: MenuList,
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

const mockItems = [
  { id: 'home', label: 'Home', path: '/', icon: <SvgIcon icon={homeIcon} size="medium" /> },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <SvgIcon icon={gearIcon} size="medium" />,
  },
  {
    id: 'users',
    label: 'Users',
    path: '/users',
    icon: <SvgIcon icon={tellAFriendIcon} size="medium" />,
  },
];

export const Desktop: Story = {
  args: {
    items: mockItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export const Mobile: Story = {
  args: {
    items: mockItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', path: '/', icon: <SvgIcon icon={homeIcon} size="large" /> },
    ],
  },
};

export const WithActiveItem: Story = {
  args: {
    items: mockItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    })),
  },
};
