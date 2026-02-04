import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelatedCasesList } from './RelatedCasesList';
import type { RelatedCaseItem } from './types';

const mockCases: RelatedCaseItem[] = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    caseNumber: '#CAS-242315-2125',
    selected: true,
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    caseNumber: '#CAS-242315-2126',
    selected: false,
  },
];

describe('RelatedCasesList', () => {
  it('renders with default title', () => {
    render(<RelatedCasesList cases={mockCases} onCaseToggle={vi.fn()} />);
    expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(
      <RelatedCasesList
        title="Select Cases"
        cases={mockCases}
        onCaseToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Select Cases')).toBeInTheDocument();
  });

  it('displays all cases', () => {
    render(<RelatedCasesList cases={mockCases} onCaseToggle={vi.fn()} />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
    expect(screen.getByText('Premium Adjustment Request')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2126')).toBeInTheDocument();
  });

  it('shows checked state correctly', () => {
    render(<RelatedCasesList cases={mockCases} onCaseToggle={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('calls onCaseToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onCaseToggle = vi.fn();
    render(<RelatedCasesList cases={mockCases} onCaseToggle={onCaseToggle} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(onCaseToggle).toHaveBeenCalledWith('2');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RelatedCasesList
        cases={mockCases}
        onCaseToggle={vi.fn()}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
