import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableTitle } from './EditableTitle';

describe('EditableTitle', () => {
  const defaultProps = {
    value: 'Insurance Claim Dispute',
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders title value in rest state', () => {
      render(<EditableTitle {...defaultProps} />);
      expect(screen.getByText('Insurance Claim Dispute')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
      render(
        <EditableTitle
          {...defaultProps}
          value=""
          placeholder="Enter title..."
        />
      );
      expect(screen.getByText('Enter title...')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <EditableTitle {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders as h1 element', () => {
      const { container } = render(<EditableTitle {...defaultProps} />);
      expect(container.querySelector('h1')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      await user.click(title);

      expect(screen.getByRole('textbox', { name: /edit title/i })).toBeInTheDocument();
    });

    it('shows input with current value', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      expect(screen.getByRole('textbox')).toHaveValue('Insurance Claim Dispute');
    });

    it('shows save and cancel buttons', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      expect(screen.getByRole('button', { name: /save title/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel editing/i })).toBeInTheDocument();
    });

    it('enters edit mode on Enter key', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      title.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('enters edit mode on Space key', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      title.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave when clicking save button', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Title');

      await user.click(screen.getByRole('button', { name: /save title/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('New Title');
      });
    });

    it('calls onSave on Enter key press', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Title');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('New Title');
      });
    });

    it('exits edit mode after successful save', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Title');
      await user.click(screen.getByRole('button', { name: /save title/i }));

      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });

    it('does not call onSave if value unchanged', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));
      await user.click(screen.getByRole('button', { name: /save title/i }));

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Behavior', () => {
    it('exits edit mode on cancel button click', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.click(screen.getByRole('heading', { level: 1 }));
      await user.click(screen.getByRole('button', { name: /cancel editing/i }));

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.click(screen.getByRole('heading', { level: 1 }));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('resets value on cancel', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Modified Title');
      await user.click(screen.getByRole('button', { name: /cancel editing/i }));

      expect(screen.getByText('Insurance Claim Dispute')).toBeInTheDocument();
    });

    it('does not call onSave when cancelled', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Modified Title');
      await user.keyboard('{Escape}');

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('shows validation error', async () => {
      const user = userEvent.setup();
      const validate = vi.fn().mockReturnValue('Title is required');
      render(<EditableTitle {...defaultProps} validate={validate} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save title/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
    });

    it('does not call onSave with validation error', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const validate = vi.fn().mockReturnValue('Title is required');
      render(
        <EditableTitle {...defaultProps} onSave={onSave} validate={validate} />
      );

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save title/i }));

      expect(onSave).not.toHaveBeenCalled();
    });

    it('clears error when typing', async () => {
      const user = userEvent.setup();
      const validate = vi.fn().mockReturnValue('Title is required');
      render(<EditableTitle {...defaultProps} validate={validate} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save title/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();

      await user.type(input, 'New');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows error message on save failure', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Title');
      await user.click(screen.getByRole('button', { name: /save title/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('remains in edit mode on save failure', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableTitle {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Title');
      await user.click(screen.getByRole('button', { name: /save title/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} readonly />);

      const title = screen.getByText('Insurance Claim Dispute');
      await user.click(title);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('does not show hover state when readonly', () => {
      render(<EditableTitle {...defaultProps} readonly />);

      const title = screen.getByText('Insurance Claim Dispute');
      fireEvent.mouseEnter(title);

      expect(title).not.toHaveClass('bg-gray-200');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', () => {
      render(<EditableTitle {...defaultProps} isEditing={true} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', async () => {
      const user = userEvent.setup();
      const onEditingChange = vi.fn();
      render(
        <EditableTitle
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      await user.click(screen.getByRole('heading', { level: 1 }));

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Hover State', () => {
    it('shows hover background on mouse enter', () => {
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      fireEvent.mouseEnter(title);

      expect(title).toHaveClass('bg-gray-200');
    });

    it('removes hover background on mouse leave', () => {
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      fireEvent.mouseEnter(title);
      fireEvent.mouseLeave(title);

      expect(title).not.toHaveClass('bg-gray-200');
    });
  });

  describe('Accessibility', () => {
    it('has correct role and aria attributes', () => {
      render(<EditableTitle {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAttribute('aria-readonly', 'false');
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EditableTitle {...defaultProps} />);

      await user.tab();
      expect(
        screen.getByRole('heading', { level: 1 })
      ).toHaveFocus();
    });

    it('input is marked invalid with validation error', async () => {
      const user = userEvent.setup();
      const validate = vi.fn().mockReturnValue('Title is required');
      render(<EditableTitle {...defaultProps} validate={validate} />);

      await user.click(screen.getByRole('heading', { level: 1 }));

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save title/i }));

      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
