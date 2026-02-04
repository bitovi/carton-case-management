import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelatedCasesAccordion } from './RelatedCasesAccordion';

const mockCases = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    caseNumber: '#CAS-242315-2125',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    caseNumber: '#CAS-242315-2126',
  },
];

describe('RelatedCasesAccordion', () => {
  it('renders with cases', () => {
    render(<RelatedCasesAccordion cases={mockCases} />);
    expect(screen.getByText('Related Cases')).toBeInTheDocument();
  });

  it('starts closed by default', () => {
    const { container } = render(<RelatedCasesAccordion cases={mockCases} />);
    const caseTitle = screen.queryByText('Policy Coverage Inquiry');
    if (caseTitle) {
      expect(caseTitle).not.toBeVisible();
    } else {
      expect(caseTitle).not.toBeInTheDocument();
    }
  });

  it('starts open when defaultOpen is true', () => {
    render(<RelatedCasesAccordion cases={mockCases} defaultOpen />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeVisible();
  });

  it('expands when clicked', async () => {
    const user = userEvent.setup();
    render(<RelatedCasesAccordion cases={mockCases} />);

    await user.click(screen.getByText('Related Cases'));
    expect(screen.getByText('Policy Coverage Inquiry')).toBeVisible();
  });

  it('displays all cases', () => {
    render(<RelatedCasesAccordion cases={mockCases} defaultOpen />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
    expect(screen.getByText('Premium Adjustment Request')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2126')).toBeInTheDocument();
  });

  it('calls onAddClick when add button is clicked', async () => {
    const user = userEvent.setup();
    const onAddClick = vi.fn();
    render(
      <RelatedCasesAccordion
        cases={mockCases}
        defaultOpen
        onAddClick={onAddClick}
      />
    );

    await user.click(screen.getByText('Add'));
    expect(onAddClick).toHaveBeenCalledOnce();
  });

  it('does not show add button when onAddClick is not provided', () => {
    render(<RelatedCasesAccordion cases={mockCases} defaultOpen />);
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RelatedCasesAccordion cases={mockCases} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
