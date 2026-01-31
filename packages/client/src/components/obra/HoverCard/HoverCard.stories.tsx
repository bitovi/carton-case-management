import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';

const meta: Meta<typeof HoverCard> = {
  component: HoverCard,
  title: 'Obra/HoverCard',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246487',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <div className="text-sm">This is a hover card with default settings</div>,
  },
  name: 'Default',
};

export const RichContent: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">User info</button>,
    children: (
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-sm">Alex Morgan</div>
        <div className="text-xs text-slate-600">Software Engineer</div>
        <div className="text-xs text-slate-500">Joined 2 years ago</div>
      </div>
    ),
  },
  name: 'Rich Content',
};

export const SideTop: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>,
    side: 'top',
    children: <div className="text-sm">Appears on top</div>,
  },
  name: 'Position: Top',
};

export const SideRight: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>,
    side: 'right',
    children: <div className="text-sm">Appears on right</div>,
  },
  name: 'Position: Right',
};

export const SideBottom: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Bottom</button>,
    side: 'bottom',
    children: <div className="text-sm">Appears on bottom</div>,
  },
  name: 'Position: Bottom',
};

export const SideLeft: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>,
    side: 'left',
    children: <div className="text-sm">Appears on left</div>,
  },
  name: 'Position: Left',
};

export const AlignStart: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Start</button>,
    align: 'start',
    children: <div className="text-sm">Aligned to start</div>,
  },
  name: 'Align: Start',
};

export const AlignCenter: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Center</button>,
    align: 'center',
    children: <div className="text-sm">Aligned to center</div>,
  },
  name: 'Align: Center',
};

export const AlignEnd: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">End</button>,
    align: 'end',
    children: <div className="text-sm">Aligned to end</div>,
  },
  name: 'Align: End',
};

export const QuickOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-green-500 text-white rounded">Quick open</button>,
    openDelay: 200,
    closeDelay: 100,
    children: <div className="text-sm">Opens quickly (200ms delay)</div>,
  },
  name: 'Quick Open',
};

export const SlowOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-orange-500 text-white rounded">Slow open</button>,
    openDelay: 1000,
    closeDelay: 500,
    children: <div className="text-sm">Opens slowly (1000ms delay)</div>,
  },
  name: 'Slow Open',
};

export const CustomStyling: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-purple-500 text-white rounded">Custom</button>,
    className: 'bg-purple-50 border-purple-200',
    children: (
      <div className="text-sm text-purple-900">
        Custom styled hover card with purple theme
      </div>
    ),
  },
  name: 'Custom Styling',
};

export const LinkTrigger: Story = {
  args: {
    trigger: (
      <a href="#" className="text-blue-600 underline hover:text-blue-800">
        Hover over this link
      </a>
    ),
    children: (
      <div className="text-sm">
        This hover card is triggered by a link element
      </div>
    ),
  },
  name: 'Link Trigger',
};

export const WithImage: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Profile</button>,
    children: (
      <div className="flex flex-col gap-2">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full" />
        <div className="font-semibold text-sm">Taylor Swift</div>
        <div className="text-xs text-slate-600">Product Designer</div>
      </div>
    ),
  },
  name: 'With Image',
};
