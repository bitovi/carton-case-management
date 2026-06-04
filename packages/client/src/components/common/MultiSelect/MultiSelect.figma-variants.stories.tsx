import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { User } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

const mockOptions = [
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'michael-brown', label: 'Michael Brown' },
  { value: 'emily-davis', label: 'Emily Davis' },
  { value: 'robert-wilson', label: 'Robert Wilson' },
];

const meta = {
  title: 'Figma Variants/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: mockOptions,
    value: [],
    onChange: () => {},
    label: 'Customer',
  },
} as Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const hoverPlay: Story['play'] = async ({ canvasElement }) => {
  const el = canvasElement.querySelector('button');
  if (el) {
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    el.classList.add('hover');
  }
};

const focusPlay: Story['play'] = async ({ canvasElement }) => {
  const el = canvasElement.querySelector('button');
  if (el) (el as HTMLElement).focus();
};

const openPlay: Story['play'] = async ({ canvasElement }) => {
  const el = canvasElement.querySelector('button');
  if (el) el.click();
  await new Promise(resolve => setTimeout(resolve, 300));
};

export const SizeMiniLayoutStackedErrorFalseStateDefault: Story = {
  args: { size: 'mini', layout: 'stacked', error: false },
};

export const SizeMiniLayoutStackedErrorFalseStateHover: Story = {
  args: { size: 'mini', layout: 'stacked', error: false },
  play: hoverPlay,
};

export const SizeMiniLayoutStackedErrorFalseStateFocus: Story = {
  args: { size: 'mini', layout: 'stacked', error: false },
  play: focusPlay,
};

export const SizeMiniLayoutStackedErrorFalseStateDisabled: Story = {
  args: { size: 'mini', layout: 'stacked', error: false, disabled: true },
};

export const SizeSmallLayoutStackedErrorFalseStateDefault: Story = {
  args: { size: 'small', layout: 'stacked', error: false },
};

export const SizeSmallLayoutStackedErrorFalseStateHover: Story = {
  args: { size: 'small', layout: 'stacked', error: false },
  play: hoverPlay,
};

export const SizeSmallLayoutStackedErrorFalseStateFocus: Story = {
  args: { size: 'small', layout: 'stacked', error: false },
  play: focusPlay,
};

export const SizeSmallLayoutStackedErrorFalseStateDisabled: Story = {
  args: { size: 'small', layout: 'stacked', error: false, disabled: true },
};

export const SizeRegularLayoutStackedErrorFalseStateDefault: Story = {
  args: { size: 'regular', layout: 'stacked', error: false },
};

export const SizeRegularLayoutStackedErrorFalseStateHover: Story = {
  args: { size: 'regular', layout: 'stacked', error: false },
  play: hoverPlay,
};

export const SizeRegularLayoutStackedErrorFalseStateFocus: Story = {
  args: { size: 'regular', layout: 'stacked', error: false },
  play: focusPlay,
};

export const SizeRegularLayoutStackedErrorFalseStateDisabled: Story = {
  args: { size: 'regular', layout: 'stacked', error: false, disabled: true },
};

export const SizeLargeLayoutStackedErrorFalseStateDefault: Story = {
  args: { size: 'large', layout: 'stacked', error: false },
};

export const SizeLargeLayoutStackedErrorFalseStateHover: Story = {
  args: { size: 'large', layout: 'stacked', error: false },
  play: hoverPlay,
};

export const SizeLargeLayoutStackedErrorFalseStateFocus: Story = {
  args: { size: 'large', layout: 'stacked', error: false },
  play: focusPlay,
};

export const SizeLargeLayoutStackedErrorFalseStateDisabled: Story = {
  args: { size: 'large', layout: 'stacked', error: false, disabled: true },
};

export const SizeMiniLayoutStackedErrorTrueStateDefault: Story = {
  args: { size: 'mini', layout: 'stacked', error: true },
};

export const SizeMiniLayoutStackedErrorTrueStateHover: Story = {
  args: { size: 'mini', layout: 'stacked', error: true },
  play: hoverPlay,
};

