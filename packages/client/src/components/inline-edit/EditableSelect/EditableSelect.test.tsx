import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableSelect } from './EditableSelect';

const mockOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
];

describe('EditableSelect', () => {
  const defaultProps = {
    label: 'Status',
    value: 'opt1',
    options: mockOptions,
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<EditableSelect {...defaultProps} />);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders selected option label in rest state', () => {
      render(<EditableSelect {...defaultProps} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditableSelect
          {...defaultProps}
          displayValue={
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Active
            </span>
          }
        />
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
      render(
        <EditableSelect
          {...defaultProps}
          value=""
          placeholder="Select status..."
        />
      );
      expect(screen.getByText('Select status...')).toBeInTheDocument();
    });

    it('renders "Not selected" when value is empty and no placeholder', () => {
      render(<EditableSelect {...defaultProps} value="" />);
      expect(screen.getByText('Not selected')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <EditableSelect {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      render(<EditableSelect {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit status/i });

      fireEvent.click(content);

      // Select dropdown should be visible - check for the listbox (dropdown options)
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('shows options in dropdown', async () => {
      render(<EditableSelect {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      // Wait for dropdown to open and check for options
      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(within(listbox).getByText('Option 1')).toBeInTheDocument();
        expect(within(listbox).getByText('Option 2')).toBeInTheDocument();
        expect(within(listbox).getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('marks disabled options', async () => {
      render(<EditableSelect {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        const disabledOption = within(listbox).getByText('Disabled Option').closest('[role="option"]');
        expect(disabledOption).toHaveAttribute('data-disabled');
      });
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave when selecting a new option', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableSelect {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      // Wait for the Select component and click option in single waitFor
      await waitFor(async () => {
        const listbox = screen.getByRole('listbox');
        const option = within(listbox).getByText('Option 2');
        fireEvent.click(option);
      });

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('opt2');
      });
    });

    it('exits edit mode after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableSelect {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      // Wait for the Select component and click option in single waitFor
      await waitFor(async () => {
        const listbox = screen.getByRole('listbox');
        const option = within(listbox).getByText('Option 2');
        fireEvent.click(option);
      });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<EditableSelect {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('does not call onSave when cancelled', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableSelect {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', () => {
      render(<EditableSelect {...defaultProps} readonly />);
      const content = screen.getByText('Option 1');

      fireEvent.click(content);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not show hover state when readonly', () => {
      render(<EditableSelect {...defaultProps} readonly />);
      const content = screen.getByText('Option 1');

      fireEvent.mouseEnter(content);

      expect(content).not.toHaveClass('bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', async () => {
      render(<EditableSelect {...defaultProps} isEditing={true} />);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('calls onEditingChange when entering edit mode', () => {
      const onEditingChange = vi.fn();
      render(
        <EditableSelect
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    it('dropdown has correct listbox role', async () => {
      render(<EditableSelect {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('options have correct role', async () => {
      render(<EditableSelect {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit status/i });
      fireEvent.click(content);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(within(listbox).getAllByRole('option')).toHaveLength(4);
      });
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EditableSelect {...defaultProps} />);

      await user.tab();
      expect(
        screen.getByRole('button', { name: /edit status/i })
      ).toHaveFocus();
    });
  });
});
