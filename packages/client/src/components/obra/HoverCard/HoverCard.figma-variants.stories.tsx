import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';
import * as React from 'react';

const meta: Meta<typeof HoverCard> = {
  component: HoverCard,
  title: 'Figma Variants/HoverCard',
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

// ============================================================================
// Dependent Variants (24 total): side × align × state
// ============================================================================

// TOP variants
export const TopStartClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Top/Start/Closed',
};

export const TopStartOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Top/Start/Open',
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = React.useState(true);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export const TopCenterClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Top/Center/Closed',
};

export const TopCenterOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Top/Center/Open',
  decorators: [
    (Story) => {
      return (
        <div className="flex items-center justify-center min-h-screen hover:block">
          <Story />
        </div>
      );
    },
  ],
};

export const TopEndClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Top/End/Closed',
};

export const TopEndOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'top',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Top/End/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

// RIGHT variants
export const RightStartClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Right/Start/Closed',
};

export const RightStartOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Right/Start/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const RightCenterClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Right/Center/Closed',
};

export const RightCenterOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Right/Center/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const RightEndClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Right/End/Closed',
};

export const RightEndOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'right',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Right/End/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

// BOTTOM variants
export const BottomStartClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Bottom/Start/Closed',
};

export const BottomStartOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Bottom/Start/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const BottomCenterClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Bottom/Center/Closed',
};

export const BottomCenterOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Bottom/Center/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const BottomEndClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Bottom/End/Closed',
};

export const BottomEndOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Bottom/End/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

// LEFT variants
export const LeftStartClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Left/Start/Closed',
};

export const LeftStartOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'start',
    children: 'Hover card content',
  },
  name: 'Left/Start/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const LeftCenterClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Left/Center/Closed',
};

export const LeftCenterOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Left/Center/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const LeftEndClosed: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Left/End/Closed',
};

export const LeftEndOpen: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'left',
    align: 'end',
    children: 'Hover card content',
  },
  name: 'Left/End/Open',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};

// ============================================================================
// Independent Axis Variations (6 total)
// ============================================================================

// Trigger variations (at side=bottom, align=center, state=closed)
export const TriggerButtonElement: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Trigger/Button',
};

export const TriggerLinkElement: Story = {
  args: {
    trigger: <a href="#" className="px-4 py-2 text-blue-500 underline">Hover link</a>,
    side: 'bottom',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Trigger/Link',
};

export const TriggerSpanElement: Story = {
  args: {
    trigger: <span className="px-4 py-2 text-foreground cursor-help">Hover text</span>,
    side: 'bottom',
    align: 'center',
    children: 'Hover card content',
  },
  name: 'Trigger/Span',
};

// Content variations (at side=bottom, align=center, state=closed)
export const ContentSimpleText: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: 'Simple text',
  },
  name: 'Content/SimpleText',
};

export const ContentRichFormatted: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: (
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-sm">Rich Content</div>
        <div className="text-xs text-slate-600">Multiple lines</div>
        <div className="text-xs text-slate-500">With formatting</div>
      </div>
    ),
  },
  name: 'Content/RichFormatted',
};

// Custom styling variation (at side=bottom, align=center, state=open)
export const CustomStyling: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    side: 'bottom',
    align: 'center',
    children: 'Custom styled content',
    className: 'bg-purple-50 border-purple-200',
  },
  name: 'Styling/CustomColors',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="group">
          <Story />
        </div>
      </div>
    ),
  ],
};
