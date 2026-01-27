

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
    const months = container.querySelectorAll('.rdp-month');
    expect(months).toHaveLength(1);
  });

  it('renders with numberOfMonths=2', () => {
    const { container } = render(<Calendar numberOfMonths={2} />);
    const months = container.querySelectorAll('.rdp-month');
    expect(months).toHaveLength(2);
  });

  it('renders with numberOfMonths=3', () => {
    const { container } = render(<Calendar numberOfMonths={3} />);
    const months = container.querySelectorAll('.rdp-month');
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

    const dayButton = screen.getByRole('button', { name: '20' });
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

    const dayButtons = screen.getAllByRole('button', { name: '15' });
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

    const dayButton = screen.getByRole('button', { name: '10' });
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

    const dayButton = screen.getByRole('button', { name: '10' });
    expect(dayButton).toBeDisabled();
  });

  it('shows outside days when showOutsideDays=true', () => {
    const { container } = render(
      <Calendar
        showOutsideDays={true}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const outsideDays = container.querySelectorAll('.rdp-day_outside');
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

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('starts week on specified day', () => {
    const { container } = render(
      <Calendar
        weekStartsOn={1}
        defaultMonth={new Date(2024, 0, 1)}
      />
    );

    const weekdayHeaders = container.querySelectorAll('.rdp-head_cell');
    expect(weekdayHeaders[0]).toHaveTextContent(/mo/i);
  });
});
