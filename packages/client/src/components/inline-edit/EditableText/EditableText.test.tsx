import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableText } from './EditableText';
import { z } from 'zod';

describe('EditableText', () => {
  const defaultProps = {
    label: 'Name',
    value: 'John Doe',
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<EditableText {...defaultProps} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders value in rest state', () => {
      render(<EditableText {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditableText
          {...defaultProps}
          displayValue={<strong>Custom Name</strong>}
        />
      );
      expect(screen.getByText('Custom Name')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
      render(
        <EditableText
          {...defaultProps}
          value=""
          placeholder="Enter name..."
        />
      );
      expect(screen.getByText('Enter name...')).toBeInTheDocument();
    });

    it('renders "Not set" when value is empty and no placeholder', () => {
      render(<EditableText {...defaultProps} value="" />);
      expect(screen.getByText('Not set')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <EditableText {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      render(<EditableText {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('populates input with current value', async () => {
      render(<EditableText {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('John Doe');
    });

    it('shows save and cancel buttons in edit mode', async () => {
      render(<EditableText {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('applies maxLength to input', async () => {
      render(<EditableText {...defaultProps} maxLength={10} />);
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('applies placeholder to input', async () => {
      render(
        <EditableText {...defaultProps} value="" placeholder="Enter name..." />
      );
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter name...');
    });

    it('uses correct input type', async () => {
      render(<EditableText {...defaultProps} type="email" />);
      const content = screen.getByRole('button', { name: /edit name/i });

      fireEvent.click(content);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave with new value on save button click', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Jane Doe' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('Jane Doe');
      });
    });

    it('calls onSave on Enter key press', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      await user.click(content);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Name{Enter}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('New Name');
      });
    });

    it('exits edit mode after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('exits edit mode on cancel button click', async () => {
      render(<EditableText {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<EditableText {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      await user.click(content);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('does not call onSave when cancelled', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Changed' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('displays Zod validation error', async () => {
      const validate = z.string().email('Please enter a valid email');
      render(
        <EditableText {...defaultProps} value="invalid" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Please enter a valid email'
        );
      });
    });

    it('displays custom validation function error', async () => {
      const validate = (val: string) =>
        val.length < 3 ? 'Must be at least 3 characters' : null;
      render(
        <EditableText {...defaultProps} value="ab" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Must be at least 3 characters'
        );
      });
    });

    it('stays in edit mode when validation fails', async () => {
      const validate = z.string().min(5, 'Too short');
      render(<EditableText {...defaultProps} value="abc" validate={validate} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', () => {
      render(<EditableText {...defaultProps} readonly />);
      const content = screen.getByText('John Doe');

      fireEvent.click(content);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('does not show hover state when readonly', () => {
      render(<EditableText {...defaultProps} readonly />);
      const content = screen.getByText('John Doe');

      fireEvent.mouseEnter(content);

      expect(content).not.toHaveClass('bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', () => {
      render(<EditableText {...defaultProps} isEditing={true} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', () => {
      const onEditingChange = vi.fn();
      render(
        <EditableText
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('displays save error message', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('returns to edit mode after save error', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<EditableText {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('save button has accessible label', async () => {
      render(<EditableText {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('cancel button has accessible label', async () => {
      render(<EditableText {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit name/i });
      fireEvent.click(content);

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EditableText {...defaultProps} />);

      await user.tab();
      expect(
        screen.getByRole('button', { name: /edit name/i })
      ).toHaveFocus();
    });
  });
});
