import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta = {
  title: 'Figma Variants/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create consistent baseline dates
const baseDate = new Date(2024, 0, 15);
const defaultMonth = new Date(2024, 0, 1);

// ============================================================================
// CORE VARIANTS - numberOfMonths × mode × showOutsideDays (18 total)
// ============================================================================

// numberOfMonths=1, mode=single, showOutsideDays=true [REP]
export const NumberOfMonths1ModeSingleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=1, mode=single, showOutsideDays=false
export const NumberOfMonths1ModeSingleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: false,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=1, mode=multiple, showOutsideDays=true
export const NumberOfMonths1ModeMultipleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'multiple',
    showOutsideDays: true,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 0, 25)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=1, mode=multiple, showOutsideDays=false
export const NumberOfMonths1ModeMultipleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'multiple',
    showOutsideDays: false,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 0, 25)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=1, mode=range, showOutsideDays=true
export const NumberOfMonths1ModeRangeShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=1, mode=range, showOutsideDays=false
export const NumberOfMonths1ModeRangeShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'range',
    showOutsideDays: false,
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=single, showOutsideDays=true
export const NumberOfMonths2ModeSingleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=single, showOutsideDays=false
export const NumberOfMonths2ModeSingleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'single',
    showOutsideDays: false,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=multiple, showOutsideDays=true
export const NumberOfMonths2ModeMultipleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'multiple',
    showOutsideDays: true,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 1, 10)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=multiple, showOutsideDays=false
export const NumberOfMonths2ModeMultipleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'multiple',
    showOutsideDays: false,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 1, 10)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=range, showOutsideDays=true
export const NumberOfMonths2ModeRangeShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 20), to: new Date(2024, 1, 5) },
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=2, mode=range, showOutsideDays=false
export const NumberOfMonths2ModeRangeShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'range',
    showOutsideDays: false,
    selected: { from: new Date(2024, 0, 20), to: new Date(2024, 1, 5) },
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=single, showOutsideDays=true
export const NumberOfMonths3ModeSingleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=single, showOutsideDays=false
export const NumberOfMonths3ModeSingleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'single',
    showOutsideDays: false,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=multiple, showOutsideDays=true
export const NumberOfMonths3ModeMultipleShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'multiple',
    showOutsideDays: true,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 2, 20)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=multiple, showOutsideDays=false
export const NumberOfMonths3ModeMultipleShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'multiple',
    showOutsideDays: false,
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 2, 20)],
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=range, showOutsideDays=true
export const NumberOfMonths3ModeRangeShowOutsideDaysTrue: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 15), to: new Date(2024, 2, 15) },
    defaultMonth: defaultMonth,
  },
};

// numberOfMonths=3, mode=range, showOutsideDays=false
export const NumberOfMonths3ModeRangeShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'range',
    showOutsideDays: false,
    selected: { from: new Date(2024, 0, 15), to: new Date(2024, 2, 15) },
    defaultMonth: defaultMonth,
  },
};

// ============================================================================
// DAY INTERACTION STATES (at baseline: numberOfMonths=1, mode=single)
// ============================================================================

// dayState=default (baseline day button, no selection)
export const DayStateDefault: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    defaultMonth: defaultMonth,
  },
};

// dayState=hover (day button with hover background)
export const DayStateHover: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    defaultMonth: defaultMonth,
  },
  play: async ({ canvasElement }) => {
    // Simulate hover on a specific day button (e.g., 15th)
    const dayButtons = canvasElement.querySelectorAll('button[role="button"]');
    if (dayButtons.length > 0) {
      const dayButton = Array.from(dayButtons).find(btn => btn.textContent?.trim() === '15');
      if (dayButton) {
        dayButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
    }
  },
};

// dayState=focus (day button with focus ring)
export const DayStateFocus: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    defaultMonth: defaultMonth,
  },
  play: async ({ canvasElement }) => {
    const dayButtons = canvasElement.querySelectorAll('button[role="button"]');
    if (dayButtons.length > 0) {
      const dayButton = Array.from(dayButtons).find(btn => btn.textContent?.trim() === '15');
      if (dayButton) {
        (dayButton as HTMLButtonElement).focus();
      }
    }
  },
};

// dayState=selected (day button with selected background - accent-2)
export const DayStateSelected: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// dayState=today (day with today indicator - accent background)
export const DayStateToday: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    defaultMonth: new Date(),
  },
};

// dayState=disabled (day button with disabled styling - opacity-50)
export const DayStateDisabled: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    disabled: { before: new Date() },
    defaultMonth: defaultMonth,
  },
};

// ============================================================================
// MODE-SPECIFIC INTERACTION STATES
// ============================================================================

// mode=multiple, dayState=multipleSelected (showing multiple selected dates)
export const ModeMultipleDayStateMultipleSelected: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'multiple',
    showOutsideDays: true,
    selected: [new Date(2024, 0, 5), new Date(2024, 0, 10), new Date(2024, 0, 15), new Date(2024, 0, 20), new Date(2024, 0, 25)],
    defaultMonth: defaultMonth,
  },
};

// mode=range, dayState=rangeStart (first date of range)
export const ModeRangeDayStateRangeStart: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

// mode=range, dayState=rangeMiddle (middle date in range selection)
export const ModeRangeDayStateRangeMiddle: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

// mode=range, dayState=rangeEnd (last date of range)
export const ModeRangeDayStateRangeEnd: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'range',
    showOutsideDays: true,
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

// ============================================================================
// OUTSIDE DAYS STYLING
// ============================================================================

// showOutsideDays=true, dayState=outside (adjacent month days with reduced opacity)
export const ShowOutsideDaysTrueDayStateOutside: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    defaultMonth: defaultMonth,
  },
};

// ============================================================================
// NAVIGATION STATES
// ============================================================================

// navigationState=default (previous/next buttons enabled)
export const NavigationStateDefault: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

// navigationState=firstMonth (previous button disabled)
export const NavigationStateFirstMonth: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: new Date(1900, 0, 1),
  },
};

// navigationState=lastMonth (next button disabled)
export const NavigationStateLastMonth: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
    showOutsideDays: true,
    selected: baseDate,
    defaultMonth: new Date(2100, 11, 1),
  },
};
