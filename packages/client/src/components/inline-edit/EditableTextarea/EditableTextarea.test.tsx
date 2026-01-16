import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableTextarea } from './EditableTextarea';
import { z } from 'zod';

describe('EditableTextarea', () => {
  const defaultProps = {
    label: 'Description',
    value: 'This is a test description.',
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<EditableTextarea {...defaultProps} />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders value in rest state', () => {
      render(<EditableTextarea {...defaultProps} />);
      expect(screen.getByText('This is a test description.')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <EditableTextarea
          {...defaultProps}
          displayValue={<strong>Custom Content</strong>}
        />
      );
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
      render(
        <EditableTextarea
          {...defaultProps}
          value=""
          placeholder="Enter description..."
        />
      );
      expect(screen.getByText('Enter description...')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <EditableTextarea {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('preserves whitespace and line breaks in content', () => {
      render(
        <EditableTextarea
          {...defaultProps}
          value={'Line 1\nLine 2\nLine 3'}
        />
      );
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode on click', async () => {
      render(<EditableTextarea {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('populates textarea with current value', async () => {
      render(<EditableTextarea {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('This is a test description.');
    });

    it('shows Save and Cancel text buttons in edit mode', async () => {
      render(<EditableTextarea {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('applies maxLength to textarea', async () => {
      render(<EditableTextarea {...defaultProps} maxLength={100} />);
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('applies placeholder to textarea', async () => {
      render(
        <EditableTextarea
          {...defaultProps}
          value=""
          placeholder="Enter description..."
        />
      );
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Enter description...');
    });

    it('applies custom minHeight to textarea', async () => {
      render(<EditableTextarea {...defaultProps} minHeight={100} />);
      const content = screen.getByRole('button', { name: /edit description/i });

      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveStyle({ minHeight: '100px' });
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave with new value on Save button click', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, {
        target: { value: 'Updated description text.' },
      });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('Updated description text.');
      });
    });

    it('calls onSave on Ctrl+Enter key press', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      await user.click(content);

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New content');
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('New content');
      });
    });

    it('calls onSave on Cmd+Enter key press (Mac)', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      await user.click(content);

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New content');
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('New content');
      });
    });

    it('exits edit mode after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });

    it('shows saving indicator during save', async () => {
      const onSave = vi.fn(
        (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      expect(screen.getByText(/saving/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Cancel Behavior', () => {
    it('exits edit mode on Cancel button click', async () => {
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      await user.click(content);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('does not call onSave when cancelled', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Changed content' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onSave).not.toHaveBeenCalled();
    });

    it('reverts textarea value when cancelled', async () => {
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Changed content' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Re-enter edit mode
      fireEvent.click(content);

      const newTextarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(newTextarea.value).toBe('This is a test description.');
    });
  });

  describe('Validation', () => {
    it('displays Zod validation error', async () => {
      const validate = z.string().min(10, 'Must be at least 10 characters');
      render(
        <EditableTextarea
          {...defaultProps}
          value="short"
          validate={validate}
        />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Must be at least 10 characters'
        );
      });
    });

    it('displays custom validation function error', async () => {
      const validate = (val: string) =>
        val.length < 5 ? 'Description is too short' : null;
      render(
        <EditableTextarea {...defaultProps} value="test" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Description is too short'
        );
      });
    });

    it('stays in edit mode when validation fails', async () => {
      const validate = z.string().min(50, 'Too short');
      render(
        <EditableTextarea {...defaultProps} value="abc" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('clears validation error when editing continues', async () => {
      const validate = z.string().min(10, 'Too short');
      render(
        <EditableTextarea {...defaultProps} value="short" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      // Trigger validation error
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Continue editing
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Longer content now' } });

      // Error should be cleared
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Readonly Mode', () => {
    it('does not enter edit mode when readonly', () => {
      render(<EditableTextarea {...defaultProps} readonly />);
      const content = screen.getByText('This is a test description.');

      fireEvent.click(content);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('does not have role=button when readonly', () => {
      render(<EditableTextarea {...defaultProps} readonly />);
      expect(
        screen.queryByRole('button', { name: /edit description/i })
      ).not.toBeInTheDocument();
    });

    it('is not focusable when readonly', () => {
      render(<EditableTextarea {...defaultProps} readonly />);
      const content = screen.getByText('This is a test description.');

      expect(content.parentElement).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', () => {
      render(<EditableTextarea {...defaultProps} isEditing={true} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', () => {
      const onEditingChange = vi.fn();
      render(
        <EditableTextarea
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });

    it('calls onEditingChange when exiting edit mode', async () => {
      const onEditingChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(
        <EditableTextarea
          {...defaultProps}
          isEditing={true}
          onEditingChange={onEditingChange}
          onSave={onSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onEditingChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('displays save error message', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
    });

    it('stays in edit mode after save error', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('preserves textarea value after save error', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'My edited content' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Verify the value is preserved
      expect(screen.getByRole('textbox')).toHaveValue('My edited content');
    });
  });

  describe('Accessibility', () => {
    it('Save button has accessible label', async () => {
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('Cancel button has accessible label', async () => {
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EditableTextarea {...defaultProps} />);

      await user.tab();
      expect(
        screen.getByRole('button', { name: /edit description/i })
      ).toHaveFocus();
    });

    it('textarea has aria-label', async () => {
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Description');
    });

    it('textarea has aria-invalid when error exists', async () => {
      const validate = z.string().min(100, 'Too short');
      render(
        <EditableTextarea {...defaultProps} value="short" validate={validate} />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveAttribute(
          'aria-invalid',
          'true'
        );
      });
    });

    it('enters edit mode on Enter key in rest state', async () => {
      const user = userEvent.setup();
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      content.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('enters edit mode on Space key in rest state', async () => {
      const user = userEvent.setup();
      render(<EditableTextarea {...defaultProps} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      content.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Multi-line Content', () => {
    it('handles multi-line values correctly', async () => {
      const multiLineValue = 'Line 1\nLine 2\nLine 3';
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(
        <EditableTextarea
          {...defaultProps}
          value={multiLineValue}
          onSave={onSave}
        />
      );

      const content = screen.getByRole('button', { name: /edit description/i });
      fireEvent.click(content);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe(multiLineValue);

      fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3\nLine 4' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('Line 1\nLine 2\nLine 3\nLine 4');
      });
    });

    it('allows Enter key for new lines without saving', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<EditableTextarea {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit description/i });
      await user.click(content);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{Enter}New line');

      // Should not have called save just from Enter
      expect(onSave).not.toHaveBeenCalled();
      // The textarea should now have new content
      expect(textarea).toHaveValue('This is a test description.\nNew line');
    });
  });
});
