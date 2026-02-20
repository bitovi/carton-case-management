import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FiltersList } from './FiltersList';
import type { FilterItem } from './types';

const mockFilters: FilterItem[] = [
  {
    id: 'customer',
    label: 'Customer',
    value: 'none',
    count: 0,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'customer1', label: 'Customer 1' },
      { value: 'customer2', label: 'Customer 2' },
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
      { value: 'done', label: 'Done' },
    ],
    onChange: vi.fn(),
  },
];

describe('FiltersList', () => {
  it('renders with default title', () => {
    render(<FiltersList filters={mockFilters} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<FiltersList filters={mockFilters} title="Custom Filters" />);
    expect(screen.getByText('Custom Filters')).toBeInTheDocument();
  });

  it('renders all filters', () => {
    render(<FiltersList filters={mockFilters} />);
    expect(screen.getByText('Customer (0)')).toBeInTheDocument();
    expect(screen.getByText('Status (1)')).toBeInTheDocument();
  });

  it('displays filter count in label', () => {
    render(<FiltersList filters={mockFilters} />);
    expect(screen.getByText('Status (1)')).toBeInTheDocument();
  });

  it('renders filter without count when count is undefined', () => {
    const filtersWithoutCount: FilterItem[] = [
      {
        id: 'priority',
        label: 'Priority',
        value: 'none',
        options: [{ value: 'none', label: 'None' }],
        onChange: vi.fn(),
      },
    ];
    render(<FiltersList filters={filtersWithoutCount} />);
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<FiltersList filters={mockFilters} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders empty when no filters provided', () => {
    render(<FiltersList filters={[]} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
});