export const SizeMiniLayoutStackedErrorTrueStateFocus: Story = {
  args: { size: 'mini', layout: 'stacked', error: true },
  play: focusPlay,
};

export const SizeMiniLayoutStackedErrorTrueStateDisabled: Story = {
  args: { size: 'mini', layout: 'stacked', error: true, disabled: true },
};

export const SizeSmallLayoutStackedErrorTrueStateDefault: Story = {
  args: { size: 'small', layout: 'stacked', error: true },
};

export const SizeSmallLayoutStackedErrorTrueStateHover: Story = {
  args: { size: 'small', layout: 'stacked', error: true },
  play: hoverPlay,
};

export const SizeSmallLayoutStackedErrorTrueStateFocus: Story = {
  args: { size: 'small', layout: 'stacked', error: true },
  play: focusPlay,
};

export const SizeSmallLayoutStackedErrorTrueStateDisabled: Story = {
  args: { size: 'small', layout: 'stacked', error: true, disabled: true },
};

export const SizeRegularLayoutStackedErrorTrueStateDefault: Story = {
  args: { size: 'regular', layout: 'stacked', error: true },
};

export const SizeRegularLayoutStackedErrorTrueStateHover: Story = {
  args: { size: 'regular', layout: 'stacked', error: true },
  play: hoverPlay,
};

export const SizeRegularLayoutStackedErrorTrueStateFocus: Story = {
  args: { size: 'regular', layout: 'stacked', error: true },
  play: focusPlay,
};

export const SizeRegularLayoutStackedErrorTrueStateDisabled: Story = {
  args: { size: 'regular', layout: 'stacked', error: true, disabled: true },
};

export const SizeLargeLayoutStackedErrorTrueStateDefault: Story = {
  args: { size: 'large', layout: 'stacked', error: true },
};

export const SizeLargeLayoutStackedErrorTrueStateHover: Story = {
  args: { size: 'large', layout: 'stacked', error: true },
  play: hoverPlay,
};

export const SizeLargeLayoutStackedErrorTrueStateFocus: Story = {
  args: { size: 'large', layout: 'stacked', error: true },
  play: focusPlay,
};

export const SizeLargeLayoutStackedErrorTrueStateDisabled: Story = {
  args: { size: 'large', layout: 'stacked', error: true, disabled: true },
};

export const SizeMiniLayoutSingleErrorFalseStateDefault: Story = {
  args: { size: 'mini', layout: 'single', error: false },
};

export const SizeMiniLayoutSingleErrorFalseStateHover: Story = {
  args: { size: 'mini', layout: 'single', error: false },
  play: hoverPlay,
};

export const SizeMiniLayoutSingleErrorFalseStateFocus: Story = {
  args: { size: 'mini', layout: 'single', error: false },
  play: focusPlay,
};

export const SizeMiniLayoutSingleErrorFalseStateDisabled: Story = {
  args: { size: 'mini', layout: 'single', error: false, disabled: true },
};

export const SizeSmallLayoutSingleErrorFalseStateDefault: Story = {
  args: { size: 'small', layout: 'single', error: false },
};

export const SizeSmallLayoutSingleErrorFalseStateHover: Story = {
  args: { size: 'small', layout: 'single', error: false },
  play: hoverPlay,
};

export const SizeSmallLayoutSingleErrorFalseStateFocus: Story = {
  args: { size: 'small', layout: 'single', error: false },
  play: focusPlay,
};

export const SizeSmallLayoutSingleErrorFalseStateDisabled: Story = {
  args: { size: 'small', layout: 'single', error: false, disabled: true },
};

export const SizeRegularLayoutSingleErrorFalseStateDefault: Story = {
  args: { size: 'regular', layout: 'single', error: false },
};

export const SizeRegularLayoutSingleErrorFalseStateHover: Story = {
  args: { size: 'regular', layout: 'single', error: false },
  play: hoverPlay,
};

