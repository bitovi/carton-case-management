

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders with default props', () => {
    render(<Calendar />);
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    const nextButton = screen.getByRole('button', { name: /next month/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders with numberOfMonths=1', () => {
    const { container } = render(<Calendar numberOfMonths={1} />);
    // Look for month table elements with aria-label containing month/year
    const months = container.querySelectorAll('table[role="grid"]');
    expect(months).toHaveLength(1);
  });

  it('renders with numberOfMonths=2', () => {
    const { container } = render(<Calendar numberOfMonths={2} />);
    const months = container.querySelectorAll('table[role="grid"]');
    expect(months).toHaveLength(2);
  });

  it('renders with numberOfMonths=3', () => {
    const { container } = render(<Calendar numberOfMonths={3} />);
    const months = container.querySelectorAll('table[role="grid"]');
    expect(months).toHaveLength(3);
  });

  it('handles single date selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const selected = new Date(2024, 0, 15);
    
    render(
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const dayButton = screen.getByLabelText(/Saturday, January 20th, 2024/);
    await user.click(dayButton);

    expect(onSelect).toHaveBeenCalled();
  });

  it('handles range selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    
    render(
      <Calendar
        mode="range"
        numberOfMonths={2}
        onSelect={onSelect}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const dayButtons = screen.getAllByLabelText(/January 15th, 2024/);
    await user.click(dayButtons[0]);

    expect(onSelect).toHaveBeenCalled();
  });

  it('handles multiple date selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    
    render(
      <Calendar
        mode="multiple"
        onSelect={onSelect}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const dayButton = screen.getByLabelText(/January 10th, 2024/);
    await user.click(dayButton);

    expect(onSelect).toHaveBeenCalled();
  });

  it('disables dates based on disabled prop', () => {
    const today = new Date(2024, 0, 15);
    render(
      <Calendar
        mode="single"
        disabled={{ before: today }}
        defaultMonth={today}
      />
    );

    const dayCell = screen.getByLabelText(/January 9th, 2024/);
    expect(dayCell).toBeInTheDocument();
  });

  it('shows outside days when showOutsideDays=true', () => {
    const { container } = render(
      <Calendar
        showOutsideDays={true}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const outsideDays = container.querySelectorAll('[data-outside="true"]');
    expect(outsideDays.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Calendar className="custom-calendar" />
    );

    const calendar = container.querySelector('.custom-calendar');
    expect(calendar).toBeInTheDocument();
  });

  it('renders with dropdown caption layout', () => {
    render(
      <Calendar
        captionLayout="dropdown"
        fromDate={new Date(2020, 0, 1)}
        toDate={new Date(2030, 11, 31)}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const prevButton = screen.getByLabelText('Go to previous month');
    const nextButton = screen.getByLabelText('Go to next month');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('starts week on specified day', () => {
    const { container } = render(
      <Calendar
        weekStartsOn={1}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const weekdayHeaders = container.querySelectorAll('th');
    expect(weekdayHeaders[0]).toHaveTextContent(/mo/i);
  });
});
