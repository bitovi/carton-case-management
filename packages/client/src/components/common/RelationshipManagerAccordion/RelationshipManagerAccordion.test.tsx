import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { RelationshipManagerAccordion } from './RelationshipManagerAccordion';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const mockItems = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
    to: '/cases/1',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
    to: '/cases/2',
  },
];

describe('RelationshipManagerAccordion', () => {
  it('renders with items', () => {
    renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} />);
    expect(screen.getByText('Relationships')).toBeInTheDocument();
  });

  it('starts closed by default', () => {
     renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} />);
    const itemTitle = screen.queryByText('Policy Coverage Inquiry');
    if (itemTitle) {
      expect(itemTitle).not.toBeVisible();
    } else {
      expect(itemTitle).not.toBeInTheDocument();
    }
  });

  it('starts open when defaultOpen is true', () => {
    renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} defaultOpen />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeVisible();
  });

  it('expands when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} />);

    await user.click(screen.getByText('Relationships'));
    expect(screen.getByText('Policy Coverage Inquiry')).toBeVisible();
  });

  it('displays all items', () => {
    renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} defaultOpen />);
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
    expect(screen.getByText('Premium Adjustment Request')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2126')).toBeInTheDocument();
  });

  it('calls onAddClick when add button is clicked', async () => {
    const user = userEvent.setup();
    const onAddClick = vi.fn();
    renderWithRouter(
      <RelationshipManagerAccordion
        accordionTitle="Relationships"
        items={mockItems}
        defaultOpen
        onAddClick={onAddClick}
      />
    );

    await user.click(screen.getByText('Add'));
    expect(onAddClick).toHaveBeenCalledOnce();
  });

  it('does not show add button when onAddClick is not provided', () => {
    renderWithRouter(<RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} defaultOpen />);
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithRouter(
      <RelationshipManagerAccordion accordionTitle="Relationships" items={mockItems} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
