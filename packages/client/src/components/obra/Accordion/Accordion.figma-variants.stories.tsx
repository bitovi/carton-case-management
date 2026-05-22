import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Figma Variants/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to trigger hover state on first trigger
const triggerHoverPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  }
};

// Helper to trigger focus state on first trigger
const triggerFocusPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.focus();
  }
};

// Helper to trigger active state on first trigger
const triggerActivePlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }
};

// ============================================================================
// A1: Type = "single", Collapsible = false
// ============================================================================

export const SingleNonCollapsibleFirstOpen: Story = {
  args: {
    type: 'single',
    collapsible: false,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Is it accessible?',
        content: 'Yes. It adheres to the WAI-ARIA design pattern.',
      },
      {
        value: 'item-2',
        trigger: 'Is it styled?',
        content: 'Yes. It comes with default styles.',
      },
      {
        value: 'item-3',
        trigger: 'Is it animated?',
        content: 'Yes. It is animated by default.',
      },
    ],
  },
};

export const SingleNonCollapsibleAllClosedFirstHover: Story = {
  args: {
    type: 'single',
    collapsible: false,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section',
        content: 'Content for third section',
      },
    ],
  },
  play: triggerHoverPlay,
};

export const SingleNonCollapsibleAllClosedFirstFocus: Story = {
  args: {
    type: 'single',
    collapsible: false,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section',
        content: 'Content for third section',
      },
    ],
  },
  play: triggerFocusPlay,
};

export const SingleNonCollapsibleAllClosedFirstActive: Story = {
  args: {
    type: 'single',
    collapsible: false,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section',
        content: 'Content for third section',
      },
    ],
  },
  play: triggerActivePlay,
};

// ============================================================================
// A2: Type = "single", Collapsible = true
// ============================================================================

export const SingleCollapsibleAllClosed: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section One',
        content: 'Content for section one',
      },
      {
        value: 'item-2',
        trigger: 'Section Two',
        content: 'Content for section two',
      },
      {
        value: 'item-3',
        trigger: 'Section Three',
        content: 'Content for section three',
      },
    ],
  },
};

export const SingleCollapsibleFirstOpenTriggerHover: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section One (Open)',
        content: 'Content for section one',
      },
      {
        value: 'item-2',
        trigger: 'Section Two',
        content: 'Content for section two',
      },
      {
        value: 'item-3',
        trigger: 'Section Three',
        content: 'Content for section three',
      },
    ],
  },
  play: triggerHoverPlay,
};

// ============================================================================
// A3: Type = "multiple"
// ============================================================================

export const MultipleAllOpen: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1', 'item-2', 'item-3'],
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section (Open)',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section (Open)',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section (Open)',
        content: 'Content for third section',
      },
    ],
  },
};

export const MultipleFirstAndThirdOpen: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1', 'item-3'],
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section (Open)',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section (Closed)',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section (Open)',
        content: 'Content for third section',
      },
    ],
  },
};

export const MultipleAllClosedFirstFocus: Story = {
  args: {
    type: 'multiple',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section',
        content: 'Content for third section',
      },
    ],
  },
  play: triggerFocusPlay,
};

// ============================================================================
// C1: Content Type = "text-only"
// ============================================================================

export const TextOnlyShort: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'What is this?',
        content: 'A simple accordion component.',
      },
      {
        value: 'item-2',
        trigger: 'How does it work?',
        content: 'Click to expand and collapse sections.',
      },
      {
        value: 'item-3',
        trigger: 'Is it reusable?',
        content: 'Yes, it is fully reusable and customizable.',
      },
    ],
  },
};

export const TextOnlyLong: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-2',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'What is this?',
        content: 'A simple accordion component.',
      },
      {
        value: 'item-2',
        trigger: 'Tell me more about the features',
        content:
          'This accordion component includes support for both single and multiple open items, smooth animations, customizable styling, full accessibility with ARIA attributes, and keyboard navigation support. It is built on top of Radix UI accordion primitive for reliability.',
      },
      {
        value: 'item-3',
        trigger: 'Is it reusable?',
        content: 'Yes, it is fully reusable and customizable.',
      },
    ],
  },
};

// ============================================================================
// C2: Content Type = "rich-content"
// ============================================================================

export const RichContentList: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-3',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Simple text here',
        content: 'This is plain text content.',
      },
      {
        value: 'item-2',
        trigger: 'Another section',
        content: 'More plain text.',
      },
      {
        value: 'item-3',
        trigger: 'Features and benefits',
        content: (
          <ul className="list-inside list-disc space-y-1">
            <li>Accessible and semantic HTML</li>
            <li>Smooth expand/collapse animations</li>
            <li>Supports single and multiple open items</li>
            <li>Fully customizable via Tailwind CSS</li>
            <li>Built on Radix UI primitives</li>
          </ul>
        ),
      },
    ],
  },
};

export const RichContentCodeBlock: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-3',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Installation',
        content: 'Install via npm or yarn.',
      },
      {
        value: 'item-2',
        trigger: 'Basic usage',
        content: 'Import and use the component.',
      },
      {
        value: 'item-3',
        trigger: 'Example code',
        content: (
          <div className="space-y-2">
            <p>Here is a basic example of how to use the Accordion:</p>
            <code className="block rounded bg-slate-100 p-2 font-mono text-xs leading-relaxed">
              {`<Accordion
  type="single"
  collapsible={true}
  items={[
    {
      value: 'item-1',
      trigger: 'Section',
      content: 'Content here'
    }
  ]}
/>`}
            </code>
          </div>
        ),
      },
    ],
  },
};

// ============================================================================
// Additional Interactive Variant
// ============================================================================

export const SingleCollapsibleFirstOpenTriggerActive: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section One (Open)',
        content: 'Content for section one',
      },
      {
        value: 'item-2',
        trigger: 'Section Two',
        content: 'Content for section two',
      },
      {
        value: 'item-3',
        trigger: 'Section Three',
        content: 'Content for section three',
      },
    ],
  },
  play: triggerActivePlay,
};
