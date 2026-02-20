import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelationshipManagerList } from './RelationshipManagerList';
import type { RelationshipManagerListItem } from './types';

const mockItems: RelationshipManagerListItem[] = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    selected: true,
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
    selected: false,
  },
];

describe('RelationshipManagerList', () => {
  it('renders with default title', () => {
    render(<RelationshipManagerList title="Add Relationships" items={mockItems} onItemToggle={vi.fn()} />);
    expect(screen.getByText('Add Relationships')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(
      <RelationshipManagerList
        title="Select Items"
        items={mockItems}
        onItemToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Select Items')).toBeInTheDocument();
  });

  it('displays all items', () => {
    render(<RelationshipManagerList title="Add Relationships" items={mockItems} onItemToggle={vi.fn()} />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
    expect(screen.getByText('Premium Adjustment Request')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2126')).toBeInTheDocument();
  });

  it('shows checked state correctly', () => {
    render(<RelationshipManagerList title="Add Relationships" items={mockItems} onItemToggle={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('calls onItemToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onItemToggle = vi.fn();
    render(<RelationshipManagerList title="Add Relationships" items={mockItems} onItemToggle={onItemToggle} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(onItemToggle).toHaveBeenCalledWith('2');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RelationshipManagerList
        title="Add Relationships"
        items={mockItems}
        onItemToggle={vi.fn()}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
