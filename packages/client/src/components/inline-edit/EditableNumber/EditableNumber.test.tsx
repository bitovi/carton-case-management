import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableNumber } from './EditableNumber';

describe('EditableNumber', () => {
  const defaultProps = {
    label: 'Zip Code',
    value: 55555,
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<EditableNumber {...defaultProps} />);
      expect(screen.getByText('Zip Code')).toBeInTheDocument();
    });

    it('renders value in rest state', () => {
      render(<EditableNumber {...defaultProps} />);
      expect(screen.getByText('55555')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditableNumber
          {...defaultProps}
          displayValue={<strong>Custom Number</strong>}
        />
      );
      expect(screen.getByText('Custom Number')).toBeInTheDocument();
    });

    it('renders placeholder when value is null', () => {
      render(
        <EditableNumber
          {...defaultProps}
          value={null}
          placeholder="Enter zip code..."
        />
      );
      expect(screen.getByText('Enter zip code...')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <EditableNumber {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('formats number with decimal places', () => {
      render(<EditableNumber {...defaultProps} value={1234.567} decimalPlaces={2} />);
      expect(screen.getByText('1234.57')).toBeInTheDocument();
    });

    it('formats number with grouping separators', () => {
      render(<EditableNumber {...defaultProps} value={1234567} useGrouping={true} />);
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      render(<EditableNumber {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit zip code/i });

      fireEvent.click(content);

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('populates input with current value', async () => {
      render(<EditableNumber {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit zip code/i });

      fireEvent.click(content);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('55555');
    });

    it('shows save and cancel buttons in edit mode', async () => {
      render(<EditableNumber {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit zip code/i });

      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('applies min/max/step to input', async () => {
      render(<EditableNumber {...defaultProps} min={0} max={99999} step={1} />);
      const content = screen.getByRole('button', { name: /edit zip code/i });

      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '99999');
      expect(input).toHaveAttribute('step', '1');
    });

    it('applies placeholder to input', async () => {
      render(
        <EditableNumber {...defaultProps} value={null} placeholder="Enter zip code..." />
      );
      const content = screen.getByRole('button', { name: /edit zip code/i });

      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('placeholder', 'Enter zip code...');
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave with new numeric value on save button click', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '12345' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(12345);
      });
    });

    it('calls onSave on Enter key press', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      await user.click(content);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '67890{Enter}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(67890);
      });
    });

    it('exits edit mode after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      });
    });

    it('saves null when input is empty', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(null);
      });
    });

    it('saves decimal values correctly', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '123.45' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(123.45);
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('exits edit mode on cancel button click', async () => {
      render(<EditableNumber {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<EditableNumber {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      await user.click(content);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('does not call onSave when cancelled', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '99999' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('displays min constraint error', async () => {
      render(<EditableNumber {...defaultProps} min={10000} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '100' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Value must be at least 10000');
      });
    });

    it('displays max constraint error', async () => {
      render(<EditableNumber {...defaultProps} max={10000} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '99999' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Value must be at most 10000');
      });
    });

    it('displays custom validation function error', async () => {
      const validate = (val: number | null) =>
        val !== null && val % 5 !== 0 ? 'Must be divisible by 5' : null;
      render(<EditableNumber {...defaultProps} validate={validate} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '12' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Must be divisible by 5');
      });
    });

    it('stays in edit mode when validation fails', async () => {
      render(<EditableNumber {...defaultProps} min={99999} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      });
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', () => {
      render(<EditableNumber {...defaultProps} readonly />);
      const content = screen.getByText('55555');

      fireEvent.click(content);

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('does not show hover state when readonly', () => {
      render(<EditableNumber {...defaultProps} readonly />);
      const content = screen.getByText('55555');

      fireEvent.mouseEnter(content);

      expect(content).not.toHaveClass('bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', () => {
      render(<EditableNumber {...defaultProps} isEditing={true} />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', () => {
      const onEditingChange = vi.fn();
      render(
        <EditableNumber
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('displays save error message', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('returns to edit mode after save error', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<EditableNumber {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('save button has accessible label', async () => {
      render(<EditableNumber {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('cancel button has accessible label', async () => {
      render(<EditableNumber {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit zip code/i });
      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EditableNumber {...defaultProps} />);

      await user.tab();
      expect(screen.getByRole('button', { name: /edit zip code/i })).toHaveFocus();
    });
  });
});
