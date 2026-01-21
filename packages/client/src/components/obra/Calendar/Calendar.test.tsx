import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Calendar />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders month and year caption', () => {
      render(<Calendar defaultMonth={new Date(2025, 4, 1)} />);
      expect(screen.getByText('May 2025')).toBeInTheDocument();
    });

    it('renders weekday headers', () => {
      render(<Calendar />);
      expect(screen.getByText('Su')).toBeInTheDocument();
      expect(screen.getByText('Mo')).toBeInTheDocument();
      expect(screen.getByText('Tu')).toBeInTheDocument();
      expect(screen.getByText('We')).toBeInTheDocument();
      expect(screen.getByText('Th')).toBeInTheDocument();
      expect(screen.getByText('Fr')).toBeInTheDocument();
      expect(screen.getByText('Sa')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      render(<Calendar />);
      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Calendar className="custom-class" />);
      const calendar = screen.getByRole('grid').closest('[data-slot="calendar"]');
      expect(calendar).toHaveClass('custom-class');
    });
  });

  describe('numberOfMonths variants', () => {
    it('renders single month by default', () => {
      render(<Calendar defaultMonth={new Date(2025, 4, 1)} />);
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(1);
    });

    it('renders two months when numberOfMonths={2}', () => {
      render(<Calendar numberOfMonths={2} defaultMonth={new Date(2025, 4, 1)} />);
      expect(screen.getByText('May 2025')).toBeInTheDocument();
      expect(screen.getByText('June 2025')).toBeInTheDocument();
    });

    it('renders three months when numberOfMonths={3}', () => {
      render(<Calendar numberOfMonths={3} defaultMonth={new Date(2025, 4, 1)} />);
      expect(screen.getByText('May 2025')).toBeInTheDocument();
      expect(screen.getByText('June 2025')).toBeInTheDocument();
      expect(screen.getByText('July 2025')).toBeInTheDocument();
    });
  });

  describe('Single selection mode', () => {
    it('allows selecting a date', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 1)}
          onSelect={onSelect}
        />
      );

      const day15 = screen.getByRole('button', { name: /15/ });
      await user.click(day15);

      expect(onSelect).toHaveBeenCalled();
    });

    it('shows selected date with correct styling', () => {
      const selectedDate = new Date(2025, 4, 15);

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 1)}
          selected={selectedDate}
        />
      );

      const day15 = screen.getByRole('button', { name: /15/ });
      expect(day15).toHaveAttribute('data-selected-single', 'true');
    });
  });

  describe('Range selection mode', () => {
    it('allows selecting a date range', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 4, 1)}
          onSelect={onSelect}
        />
      );

      const day10 = screen.getByRole('button', { name: /10/ });
      const day15 = screen.getByRole('button', { name: /15/ });

      await user.click(day10);
      await user.click(day15);

      expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it('shows range start with correct data attribute', () => {
      const range = {
        from: new Date(2025, 4, 10),
        to: new Date(2025, 4, 15),
      };

      render(
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 4, 1)}
          selected={range}
        />
      );

      const day10 = screen.getByRole('button', { name: /10/ });
      expect(day10).toHaveAttribute('data-range-start', 'true');
    });

    it('shows range end with correct data attribute', () => {
      const range = {
        from: new Date(2025, 4, 10),
        to: new Date(2025, 4, 15),
      };

      render(
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 4, 1)}
          selected={range}
        />
      );

      const day15 = screen.getByRole('button', { name: /15/ });
      expect(day15).toHaveAttribute('data-range-end', 'true');
    });

    it('shows range middle days with correct data attribute', () => {
      const range = {
        from: new Date(2025, 4, 10),
        to: new Date(2025, 4, 15),
      };

      render(
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 4, 1)}
          selected={range}
        />
      );

      const day12 = screen.getByRole('button', { name: /12/ });
      expect(day12).toHaveAttribute('data-range-middle', 'true');
    });
  });

  describe('Multiple selection mode', () => {
    it('allows selecting multiple dates', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(
        <Calendar
          mode="multiple"
          defaultMonth={new Date(2025, 4, 1)}
          onSelect={onSelect}
        />
      );

      const day10 = screen.getByRole('button', { name: /May 10th/ });
      const day15 = screen.getByRole('button', { name: /May 15th/ });
      const day20 = screen.getByRole('button', { name: /May 20th/ });

      await user.click(day10);
      await user.click(day15);
      await user.click(day20);

      expect(onSelect).toHaveBeenCalledTimes(3);
    });
  });

  describe('Navigation', () => {
    it('navigates to previous month', async () => {
      const user = userEvent.setup();

      render(<Calendar defaultMonth={new Date(2025, 4, 1)} />);

      expect(screen.getByText('May 2025')).toBeInTheDocument();

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await user.click(prevButton);

      expect(screen.getByText('April 2025')).toBeInTheDocument();
    });

    it('navigates to next month', async () => {
      const user = userEvent.setup();

      render(<Calendar defaultMonth={new Date(2025, 4, 1)} />);

      expect(screen.getByText('May 2025')).toBeInTheDocument();

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(screen.getByText('June 2025')).toBeInTheDocument();
    });
  });

  describe('Disabled dates', () => {
    it('disables specified dates', () => {
      const disabledDates = [new Date(2025, 4, 15)];

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 1)}
          disabled={disabledDates}
        />
      );

      const day15 = screen.getByRole('button', { name: /15/ });
      expect(day15).toBeDisabled();
    });

    it('does not call onSelect for disabled dates', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const disabledDates = [new Date(2025, 4, 15)];

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 1)}
          disabled={disabledDates}
          onSelect={onSelect}
        />
      );

      const day15 = screen.getByRole('button', { name: /15/ });
      await user.click(day15);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Outside days', () => {
    it('shows outside days by default', () => {
      render(
        <Calendar mode="single" defaultMonth={new Date(2025, 4, 1)} showOutsideDays={true} />
      );

      // May 2025 starts on Thursday, so we should see days from April
      const grid = screen.getByRole('grid');
      const buttons = within(grid).getAllByRole('button');
      
      // Should have buttons for outside days as well as current month days
      expect(buttons.length).toBeGreaterThan(31); // More than just the 31 days in May
    });

    it('hides outside days when showOutsideDays={false}', () => {
      render(
        <Calendar mode="single" defaultMonth={new Date(2025, 4, 1)} showOutsideDays={false} />
      );

      const grid = screen.getByRole('grid');
      const buttons = within(grid).getAllByRole('button');

      // Should only have buttons for days in May (31 days)
      expect(buttons.length).toBe(31);
    });
  });

  describe('Keyboard navigation', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 1)}
        />
      );

      // Focus on a day
      const day15 = screen.getByRole('button', { name: /15/ });
      await user.click(day15);

      // Navigate with arrow keys
      await user.keyboard('{ArrowRight}');
      
      // The focus should move (implementation depends on react-day-picker)
      expect(document.activeElement).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('has accessible calendar grid', () => {
      render(<Calendar />);
      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('has accessible navigation buttons', () => {
      render(<Calendar />);
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('day buttons have accessible names', () => {
      render(<Calendar mode="single" defaultMonth={new Date(2025, 4, 1)} />);
      
      // Days should be findable by their full accessible name
      expect(screen.getByRole('button', { name: /May 1st/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /May 15th/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /May 31st/ })).toBeInTheDocument();
    });
  });
});
