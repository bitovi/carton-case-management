import type { Meta, StoryObj } from '@storybook/react';
import { VoteButton } from './VoteButton';

const meta = {
  title: 'Figma Variants/VoteButton',
  component: VoteButton,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof VoteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeUpActiveFalseStateDefault: Story = {
  args: {
    type: 'up',
    active: false,
    count: 12,
  },
};

export const TypeUpActiveFalseStateHover: Story = {
  args: {
    type: 'up',
    active: false,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (button as HTMLElement).classList.add('hover');
    }
  },
};

export const TypeUpActiveFalseStateFocus: Story = {
  args: {
    type: 'up',
    active: false,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) (button as HTMLElement).focus();
  },
};

export const TypeUpActiveTrueStateDefault: Story = {
  args: {
    type: 'up',
    active: true,
    count: 12,
  },
};

export const TypeUpActiveTrueStateHover: Story = {
  args: {
    type: 'up',
    active: true,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (button as HTMLElement).classList.add('hover');
    }
  },
};

export const TypeUpActiveTrueStateFocus: Story = {
  args: {
    type: 'up',
    active: true,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) (button as HTMLElement).focus();
  },
};

export const TypeDownActiveFalseStateDefault: Story = {
  args: {
    type: 'down',
    active: false,
    count: 12,
  },
};

export const TypeDownActiveFalseStateHover: Story = {
  args: {
    type: 'down',
    active: false,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (button as HTMLElement).classList.add('hover');
    }
  },
};

export const TypeDownActiveFalseStateFocus: Story = {
  args: {
    type: 'down',
    active: false,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) (button as HTMLElement).focus();
  },
};

export const TypeDownActiveTrueStateDefault: Story = {
  args: {
    type: 'down',
    active: true,
    count: 12,
  },
};

export const TypeDownActiveTrueStateHover: Story = {
  args: {
    type: 'down',
    active: true,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (button as HTMLElement).classList.add('hover');
    }
  },
};

export const TypeDownActiveTrueStateFocus: Story = {
  args: {
    type: 'down',
    active: true,
    count: 12,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) (button as HTMLElement).focus();
  },
};

export const ShowCountFalse: Story = {
  args: {
    type: 'up',
    active: false,
    showCount: false,
  },
};
