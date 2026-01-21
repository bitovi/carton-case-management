import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { DateRange } from 'react-day-picker';
import { addDays, isBefore, isWeekend, startOfToday } from 'date-fns';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  title: 'Obra/Calendar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288-117149&m=dev',
    },
  },
  argTypes: {
    numberOfMonths: {
      control: { type: 'select' },
      options: [1, 2, 3],
      description: 'Number of months to display',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from adjacent months',
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'range', 'multiple'],
      description: 'Selection mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// ============================================================================
// Default Stories
// ============================================================================

/**
 * Default calendar with no selection mode (display only)
 */
export const Default: Story = {
  args: {
    numberOfMonths: 1,
    showOutsideDays: true,
  },
};

// ============================================================================
// Selection Mode Stories
// ============================================================================

/**
 * Single date selection mode
 * @figma Node: 190:27724 (1 Month)
 */
export const SingleSelection: Story = {
  render: function SingleSelectionStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <p className="text-sm text-muted-foreground">
          Selected: {date?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Date range selection mode
 * @figma Node: 190:27722 (2 months)
 */
export const RangeSelection: Story = {
  render: function RangeSelectionStory() {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
        />
        <p className="text-sm text-muted-foreground">
          Range: {range?.from?.toLocaleDateString() ?? 'Start'} -{' '}
          {range?.to?.toLocaleDateString() ?? 'End'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple date selection mode
 */
export const MultipleSelection: Story = {
  render: function MultipleSelectionStory() {
    const [dates, setDates] = React.useState<Date[] | undefined>([
      new Date(),
      addDays(new Date(), 2),
      addDays(new Date(), 5),
    ]);

    return (
      <div className="space-y-4">
        <Calendar mode="multiple" selected={dates} onSelect={setDates} />
        <p className="text-sm text-muted-foreground">
          Selected: {dates?.map((d) => d.toLocaleDateString()).join(', ') ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Number of Months Variants
// ============================================================================

/**
 * Single month view (default)
 * @figma Months=1 Month (Node: 190:27724)
 */
export const OneMonth: Story = {
  args: {
    numberOfMonths: 1,
    mode: 'single',
  },
};

/**
 * Two month view - useful for range selection
 * @figma Months=2 months (Node: 190:27722)
 */
export const TwoMonths: Story = {
  args: {
    numberOfMonths: 2,
    mode: 'range',
  },
};

/**
 * Three month view - for extended date ranges
 * @figma Months=3 months (Node: 190:27721)
 */
export const ThreeMonths: Story = {
  args: {
    numberOfMonths: 3,
    mode: 'range',
  },
};

// ============================================================================
// Day State Stories
// ============================================================================

/**
 * Calendar with disabled dates (past dates and weekends)
 * @figma Day State: Disabled (opacity: 50%)
 */
export const WithDisabledDates: Story = {
  render: function DisabledDatesStory() {
    const [date, setDate] = React.useState<Date | undefined>();
    const today = startOfToday();

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={[
            // Disable past dates
            (date) => isBefore(date, today),
            // Disable weekends
            isWeekend,
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Past dates and weekends are disabled
        </p>
      </div>
    );
  },
};

/**
 * Calendar with specific date range disabled
 */
export const WithDisabledRange: Story = {
  render: function DisabledRangeStory() {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={[
            {
              from: addDays(new Date(), 5),
              to: addDays(new Date(), 10),
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Days 5-10 from today are disabled
        </p>
      </div>
    );
  },
};

/**
 * Calendar with outside days hidden
 * @figma Outside days shown with 50% opacity
 */
export const HideOutsideDays: Story = {
  args: {
    showOutsideDays: false,
    mode: 'single',
  },
};

// ============================================================================
// Configuration Stories
// ============================================================================

/**
 * Calendar with min/max date constraints
 */
export const WithMinMax: Story = {
  render: function MinMaxStory() {
    const [date, setDate] = React.useState<Date | undefined>();
    const today = new Date();
    const fromDate = today;
    const toDate = addDays(today, 30);

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={fromDate}
          toDate={toDate}
        />
        <p className="text-sm text-muted-foreground">
          Only dates within the next 30 days can be selected
        </p>
      </div>
    );
  },
};

/**
 * Calendar starting on Monday
 */
export const WeekStartsMonday: Story = {
  args: {
    weekStartsOn: 1,
    mode: 'single',
  },
};

/**
 * Calendar with fixed weeks (always 6 rows)
 */
export const FixedWeeks: Story = {
  args: {
    fixedWeeks: true,
    mode: 'single',
  },
};

/**
 * Calendar showing week numbers
 */
export const WithWeekNumbers: Story = {
  args: {
    showWeekNumber: true,
    mode: 'single',
  },
};

// ============================================================================
// Controlled Stories
// ============================================================================

/**
 * Fully controlled calendar with external state
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [month, setMonth] = React.useState<Date>(new Date());

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setMonth(addDays(month, -30))}
          >
            Previous Month
          </button>
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setMonth(new Date())}
          >
            Today
          </button>
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setMonth(addDays(month, 30))}
          >
            Next Month
          </button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
        />
        <p className="text-sm text-muted-foreground">
          Viewing: {month.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          <br />
          Selected: {date?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Composition Stories
// ============================================================================

/**
 * Calendar inside a card (common pattern)
 */
export const InCard: Story = {
  render: function InCardStory() {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Select a date</h3>
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

/**
 * Range picker for booking-style interfaces
 */
export const BookingCalendar: Story = {
  render: function BookingStory() {
    const [range, setRange] = React.useState<DateRange | undefined>();
    const today = startOfToday();

    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Select your stay</h3>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            disabled={(date) => isBefore(date, today)}
          />
          {range?.from && range?.to && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm">
                <strong>Check-in:</strong> {range.from.toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Check-out:</strong> {range.to.toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.ceil(
                  (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
                )}{' '}
                nights
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
};
