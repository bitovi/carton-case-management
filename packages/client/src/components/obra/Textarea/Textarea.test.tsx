import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  describe('rendering', () => {
    it('renders a textarea element', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with placeholder text', () => {
      render(<Textarea placeholder="Type here..." />);
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Textarea defaultValue="Initial text" />);
      expect(screen.getByDisplayValue('Initial text')).toBeInTheDocument();
    });

    it('renders with controlled value', () => {
      render(<Textarea value="Controlled text" onChange={() => {}} />);
      expect(screen.getByDisplayValue('Controlled text')).toBeInTheDocument();
    });
  });

  describe('error prop', () => {
    it('applies error styling when error is true', () => {
      render(<Textarea data-testid="textarea" error />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive');
    });

    it('does not apply error styling when error is false', () => {
      render(<Textarea data-testid="textarea" error={false} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).not.toHaveClass('border-destructive');
      expect(textarea).toHaveClass('border-input');
    });

    it('sets aria-invalid when error is true', () => {
      render(<Textarea data-testid="textarea" error />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error is false', () => {
      render(<Textarea data-testid="textarea" error={false} />);
      expect(screen.getByTestId('textarea')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('rounded prop', () => {
    it('applies rounded-md by default', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('rounded-md');
    });

    it('applies rounded-xl when rounded is true', () => {
      render(<Textarea data-testid="textarea" rounded />);
      expect(screen.getByTestId('textarea')).toHaveClass('rounded-xl');
    });

    it('applies rounded-md when rounded is false', () => {
      render(<Textarea data-testid="textarea" rounded={false} />);
      expect(screen.getByTestId('textarea')).toHaveClass('rounded-md');
    });
  });

  describe('resizable prop', () => {
    it('applies resize by default', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('resize');
    });

    it('applies resize-none when resizable is false', () => {
      render(<Textarea data-testid="textarea" resizable={false} />);
      expect(screen.getByTestId('textarea')).toHaveClass('resize-none');
    });

    it('applies resize when resizable is true', () => {
      render(<Textarea data-testid="textarea" resizable />);
      expect(screen.getByTestId('textarea')).toHaveClass('resize');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Textarea data-testid="textarea" disabled />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<Textarea data-testid="textarea" disabled />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('user interaction', () => {
    it('handles typing', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Hello world');
      expect(textarea).toHaveValue('Hello world');
    });

    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea data-testid="textarea" onChange={handleChange} />);

      await user.type(screen.getByTestId('textarea'), 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('does not allow typing when disabled', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" disabled defaultValue="Original" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'New text');
      expect(textarea).toHaveValue('Original');
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      render(<Textarea data-testid="textarea" className="custom-class" />);
      expect(screen.getByTestId('textarea')).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<Textarea data-testid="textarea" className="custom-class" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('min-h-[80px]');
    });
  });

  describe('native attributes', () => {
    it('supports rows attribute', () => {
      render(<Textarea data-testid="textarea" rows={10} />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '10');
    });

    it('supports maxLength attribute', () => {
      render(<Textarea data-testid="textarea" maxLength={100} />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('maxLength', '100');
    });

    it('supports required attribute', () => {
      render(<Textarea data-testid="textarea" required />);
      expect(screen.getByTestId('textarea')).toBeRequired();
    });

    it('supports name attribute', () => {
      render(<Textarea data-testid="textarea" name="description" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('name', 'description');
    });

    it('supports id attribute', () => {
      render(<Textarea data-testid="textarea" id="my-textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('id', 'my-textarea');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = vi.fn();
      render(<Textarea ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('variant combinations', () => {
    it('applies error and rounded together', () => {
      render(<Textarea data-testid="textarea" error rounded />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive', 'rounded-xl');
    });

    it('applies error and resizable={false} together', () => {
      render(<Textarea data-testid="textarea" error resizable={false} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive', 'resize-none');
    });

    it('applies all variants together', () => {
      render(<Textarea data-testid="textarea" error rounded resizable={false} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive', 'rounded-xl', 'resize-none');
    });
  });
});
