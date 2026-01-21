import type * as React from 'react';
import type { DayPickerProps, DayButtonProps } from 'react-day-picker';
import type { VariantProps } from 'class-variance-authority';
import type { calendarDayVariants } from './Calendar';

/**
 * Number of months to display
 * @figma Months variant: 1 Month, 2 months, 3 months
 */
export type CalendarMonths = 1 | 2 | 3;

/**
 * Day position for range selection styling
 * @figma Position variant: Middle, Left, Right, Single
 */
export type CalendarDayPosition = 'middle' | 'left' | 'right' | 'single';

/**
 * Day state for styling
 * @figma State variant: Default, Selected, Active, Disabled
 */
export type CalendarDayState = 'default' | 'selected' | 'active' | 'disabled' | 'outside';

/**
 * Calendar component props
 * Extends react-day-picker DayPicker props with Obra-specific customizations
 */
export interface CalendarProps
  extends Omit<DayPickerProps, 'numberOfMonths'> {
  /**
   * Number of months to display
   * @default 1
   * @figma Months: 1 Month→1, 2 months→2, 3 months→3
   */
  numberOfMonths?: CalendarMonths;

  /**
   * Show days from adjacent months
   * @default true
   */
  showOutsideDays?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom class names for calendar parts
   */
  classNames?: DayPickerProps['classNames'];
}

/**
 * Calendar day button props
 * Used by the custom CalendarDayButton component
 */
export interface CalendarDayButtonProps
  extends DayButtonProps,
    VariantProps<typeof calendarDayVariants> {
  /**
   * Additional CSS classes
   */
  className?: string;
}
