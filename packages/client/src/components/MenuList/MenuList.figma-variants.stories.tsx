import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { MenuList } from './MenuList';
import { House, Users, Settings, LogOut } from 'lucide-react';

const meta = {
  title: 'Figma Variants/MenuList',
  component: MenuList,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        desktopLg: { name: 'Desktop (lg)', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta<typeof MenuList>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleNoIcon = [
  { id: '1', label: 'Dashboard', path: '/dashboard', isActive: false },
];

const singleNoIconActive = [
  { id: '1', label: 'Dashboard', path: '/dashboard', isActive: true },
];

const singleWithIcon = [
  { id: '1', label: 'Dashboard', path: '/dashboard', icon: <House size={16} />, isActive: false },
];

const singleWithIconActive = [
  { id: '1', label: 'Dashboard', path: '/dashboard', icon: <House size={16} />, isActive: true },
];

const multipleNoIcon = [
  { id: '1', label: 'Dashboard', path: '/dashboard', isActive: false },
  { id: '2', label: 'Cases', path: '/cases', isActive: false },
  { id: '3', label: 'Settings', path: '/settings', isActive: false },
];

const multipleNoIconFirstActive = [
  { id: '1', label: 'Dashboard', path: '/dashboard', isActive: true },
  { id: '2', label: 'Cases', path: '/cases', isActive: false },
  { id: '3', label: 'Settings', path: '/settings', isActive: false },
];

const multipleWithIcon = [
  { id: '1', label: 'Dashboard', path: '/dashboard', icon: <House size={16} />, isActive: false },
  { id: '2', label: 'Cases', path: '/cases', icon: <Users size={16} />, isActive: false },
  { id: '3', label: 'Settings', path: '/settings', icon: <Settings size={16} />, isActive: false },
  { id: '4', label: 'Logout', path: '/logout', icon: <LogOut size={16} />, isActive: false },
];

const multipleWithIconFirstActive = [
  { id: '1', label: 'Dashboard', path: '/dashboard', icon: <House size={16} />, isActive: true },
  { id: '2', label: 'Cases', path: '/cases', icon: <Users size={16} />, isActive: false },
  { id: '3', label: 'Settings', path: '/settings', icon: <Settings size={16} />, isActive: false },
  { id: '4', label: 'Logout', path: '/logout', icon: <LogOut size={16} />, isActive: false },
];

const mobileParams = { viewport: { defaultViewport: 'mobile' } };
const desktopParams = { viewport: { defaultViewport: 'desktopLg' } };

export const LayoutMobileItemCountOneItemStateDefaultHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: mobileParams,
};

export const LayoutMobileItemCountOneItemStateDefaultHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: mobileParams,
};

export const LayoutMobileItemCountOneItemStateActiveHasIconFalse: Story = {
  args: { items: singleNoIconActive },
  parameters: mobileParams,
};

export const LayoutMobileItemCountOneItemStateActiveHasIconTrue: Story = {
  args: { items: singleWithIconActive },
  parameters: mobileParams,
};

export const LayoutMobileItemCountOneItemStateHoverHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutMobileItemCountOneItemStateHoverHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutMobileItemCountOneItemStateFocusHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutMobileItemCountOneItemStateFocusHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutMobileItemCountMultipleItemStateDefaultHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: mobileParams,
};

export const LayoutMobileItemCountMultipleItemStateDefaultHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: mobileParams,
};

export const LayoutMobileItemCountMultipleItemStateActiveHasIconFalse: Story = {
  args: { items: multipleNoIconFirstActive },
  parameters: mobileParams,
};

export const LayoutMobileItemCountMultipleItemStateActiveHasIconTrue: Story = {
  args: { items: multipleWithIconFirstActive },
  parameters: mobileParams,
};

export const LayoutMobileItemCountMultipleItemStateHoverHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutMobileItemCountMultipleItemStateHoverHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutMobileItemCountMultipleItemStateFocusHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutMobileItemCountMultipleItemStateFocusHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: mobileParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:first-child a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutDesktopItemCountOneItemStateDefaultHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountOneItemStateDefaultHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountOneItemStateActiveHasIconFalse: Story = {
  args: { items: singleNoIconActive },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountOneItemStateActiveHasIconTrue: Story = {
  args: { items: singleWithIconActive },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountOneItemStateHoverHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutDesktopItemCountOneItemStateHoverHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutDesktopItemCountOneItemStateFocusHasIconFalse: Story = {
  args: { items: singleNoIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutDesktopItemCountOneItemStateFocusHasIconTrue: Story = {
  args: { items: singleWithIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutDesktopItemCountMultipleItemStateDefaultHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountMultipleItemStateDefaultHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountMultipleItemStateActiveHasIconFalse: Story = {
  args: { items: multipleNoIconFirstActive },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountMultipleItemStateActiveHasIconTrue: Story = {
  args: { items: multipleWithIconFirstActive },
  parameters: desktopParams,
};

export const LayoutDesktopItemCountMultipleItemStateHoverHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutDesktopItemCountMultipleItemStateHoverHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) {
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

export const LayoutDesktopItemCountMultipleItemStateFocusHasIconFalse: Story = {
  args: { items: multipleNoIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LayoutDesktopItemCountMultipleItemStateFocusHasIconTrue: Story = {
  args: { items: multipleWithIcon },
  parameters: desktopParams,
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('nav > div:nth-child(2) a');
    if (link) (link as HTMLElement).focus();
  },
};

export const LabelTextCustom: Story = {
  args: {
    items: [
      { id: '1', label: 'My Custom Menu', path: '/custom', icon: <House size={16} />, isActive: false },
      { id: '2', label: 'Another Item', path: '/another', icon: <Users size={16} />, isActive: false },
    ],
  },
  parameters: mobileParams,
};
