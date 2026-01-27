import type { DateRange, Matcher, DayPickerProps } from 'react-day-picker';


export type CalendarProps = {
  /**
   * Number of months to display
   * @default 1
   * @figma Variant: Months (1 Month / 2 months / 3 months)
   */
  numberOfMonths?: 1 | 2 | 3;

  /**
   * Selection mode
   * @default 'single'
   */
  mode?: 'single' | 'multiple' | 'range';

  /**
   * Currently selected date(s)
   * - For mode="single": Date | undefined
   * - For mode="multiple": Date[] | undefined
   * - For mode="range": DateRange | undefined
   */
  selected?: Date | Date[] | DateRange | undefined;

  /**
   * Callback when date is selected
   * @param value - Selected date, dates, or range depending on mode
   */
  onSelect?: (value: Date | Date[] | DateRange | undefined) => void;

  /**
   * Disable specific dates, date ranges, or days of week
   * Examples:
   * - { before: new Date() } // Disable past dates
   * - { after: new Date('2024-12-31') } // Disable future dates
   * - [new Date('2024-01-01'), new Date('2024-12-25')] // Specific dates
   * - { dayOfWeek: [0, 6] } // Weekends
   */
  disabled?: Matcher | Matcher[];

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
   * Initial month to display (for uncontrolled mode)
   */
  defaultMonth?: Date;

  /**
   * Current month displayed (for controlled mode)
   */
  month?: Date;

  /**
   * Callback when month changes
   */
  onMonthChange?: (month: Date) => void;

  /**
   * First day of week (0 = Sunday, 1 = Monday, etc.)
   * @default 0
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
} & Omit<DayPickerProps, 'numberOfMonths' | 'showOutsideDays' | 'mode' | 'selected' | 'onSelect' | 'disabled' | 'className' | 'defaultMonth' | 'month' | 'onMonthChange' | 'weekStartsOn'>;