export const SizeRegularLayoutSingleErrorFalseStateFocus: Story = {
  args: { size: 'regular', layout: 'single', error: false },
  play: focusPlay,
};

export const SizeRegularLayoutSingleErrorFalseStateDisabled: Story = {
  args: { size: 'regular', layout: 'single', error: false, disabled: true },
};

export const SizeLargeLayoutSingleErrorFalseStateDefault: Story = {
  args: { size: 'large', layout: 'single', error: false },
};

export const SizeLargeLayoutSingleErrorFalseStateHover: Story = {
  args: { size: 'large', layout: 'single', error: false },
  play: hoverPlay,
};

export const SizeLargeLayoutSingleErrorFalseStateFocus: Story = {
  args: { size: 'large', layout: 'single', error: false },
  play: focusPlay,
};

export const SizeLargeLayoutSingleErrorFalseStateDisabled: Story = {
  args: { size: 'large', layout: 'single', error: false, disabled: true },
};

export const SizeMiniLayoutSingleErrorTrueStateDefault: Story = {
  args: { size: 'mini', layout: 'single', error: true },
};

export const SizeMiniLayoutSingleErrorTrueStateHover: Story = {
  args: { size: 'mini', layout: 'single', error: true },
  play: hoverPlay,
};

export const SizeMiniLayoutSingleErrorTrueStateFocus: Story = {
  args: { size: 'mini', layout: 'single', error: true },
  play: focusPlay,
};

export const SizeMiniLayoutSingleErrorTrueStateDisabled: Story = {
  args: { size: 'mini', layout: 'single', error: true, disabled: true },
};

export const SizeSmallLayoutSingleErrorTrueStateDefault: Story = {
  args: { size: 'small', layout: 'single', error: true },
};

export const SizeSmallLayoutSingleErrorTrueStateHover: Story = {
  args: { size: 'small', layout: 'single', error: true },
  play: hoverPlay,
};

export const SizeSmallLayoutSingleErrorTrueStateFocus: Story = {
  args: { size: 'small', layout: 'single', error: true },
  play: focusPlay,
};

export const SizeSmallLayoutSingleErrorTrueStateDisabled: Story = {
  args: { size: 'small', layout: 'single', error: true, disabled: true },
};

export const SizeRegularLayoutSingleErrorTrueStateDefault: Story = {
  args: { size: 'regular', layout: 'single', error: true },
};

export const SizeRegularLayoutSingleErrorTrueStateHover: Story = {
  args: { size: 'regular', layout: 'single', error: true },
  play: hoverPlay,
};

export const SizeRegularLayoutSingleErrorTrueStateFocus: Story = {
  args: { size: 'regular', layout: 'single', error: true },
  play: focusPlay,
};

export const SizeRegularLayoutSingleErrorTrueStateDisabled: Story = {
  args: { size: 'regular', layout: 'single', error: true, disabled: true },
};

export const SizeLargeLayoutSingleErrorTrueStateDefault: Story = {
  args: { size: 'large', layout: 'single', error: true },
};

export const SizeLargeLayoutSingleErrorTrueStateHover: Story = {
  args: { size: 'large', layout: 'single', error: true },
  play: hoverPlay,
};

export const SizeLargeLayoutSingleErrorTrueStateFocus: Story = {
  args: { size: 'large', layout: 'single', error: true },
  play: focusPlay,
};

export const SizeLargeLayoutSingleErrorTrueStateDisabled: Story = {
  args: { size: 'large', layout: 'single', error: true, disabled: true },
};

export const WithLeftDecoration: Story = {
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    leftDecoration: React.createElement(User, { className: 'w-4 h-4 text-muted-foreground' }),
  },
};

export const SelectionSingle: Story = {
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    value: ['sarah-johnson'],
  },
};

export const SelectionMultiple: Story = {
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    value: ['sarah-johnson', 'michael-brown', 'emily-davis'],
  },
};

export const PopoverOpen: Story = {
  args: {
    size: 'regular',
    layout: 'stacked',
    error: false,
    value: ['sarah-johnson'],
  },
  play: openPlay,
};
