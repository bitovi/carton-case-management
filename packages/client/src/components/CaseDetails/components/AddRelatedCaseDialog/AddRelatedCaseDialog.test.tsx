import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddRelatedCaseDialog } from './AddRelatedCaseDialog';

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

describe('AddRelatedCaseDialog', () => {
  it('renders when open', () => {
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <AddRelatedCaseDialog
        open={false}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.queryByText('Add Related Cases')).not.toBeInTheDocument();
  });

  it('displays all cases', () => {
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
  });

  it('shows selected state correctly', () => {
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={['1']}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('calls onSelectionChange when checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={['1']}
        onSelectionChange={onSelectionChange}
        onAdd={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('calls onAdd when add button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={['1']}
        onSelectionChange={vi.fn()}
        onAdd={onAdd}
      />
    );

    await user.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('disables add button when no cases selected', () => {
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={vi.fn()}
        cases={mockCases}
        selectedCases={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AddRelatedCaseDialog
        open={true}
        onOpenChange={onOpenChange}
        cases={mockCases}
        selectedCases={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
