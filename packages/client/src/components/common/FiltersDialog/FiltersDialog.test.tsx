import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersDialog } from './FiltersDialog';
import type { FilterItem } from '../FiltersList/types';

const mockFilters: FilterItem[] = [
  {
    id: 'customer',
    label: 'Customer',
    value: 'none',
    count: 0,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'customer1', label: 'Customer 1' },
    ],
    onChange: vi.fn(),
  },
  {
    id: 'status',
    label: 'Status',
    value: 'todo',
    count: 1,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'todo', label: 'To Do' },
    ],
    onChange: vi.fn(),
  },
];

describe('FiltersDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    filters: mockFilters,
    onApply: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders when open', () => {
    render(<FiltersDialog {...defaultProps} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<FiltersDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<FiltersDialog {...defaultProps} title="Custom Filters" />);
    expect(screen.getByText('Custom Filters')).toBeInTheDocument();
  });

  it('renders Clear and Apply buttons', () => {
    render(<FiltersDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('calls onClear when Clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<FiltersDialog {...defaultProps} onClear={onClear} />);
    
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onApply when Apply button is clicked', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<FiltersDialog {...defaultProps} onApply={onApply} />);
    
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('renders all filters', () => {
    render(<FiltersDialog {...defaultProps} />);
    expect(screen.getByText('Customer (0)')).toBeInTheDocument();
    expect(screen.getByText('Status (1)')).toBeInTheDocument();
  });
});
