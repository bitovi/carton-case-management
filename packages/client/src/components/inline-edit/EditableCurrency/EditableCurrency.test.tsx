/**
 * EditableCurrency Component Tests
 *
 * Tests for the EditableCurrency inline editing component.
 * Verifies currency formatting, $ icon display, editing states, and validation.
 *
 * @module inline-edit/EditableCurrency
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableCurrency } from './EditableCurrency';

describe('EditableCurrency', () => {
  const defaultProps = {
    label: 'Price',
    value: 99.99,
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with label and formatted currency value', () => {
      render(<EditableCurrency {...defaultProps} />);

      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders with custom currency symbol', () => {
      render(<EditableCurrency {...defaultProps} currencySymbol="€" />);

      expect(screen.getByText('€99.99')).toBeInTheDocument();
    });

    it('formats value with thousands separator', () => {
      render(<EditableCurrency {...defaultProps} value={1234567.89} />);

      expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    });

    it('formats value with custom decimal places', () => {
      render(<EditableCurrency {...defaultProps} value={99.999} decimalPlaces={3} />);

      expect(screen.getByText('$99.999')).toBeInTheDocument();
    });

    it('shows placeholder when value is null', () => {
      render(<EditableCurrency {...defaultProps} value={null} placeholder="Enter price..." />);

      expect(screen.getByText('Enter price...')).toBeInTheDocument();
    });

    it('shows "Not set" when value is null and no placeholder', () => {
      render(<EditableCurrency {...defaultProps} value={null} placeholder="" />);

      expect(screen.getByText('Not set')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditableCurrency {...defaultProps} displayValue={<span>Custom: $99.99</span>} />
      );

      expect(screen.getByText('Custom: $99.99')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      // Click the content area
      await user.click(screen.getByText('$99.99'));

      // Should show input with numeric value (no $ symbol in input value)
      expect(screen.getByRole('spinbutton')).toHaveValue(99.99);
    });

    it('shows dollar sign icon inside input in edit mode', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));

      // Dollar sign icon should be visible
      const dollarIcon = document.querySelector('.lucide-dollar-sign');
      expect(dollarIcon).toBeInTheDocument();
    });

    it('shows save and cancel buttons in edit mode', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('enters edit mode on Enter key', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

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
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '149.99');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(149.99);
      });
    });

    it('saves value when pressing Enter', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '199.99');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(199.99);
      });
    });

    it('saves null when input is empty', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(null);
      });
    });

    it('exits edit mode after successful save', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      });
    });

    it('handles decimal values correctly', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '123.45');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(123.45);
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('cancels edit when clicking cancel button', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '999.99');
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('cancels edit when pressing Escape', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('restores original value after cancel', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '555.55');
      await user.keyboard('{Escape}');

      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error for value below min', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} min={10} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '5');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Value must be at least $10');
    });

    it('shows error for value above max', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} max={100} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '150');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Value must be at most $100');
    });

    it('shows validation error from custom validator', async () => {
      const user = userEvent.setup();
      const validate = (value: number | null) =>
        value !== null && value < 50 ? 'Minimum price is $50' : null;

      render(<EditableCurrency {...defaultProps} validate={validate} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '25');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Minimum price is $50');
    });

    it('clears error when user types', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} min={10} />);

      await user.click(screen.getByText('$99.99'));
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
      render(<EditableCurrency {...defaultProps} readonly />);

      await user.click(screen.getByText('$99.99'));

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('does not show hover styles when readonly', () => {
      render(<EditableCurrency {...defaultProps} readonly />);

      // The content should not have hover state indicator
      const contentArea = screen.getByText('$99.99').parentElement;
      expect(contentArea).not.toHaveClass('hover:bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects isEditing prop', () => {
      render(<EditableCurrency {...defaultProps} isEditing={true} />);

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', async () => {
      const user = userEvent.setup();
      const onEditingChange = vi.fn();
      render(
        <EditableCurrency 
          {...defaultProps} 
          isEditing={false}
          onEditingChange={onEditingChange} 
        />
      );

      // Click on the edit button (BaseEditable wraps content in a button)
      const content = screen.getByRole('button', { name: /edit price/i });
      await user.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('shows error when save fails', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('remains in edit mode when save fails', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'));
      render(<EditableCurrency {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible input with label', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.click(screen.getByText('$99.99'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-label', 'Price');
    });

    it('marks input as invalid when there is an error', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} min={100} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '50');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('can be navigated with keyboard', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} />);

      await user.tab();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('spinbutton')).toHaveFocus();
    });
  });

  describe('Input Constraints', () => {
    it('respects step constraint', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} step={0.05} />);

      await user.click(screen.getByText('$99.99'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.05');
    });

    it('respects min constraint on input', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} min={0} />);

      await user.click(screen.getByText('$99.99'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
    });

    it('respects max constraint on input', async () => {
      const user = userEvent.setup();
      render(<EditableCurrency {...defaultProps} max={1000} />);

      await user.click(screen.getByText('$99.99'));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('max', '1000');
    });
  });

  describe('Zero Value', () => {
    it('displays $0.00 for zero value', () => {
      render(<EditableCurrency {...defaultProps} value={0} />);

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('saves zero value correctly', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableCurrency {...defaultProps} value={99.99} onSave={onSave} />);

      await user.click(screen.getByText('$99.99'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '0');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(0);
      });
    });
  });
});
