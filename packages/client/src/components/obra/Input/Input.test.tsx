import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import { Search, X } from 'lucide-react';

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('should render an input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should apply placeholder text', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('should handle value prop', () => {
      render(<Input value="test value" readOnly />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });
  });

  describe('Size Variants', () => {
    it('should render mini size', () => {
      render(<Input size="mini" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-6', 'px-2', 'text-xs');
    });

    it('should render small size', () => {
      render(<Input size="small" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-8', 'px-3', 'text-sm');
    });

    it('should render regular size by default', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-9', 'px-4', 'text-sm');
    });

    it('should render large size', () => {
      render(<Input size="large" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-10', 'px-6', 'text-sm');
    });
  });

  describe('Roundness Variants', () => {
    it('should render default roundness', () => {
      render(<Input roundness="default" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('rounded-lg');
    });

    it('should render round variant', () => {
      render(<Input roundness="round" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('rounded-full');
    });
  });

  describe('Error State', () => {
    it('should not show error styling by default', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-border');
      expect(input).toHaveClass('focus-visible:shadow-[0_0_0_3px_var(--focus-ring,#CBD5E1)]');
    });

    it('should show error styling when error prop is true', () => {
      render(<Input error data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-destructive');
      expect(input).toHaveClass('focus-visible:shadow-[0_0_0_3px_var(--focus-ring-error,#FCA5A5)]');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should apply disabled styling classes', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('Decorations', () => {
    it('should render without decorations by default', () => {
      const { container } = render(<Input />);
      expect(container.querySelectorAll('[class*="absolute"]')).toHaveLength(0);
    });

    it('should render left decoration', () => {
      const { container } = render(
        <Input
          leftDecoration={<Search data-testid="left-icon" />}
          placeholder="Search"
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(container.querySelector('.left-3')).toBeInTheDocument();
    });

    it('should render right decoration', () => {
      const { container } = render(
        <Input
          rightDecoration={<X data-testid="right-icon" />}
          placeholder="Clear"
        />
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(container.querySelector('.right-3')).toBeInTheDocument();
    });

    it('should render both left and right decorations', () => {
      render(
        <Input
          leftDecoration={<Search data-testid="left-icon" />}
          rightDecoration={<X data-testid="right-icon" />}
          placeholder="Search"
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should apply padding when left decoration is present', () => {
      render(
        <Input
          leftDecoration={<Search />}
          data-testid="input"
          placeholder="Search"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('pl-10');
    });

    it('should apply padding when right decoration is present', () => {
      render(
        <Input
          rightDecoration={<X />}
          data-testid="input"
          placeholder="Clear"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('pr-10');
    });
  });

  describe('Type Attribute', () => {
    it('should use text type by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should support email type', () => {
      render(<Input type="email" />);
      const input = document.querySelector('input[type="email"]');
      expect(input).toBeInTheDocument();
    });

    it('should support password type', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(<Input className="custom-class" data-testid="input" />);
      const inputContainer = container.firstChild;
      expect(inputContainer).toHaveClass('custom-class');
    });

    it('should merge custom className with variant classes', () => {
      const { container } = render(<Input size="large" className="custom-class" data-testid="input" />);
      const inputContainer = container.firstChild;
      expect(inputContainer).toHaveClass('custom-class');
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-10', 'px-6');
    });
  });

  describe('Combined Variants', () => {
    it('should handle mini + round combination', () => {
      render(<Input size="mini" roundness="round" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-6', 'rounded-full');
    });

    it('should handle large + error combination', () => {
      render(<Input size="large" error data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-10', 'border-destructive');
    });

    it('should handle small + round + error combination', () => {
      render(<Input size="small" roundness="round" error data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-8', 'rounded-full', 'border-destructive');
    });
  });



  describe('HTML Attributes', () => {
    it('should spread additional HTML attributes', () => {
      render(<Input name="test-input" id="test-id" autoComplete="off" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'test-input');
      expect(input).toHaveAttribute('id', 'test-id');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });

    it('should support aria attributes', () => {
      render(<Input aria-label="Search input" aria-describedby="error-message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search input');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
    });
  });
});
