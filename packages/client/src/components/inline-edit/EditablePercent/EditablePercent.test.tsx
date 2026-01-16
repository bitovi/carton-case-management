/**
 * EditablePercent Component Tests
 *
 * Tests for the EditablePercent inline editing component.
 * Verifies percentage formatting, % icon display, editing states, and validation.
 *
 * @module inline-edit/EditablePercent
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditablePercent } from './EditablePercent';

describe('EditablePercent', () => {
  const defaultProps = {
    label: 'Discount',
    value: 15,
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with label and formatted percent value', () => {
      render(<EditablePercent {...defaultProps} />);

      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
    });

    it('formats value with custom decimal places', () => {
      render(<EditablePercent {...defaultProps} value={15.75} decimalPlaces={2} />);

      expect(screen.getByText('15.75%')).toBeInTheDocument();
    });

    it('formats value with thousands separator', () => {
      render(<EditablePercent {...defaultProps} value={1234} />);

      expect(screen.getByText('1,234%')).toBeInTheDocument();
    });

    it('shows placeholder when value is null', () => {
      render(<EditablePercent {...defaultProps} value={null} placeholder="Enter discount..." />);

      expect(screen.getByText('Enter discount...')).toBeInTheDocument();
    });

    it('shows "Not set" when value is null and no placeholder', () => {
      render(<EditablePercent {...defaultProps} value={null} placeholder="" />);

      expect(screen.getByText('Not set')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditablePercent {...defaultProps} displayValue={<span>Custom: 15%</span>} />
      );

      expect(screen.getByText('Custom: 15%')).toBeInTheDocument();
    });

    it('displays zero value correctly', () => {
      render(<EditablePercent {...defaultProps} value={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      // Click the content area
      await user.click(screen.getByText('15%'));

      // Should show input with numeric value (no % symbol in input value)
      expect(screen.getByRole('spinbutton')).toHaveValue(15);
    });

    it('shows percent sign icon inside input on right in edit mode', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));

      // Percent sign icon should be visible
      const percentIcon = document.querySelector('.lucide-percent');
      expect(percentIcon).toBeInTheDocument();
    });

    it('shows save and cancel buttons in edit mode', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('enters edit mode on Enter key', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      // Tab to the component and press Enter
      await user.tab();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('Save Behavior', () => {
    it('saves value when clicking save button', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '25');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(25);
      });
    });

    it('saves value when pressing Enter', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '50');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(50);
      });
    });

    it('saves null when input is empty', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(null);
      });
    });

    it('exits edit mode after successful save', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      });
    });

    it('handles decimal values correctly', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} onSave={onSave} step={0.01} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '12.5');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(12.5);
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('cancels edit when clicking cancel button', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '99');
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
      expect(screen.getByText('15%')).toBeInTheDocument();
    });

    it('cancels edit when pressing Escape', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('restores original value after cancel', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '75');
      await user.keyboard('{Escape}');

      expect(screen.getByText('15%')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error for value below min', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} min={10} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '5');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Value must be at least 10%');
    });

    it('shows error for value above max', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} max={100} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '150');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Value must be at most 100%');
    });

    it('shows validation error from custom validator', async () => {
      const user = userEvent.setup();
      const validate = (value: number | null) =>
        value !== null && value > 50 ? 'Discount cannot exceed 50%' : null;

      render(<EditablePercent {...defaultProps} validate={validate} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '75');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Discount cannot exceed 50%');
    });

    it('clears error when user types', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} min={10} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '5');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Type a new value - error should clear
      await user.type(screen.getByRole('spinbutton'), '0');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} readonly />);

      await user.click(screen.getByText('15%'));

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('does not show hover styles when readonly', () => {
      render(<EditablePercent {...defaultProps} readonly />);

      // The content should not have hover state indicator
      const contentArea = screen.getByText('15%').parentElement;
      expect(contentArea).not.toHaveClass('hover:bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects isEditing prop', () => {
      render(<EditablePercent {...defaultProps} isEditing={true} />);

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', async () => {
      const user = userEvent.setup();
      const onEditingChange = vi.fn();
      render(
        <EditablePercent
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      // Click on the edit button (BaseEditable wraps content in a button)
      const content = screen.getByRole('button', { name: /edit discount/i });
      await user.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('shows error when save fails', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('remains in edit mode when save fails', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'));
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible input with label', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.click(screen.getByText('15%'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-label', 'Discount');
    });

    it('marks input as invalid when there is an error', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} max={10} />);

      await user.click(screen.getByText('15%'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('can be navigated with keyboard', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} />);

      await user.tab();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('spinbutton')).toHaveFocus();
    });
  });

  describe('Input Constraints', () => {
    it('respects step constraint', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} step={5} />);

      await user.click(screen.getByText('15%'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '5');
    });

    it('respects min constraint on input', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} min={0} />);

      await user.click(screen.getByText('15%'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
    });

    it('respects max constraint on input', async () => {
      const user = userEvent.setup();
      render(<EditablePercent {...defaultProps} max={100} />);

      await user.click(screen.getByText('15%'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  describe('Zero and Negative Values', () => {
    it('displays 0% for zero value', () => {
      render(<EditablePercent {...defaultProps} value={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('saves zero value correctly', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} value={15} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '0');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(0);
      });
    });

    it('handles negative values', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} min={-100} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '-25');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(-25);
      });
    });
  });

  describe('100% and High Values', () => {
    it('displays 100% correctly', () => {
      render(<EditablePercent {...defaultProps} value={100} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('allows values above 100% when no max is set', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditablePercent {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('15%'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '150');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(150);
      });
    });
  });
});
