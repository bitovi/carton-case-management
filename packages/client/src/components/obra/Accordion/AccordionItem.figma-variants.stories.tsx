// type import removed:  Meta, StoryObj  from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Figma Variants/AccordionItem',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
};

export default meta;


// Helper to trigger hover state on first trigger
const triggerHoverPlay = async ({ canvasElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  }
};

// Helper to trigger focus state on first trigger
const triggerFocusPlay = async ({ canvasElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.focus();
  }
};

// Helper to trigger active state on first trigger
const triggerActivePlay = async ({ canvasElement }) => {
  const firstTrigger = canvasElement.querySelector(
    '[role="button"][data-radix-accordion-trigger]'
  ) as HTMLElement;
  if (firstTrigger) {
    firstTrigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }
};

// ============================================================================
// CLOSED STATE VARIANTS
// ============================================================================

export const StateClosedTriggerInteractionDefaultDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
};

export const StateClosedTriggerInteractionHoverDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerHoverPlay,
};

export const StateClosedTriggerInteractionFocusDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerFocusPlay,
};

export const StateClosedTriggerInteractionActiveDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerActivePlay,
};

export const StateClosedTriggerInteractionDefaultDisabledTrue = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
        contentProps: { disabled: true },
      },
    ],
  },
};

// ============================================================================
// OPEN STATE VARIANTS
// ============================================================================

export const StateOpenTriggerInteractionDefaultDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
};

export const StateOpenTriggerInteractionHoverDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerHoverPlay,
};

export const StateOpenTriggerInteractionFocusDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerFocusPlay,
};

export const StateOpenTriggerInteractionActiveDisabledFalse = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
  play: triggerActivePlay,
};

export const StateOpenTriggerInteractionDefaultDisabledTrue = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Section content...',
      },
    ],
  },
};

// ============================================================================
// INDEPENDENT AXIS: Trigger Text Variations
// ============================================================================

export const WithLongTriggerText = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Very long section title that might wrap',
        content: 'Section content...',
      },
    ],
  },
};

// ============================================================================
// INDEPENDENT AXIS: Content Variations
// ============================================================================

export const WithDetailedContent = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: 'Detailed section content with multiple lines',
      },
    ],
  },
};

export const WithEmptyContent = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Section title',
        content: '',
      },
    ],
  },
};
