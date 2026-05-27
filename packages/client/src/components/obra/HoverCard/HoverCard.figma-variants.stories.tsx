import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';

const meta = {
  title: 'Figma Variants/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper components for trigger and content
const SimpleButton = () => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
);

const SimpleContent = () => <div className="text-sm">Simple text content</div>;

const RichContent = () => (
  <div className="flex flex-col gap-2">
    <div className="font-semibold text-sm">Alex Morgan</div>
    <div className="text-xs text-slate-600">Software Engineer</div>
    <div className="text-xs text-slate-500">Joined 2 years ago</div>
  </div>
);

const CustomButton = () => (
  <button className="px-4 py-2 bg-purple-500 text-white rounded">Custom</button>
);

const LinkTrigger = () => (
  <a href="#" className="text-blue-600 underline hover:text-blue-800">
    Link trigger
  </a>
);

const SpanTrigger = () => (
  <span className="px-4 py-2 bg-gray-500 text-white inline-block rounded cursor-pointer">
    Span trigger
  </span>
);

// Dependent axis combinations: Side × Align × State

// TOP/START
export const SideTopAlignStartStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'start',
  },
};

export const SideTopAlignStartStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'start',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// TOP/CENTER
export const SideTopAlignCenterStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'center',
  },
};

export const SideTopAlignCenterStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'center',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// TOP/END
export const SideTopAlignEndStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'end',
  },
};

export const SideTopAlignEndStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'top',
    align: 'end',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// RIGHT/START
export const SideRightAlignStartStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'start',
  },
};

export const SideRightAlignStartStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'start',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// RIGHT/CENTER
export const SideRightAlignCenterStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'center',
  },
};

export const SideRightAlignCenterStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'center',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// RIGHT/END
export const SideRightAlignEndStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'end',
  },
};

export const SideRightAlignEndStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'right',
    align: 'end',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// BOTTOM/START
export const SideBottomAlignStartStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'start',
  },
};

export const SideBottomAlignStartStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'start',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// BOTTOM/CENTER
export const SideBottomAlignCenterStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'center',
  },
};

export const SideBottomAlignCenterStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'center',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// BOTTOM/END
export const SideBottomAlignEndStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'end',
  },
};

export const SideBottomAlignEndStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'end',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// LEFT/START
export const SideLeftAlignStartStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'start',
  },
};

export const SideLeftAlignStartStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'start',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// LEFT/CENTER
export const SideLeftAlignCenterStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'center',
  },
};

export const SideLeftAlignCenterStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'center',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// LEFT/END
export const SideLeftAlignEndStateClosed: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'end',
  },
};

export const SideLeftAlignEndStateOpen: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <SimpleContent />,
    side: 'left',
    align: 'end',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="button"], button') as HTMLElement;
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
};

// Independent axis variations (at default dependent values: side=bottom, align=center, state=closed)

export const TriggerLink: Story = {
  args: {
    trigger: <LinkTrigger />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'center',
  },
};

export const TriggerSpan: Story = {
  args: {
    trigger: <SpanTrigger />,
    children: <SimpleContent />,
    side: 'bottom',
    align: 'center',
  },
};

export const ContentRichFormatted: Story = {
  args: {
    trigger: <SimpleButton />,
    children: <RichContent />,
    side: 'bottom',
    align: 'center',
  },
};

export const CustomStyling: Story = {
  args: {
    trigger: <CustomButton />,
    children: <SimpleContent />,
    className: 'bg-purple-50 border-purple-200',
    side: 'bottom',
    align: 'center',
  },
};
