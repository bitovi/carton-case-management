import * as React from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { caretAltLeftIcon, caretAltRightIcon } from '@progress/kendo-svg-icons';
import {
  DayPicker,
  type MonthCaptionProps,
  type DayPickerProps,
  useNavigation,
} from 'react-day-picker';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';
import type { CalendarProps } from './types';

function MonthCaption(props: MonthCaptionProps) {
  const { previousMonth, nextMonth, goToMonth } = useNavigation();

  const displayDate = props.calendarMonth?.date || new Date();

  return (
    <div className="flex items-center justify-between mb-4 h-10">
      <button
        type="button"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={cn(
          'inline-flex items-center justify-center',
          'h-8 w-8',
          'bg-transparent border border-border rounded-lg',
          'shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:opacity-50'
        )}
        aria-label="Go to previous month"
      >
        <SvgIcon icon={caretAltLeftIcon} size="small" />
      </button>
      <span className="text-sm font-semibold">
        {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </span>
      <button
        type="button"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={cn(
          'inline-flex items-center justify-center',
          'h-8 w-8',
          'bg-transparent border border-border rounded-lg',
          'shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:opacity-50'
        )}
        aria-label="Go to next month"
      >
        <SvgIcon icon={caretAltRightIcon} size="small" />
      </button>
    </div>
  );
}

export function Calendar({
  className,
  numberOfMonths = 1,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      numberOfMonths={numberOfMonths}
      showOutsideDays={showOutsideDays}
      hideNavigation={true}
      className={cn('p-3', className)}
      classNames={{
        root: 'rdp',
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'space-y-4',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: cn('text-muted-foreground rounded-md', 'w-12 font-normal text-[0.875rem]'),
        week: 'flex w-full mt-2',
        day: cn('relative p-0 text-center text-sm', 'focus-within:relative focus-within:z-20'),
        day_button: cn(
          'inline-flex items-center justify-center whitespace-nowrap',
          'h-12 w-12 p-2',
          'rounded-sm',
          'text-foreground',
          'font-normal text-[14px] leading-[21px] tracking-[0.07px]',
          'hover:bg-[#e2e8f0] hover:text-foreground hover:rounded-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        ),
        selected: cn(
          'rounded-sm',
          'bg-accent-2 text-foreground',
          'hover:bg-accent-2 hover:text-foreground',
          'focus:bg-accent-2 focus:text-foreground'
        ),
        today: 'rounded-sm bg-accent text-foreground font-semibold',
        outside: 'text-muted-foreground opacity-50',
        disabled: 'text-muted-foreground opacity-50 cursor-not-allowed',
        range_start: 'rounded-l-sm rounded-r-none',
        range_end: 'rounded-r-sm rounded-l-none',
        range_middle: cn('rounded-none', 'bg-accent text-accent-foreground'),
        hidden: 'invisible',
      }}
      components={{
        MonthCaption,
      }}
      {...(props as DayPickerProps)}
    />
  );
}
