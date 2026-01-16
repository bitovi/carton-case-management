import type { RefObject } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BaseEditable } from './BaseEditable';
import { z } from 'zod';

describe('BaseEditable', () => {
  const defaultProps = {
    label: 'Test Label',
    value: 'Test Value',
    onSave: vi.fn().mockResolvedValue(undefined),
    renderEditMode: vi.fn(({ value, onSave, onCancel, inputRef }) => (
      <div data-testid="edit-mode">
        <input
          ref={inputRef as RefObject<HTMLInputElement>}
          defaultValue={value as string}
          data-testid="edit-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave((e.target as HTMLInputElement).value);
            if (e.key === 'Escape') onCancel();
          }}
        />
        <button onClick={() => onSave('new value')} data-testid="save-btn">
          Save
        </button>
        <button onClick={onCancel} data-testid="cancel-btn">
          Cancel
        </button>
      </div>
    )),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<BaseEditable {...defaultProps} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders value in rest state', () => {
      render(<BaseEditable {...defaultProps} />);
      expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    it('renders custom displayValue when provided', () => {
      render(
        <BaseEditable
          {...defaultProps}
          displayValue={<span data-testid="custom-display">Custom Display</span>}
        />
      );
      expect(screen.getByTestId('custom-display')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <BaseEditable {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('State Transitions', () => {
    it('transitions to interest state on mouse enter', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.mouseEnter(content);

      expect(content).toHaveClass('bg-gray-200');
    });

    it('transitions back to rest state on mouse leave', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.mouseEnter(content);
      expect(content).toHaveClass('bg-gray-200');

      fireEvent.mouseLeave(content);
      expect(content).not.toHaveClass('bg-gray-200');
    });

    it('transitions to interest state on focus', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.focus(content);

      expect(content).toHaveClass('bg-gray-200');
    });

    it('transitions to edit state on click', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.click(content);

      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('transitions to edit state on Enter key in interest state', async () => {
      const user = userEvent.setup();
      render(<BaseEditable {...defaultProps} />);
      screen.getByRole('button', { name: /edit test label/i });

      await user.tab(); // Focus on content
      await user.keyboard('{Enter}');

      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('transitions to edit state on Space key in interest state', async () => {
      const user = userEvent.setup();
      render(<BaseEditable {...defaultProps} />);
      screen.getByRole('button', { name: /edit test label/i });

      await user.tab(); // Focus on content
      await user.keyboard(' ');

      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('renders edit mode UI when in edit state', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.click(content);

      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
      expect(screen.getByTestId('edit-input')).toBeInTheDocument();
    });

    it('passes correct value to renderEditMode', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.click(content);

      const input = screen.getByTestId('edit-input') as HTMLInputElement;
      expect(input.defaultValue).toBe('Test Value');
    });

    it('exits edit mode on cancel', async () => {
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      fireEvent.click(content);
      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('cancel-btn'));
      expect(screen.queryByTestId('edit-mode')).not.toBeInTheDocument();
    });

    it('exits edit mode on Escape key', async () => {
      const user = userEvent.setup();
      render(<BaseEditable {...defaultProps} />);
      const content = screen.getByRole('button', { name: /edit test label/i });

      await user.click(content);
      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('edit-mode')).not.toBeInTheDocument();
    });
  });

  describe('Save Behavior', () => {
    it('calls onSave with new value', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<BaseEditable {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('new value');
      });
    });

    it('shows saving state while save is in progress', async () => {
      let resolvePromise: () => void;
      const savePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      const onSave = vi.fn().mockReturnValue(savePromise);

      render(<BaseEditable {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByLabelText('Saving...')).toBeInTheDocument();
      });

      // Resolve the save
      resolvePromise!();

      await waitFor(() => {
        expect(screen.queryByLabelText('Saving...')).not.toBeInTheDocument();
      });
    });

    it('returns to rest state after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<BaseEditable {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.queryByTestId('edit-mode')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays validation error and stays in edit mode', async () => {
      const validate = z.string().min(5, 'Must be at least 5 characters');
      const renderEditMode = vi.fn(({ value, onSave, inputRef }) => (
        <div data-testid="edit-mode">
          <input
            ref={inputRef as RefObject<HTMLInputElement>}
            defaultValue={value as string}
            data-testid="edit-input"
          />
          <button onClick={() => onSave('abc')} data-testid="save-btn">
            Save
          </button>
        </div>
      ));

      render(
        <BaseEditable
          {...defaultProps}
          validate={validate}
          renderEditMode={renderEditMode}
        />
      );

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Must be at least 5 characters'
        );
      });
      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('displays custom validation function error', async () => {
      const validate = (value: string) =>
        value.length < 5 ? 'Too short' : null;
      const renderEditMode = vi.fn(({ value, onSave, inputRef }) => (
        <div data-testid="edit-mode">
          <input
            ref={inputRef as RefObject<HTMLInputElement>}
            defaultValue={value as string}
          />
          <button onClick={() => onSave('abc')} data-testid="save-btn">
            Save
          </button>
        </div>
      ));

      render(
        <BaseEditable
          {...defaultProps}
          validate={validate}
          renderEditMode={renderEditMode}
        />
      );

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Too short');
      });
    });

    it('displays save error and returns to edit mode', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      render(<BaseEditable {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network error');
      });
      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('clears error when clearError is called', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
      const renderEditMode = vi.fn(({ value, onSave, clearError, inputRef }) => (
        <div data-testid="edit-mode">
          <input
            ref={inputRef as RefObject<HTMLInputElement>}
            defaultValue={value as string}
          />
          <button onClick={() => onSave('new value')} data-testid="save-btn">
            Save
          </button>
          <button onClick={clearError} data-testid="clear-error-btn">
            Clear Error
          </button>
        </div>
      ));

      render(
        <BaseEditable
          {...defaultProps}
          onSave={onSave}
          renderEditMode={renderEditMode}
        />
      );

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('clear-error-btn'));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Readonly Mode', () => {
    it('does not show interest state when readonly', () => {
      render(<BaseEditable {...defaultProps} readonly />);
      const content = screen.getByText('Test Value');

      fireEvent.mouseEnter(content);

      expect(content).not.toHaveClass('bg-gray-200');
    });

    it('does not enter edit mode when readonly', () => {
      render(<BaseEditable {...defaultProps} readonly />);
      const content = screen.getByText('Test Value');

      fireEvent.click(content);

      expect(screen.queryByTestId('edit-mode')).not.toBeInTheDocument();
    });

    it('has tabIndex -1 when readonly', () => {
      render(<BaseEditable {...defaultProps} readonly />);
      const content = screen.getByText('Test Value');

      expect(content).toHaveAttribute('tabIndex', '-1');
    });

    it('has correct aria-readonly attribute when readonly', () => {
      render(<BaseEditable {...defaultProps} readonly />);
      const content = screen.getByText('Test Value');

      expect(content).toHaveAttribute('aria-readonly', 'true');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled isEditing prop', () => {
      render(<BaseEditable {...defaultProps} isEditing={true} />);

      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('calls onEditingChange when entering edit mode', () => {
      const onEditingChange = vi.fn();
      render(
        <BaseEditable
          {...defaultProps}
          isEditing={false}
          onEditingChange={onEditingChange}
        />
      );

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);

      expect(onEditingChange).toHaveBeenCalledWith(true);
    });

    it('calls onEditingChange when exiting edit mode', async () => {
      const onEditingChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <BaseEditable
          {...defaultProps}
          isEditing={true}
          onEditingChange={onEditingChange}
          onSave={onSave}
        />
      );

      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(onEditingChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct role for content area', () => {
      render(<BaseEditable {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: /edit test label/i })
      ).toBeInTheDocument();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<BaseEditable {...defaultProps} />);

      await user.tab();
      expect(
        screen.getByRole('button', { name: /edit test label/i })
      ).toHaveFocus();
    });

    it('displays error with role alert', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Error'));
      render(<BaseEditable {...defaultProps} onSave={onSave} />);

      const content = screen.getByRole('button', { name: /edit test label/i });
      fireEvent.click(content);
      fireEvent.click(screen.getByTestId('save-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
