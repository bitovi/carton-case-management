import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelationshipManagerDialog } from './RelationshipManagerDialog';

const mockItems = [
  {
    id: '1',
    title: 'Policy Coverage Inquiry',
    subtitle: '#CAS-242315-2125',
  },
  {
    id: '2',
    title: 'Premium Adjustment Request',
    subtitle: '#CAS-242315-2126',
  },
];

describe('RelationshipManagerDialog', () => {
  it('renders when open', () => {
    render(
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={false}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.queryByText('Add Relationships')).not.toBeInTheDocument();
  });

  it('displays all items', () => {
    render(
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );
    expect(screen.getByText('Policy Coverage Inquiry')).toBeInTheDocument();
    expect(screen.getByText('#CAS-242315-2125')).toBeInTheDocument();
  });

  it('shows selected state correctly', () => {
    render(
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={['1']}
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
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={['1']}
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
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={['1']}
        onSelectionChange={vi.fn()}
        onAdd={onAdd}
      />
    );

    await user.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('disables add button when no items selected', () => {
    render(
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={vi.fn()}
        items={mockItems}
        selectedItems={[]}
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
      <RelationshipManagerDialog
        title="Add Related Cases"
        open={true}
        onOpenChange={onOpenChange}
        items={mockItems}
        selectedItems={[]}
        onSelectionChange={vi.fn()}
        onAdd={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
