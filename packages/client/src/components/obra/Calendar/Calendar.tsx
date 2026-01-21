import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { CalendarProps, CalendarDayButtonProps } from './types';

/**
 * Day button variants matching Figma design
 * @figma Position: Middle, Left, Right, Single
 * @figma State: Default, Selected, Active, Disabled
 */
export const calendarDayVariants = cva(
  // Base: 32x32px inner size, centered text, text-sm (14px)
  [
    'inline-flex items-center justify-center',
    'size-8 p-0',
    'text-sm font-normal leading-5',
    'rounded-sm',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      state: {
        default: 'bg-background text-foreground hover:bg-accent',
        selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
        active: 'bg-accent text-accent-foreground',
        disabled: 'bg-background text-foreground opacity-50',
        outside: 'bg-background text-muted-foreground opacity-50',
      },
      position: {
        single: 'rounded-sm',
        left: 'rounded-l-sm rounded-r-none',
        middle: 'rounded-none',
        right: 'rounded-r-sm rounded-l-none',
      },
    },
    defaultVariants: {
      state: 'default',
      position: 'single',
    },
  }
);

/**
 * Custom day button component for Calendar
 * Handles selection states and position-based styling for range selection
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: CalendarDayButtonProps) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // Determine position for range selection
  const getPosition = () => {
    if (modifiers.range_start && modifiers.range_end) return 'single';
    if (modifiers.range_start) return 'left';
    if (modifiers.range_end) return 'right';
    if (modifiers.range_middle) return 'middle';
    return 'single';
  };

  // Determine state
  const getState = () => {
    if (modifiers.disabled) return 'disabled';
    if (modifiers.outside) return 'outside';
    if (modifiers.selected || modifiers.range_start || modifiers.range_end)
      return 'selected';
    if (modifiers.range_middle) return 'active';
    return 'default';
  };

  const position = getPosition();
  const state = getState();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="xs"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        calendarDayVariants({ state, position }),
        // Override button base styles for calendar-specific styling
        'h-8 w-8 min-w-0 px-0',
        // Range middle styling - light background
        'data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground',
        // Selected single styling - primary background
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground',
        // Range start/end styling - primary background
        'data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground',
        'data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground',
        // Range position rounding
        'data-[range-start=true]:rounded-l-sm data-[range-start=true]:rounded-r-none',
        'data-[range-end=true]:rounded-r-sm data-[range-end=true]:rounded-l-none',
        'data-[range-middle=true]:rounded-none',
        // Focus styling
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10',
        'group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-ring',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

/**
 * Calendar component following Obra design system
 * Built on react-day-picker v9 with custom styling
 *
 * @figma https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288-117149
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  numberOfMonths = 1,
  captionLayout = 'label',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      numberOfMonths={numberOfMonths}
      className={cn(
        'bg-background group/calendar p-3',
        // RTL support for navigation arrows
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          // Obra outline button style with shadow-sm
          'inline-flex items-center justify-center',
          'size-8 p-0',
          'rounded-lg border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          // Obra outline button style with shadow-sm
          'inline-flex items-center justify-center',
          'size-8 p-0',
          'rounded-lg border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-8 w-full items-center justify-center px-8',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-8 w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'bg-popover absolute inset-0 opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none text-sm font-medium',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          // Figma: 12px font, muted-foreground color
          'flex-1 select-none rounded-md text-xs font-normal text-muted-foreground',
          'flex h-8 w-8 items-center justify-center',
          defaultClassNames.weekday
        ),
        week: cn('mt-0.5 flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'size-8 select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'text-muted-foreground select-none text-xs',
          defaultClassNames.week_number
        ),
        day: cn(
          'group/day relative flex h-10 w-10 items-center justify-center p-0 text-center',
          'select-none',
          // Range styling on parent cell
          '[&:first-child[data-selected=true]_.rdp-day_button]:rounded-l-sm',
          '[&:last-child[data-selected=true]_.rdp-day_button]:rounded-r-sm',
          defaultClassNames.day
        ),
        range_start: cn('bg-accent rounded-l-md', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('bg-accent rounded-r-md', defaultClassNames.range_end),
        today: cn(
          // Today indicator - subtle ring
          'ring-1 ring-accent-foreground/20 rounded-sm',
          'data-[selected=true]:ring-0',
          defaultClassNames.today
        ),
        outside: cn(
          // Figma: 50% opacity for outside days
          'text-muted-foreground opacity-50',
          'aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          // Figma: 50% opacity for disabled
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            );
          }
          return (
            <ChevronRightIcon className={cn('size-4', className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-8 items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
CalendarDayButton.displayName = 'CalendarDayButton';

export { Calendar, CalendarDayButton };
