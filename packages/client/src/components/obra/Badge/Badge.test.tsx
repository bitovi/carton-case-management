import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Content rendering', () => {
    it('should render with children', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should render with iconLeft', () => {
      render(
        <Badge iconLeft={<span data-testid="left-icon">←</span>}>
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should render with iconRight', () => {
      render(
        <Badge iconRight={<span data-testid="right-icon">→</span>}>
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should render with both icons', () => {
      render(
        <Badge
          iconLeft={<span data-testid="left-icon">←</span>}
          iconRight={<span data-testid="right-icon">→</span>}
        >
          With Both Icons
        </Badge>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With Both Icons')).toBeInTheDocument();
    });
  });

  describe('Variant styles', () => {
    it('should apply primary variant styles by default', () => {
      const { container } = render(<Badge>Primary</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-primary');
      expect(badge).toHaveClass('text-primary-foreground');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(
        <Badge variant="secondary">Secondary</Badge>
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-secondary');
      expect(badge).toHaveClass('text-secondary-foreground');
    });

    it('should apply outline variant styles', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-transparent');
      expect(badge).toHaveClass('border');
      expect(badge).toHaveClass('border-border');
      expect(badge).toHaveClass('text-foreground');
    });

    it('should apply ghost variant styles', () => {
      const { container } = render(<Badge variant="ghost">Ghost</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-transparent');
      expect(badge).toHaveClass('text-foreground');
    });

    it('should apply destructive variant styles', () => {
      const { container } = render(
        <Badge variant="destructive">Destructive</Badge>
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-destructive');
      expect(badge).toHaveClass('text-white');
    });
  });

  describe('Roundness styles', () => {
    it('should apply default roundness by default', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('rounded-lg');
    });

    it('should apply round/pill roundness', () => {
      const { container } = render(
        <Badge roundness="round">RoundBadge</Badge>
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('rounded-full');
    });
  });

  describe('Focus styles', () => {
    it('should apply standard focus ring for non-destructive variants', () => {
      const { container } = render(<Badge variant="primary">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('focus-visible:shadow-[0_0_0_3px_var(--focus-ring,#CBD5E1)]');
    });

    it('should apply error focus ring for destructive variant', () => {
      const { container } = render(
        <Badge variant="destructive">Error</Badge>
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('focus-visible:shadow-[0_0_0_3px_var(--focus-ring-error,#FCA5A5)]');
    });
  });

  describe('Custom styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Badge className="custom-class">Badge</Badge>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should merge custom className with base classes', () => {
      const { container } = render(
        <Badge className="ml-4" variant="secondary">
          Badge
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('ml-4');
      expect(badge).toHaveClass('bg-secondary');
    });
  });

  describe('Base layout and typography', () => {
    it('should apply correct layout classes', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('justify-center');
      expect(badge).toHaveClass('gap-[6px]');
    });

    it('should apply correct typography classes', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-semibold');
      expect(badge).toHaveClass('leading-4');
      expect(badge).toHaveClass('tracking-[0.18px]');
    });

    it('should apply correct padding and height', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-[3px]');
      expect(badge).toHaveClass('min-h-[24px]');
    });
  });

  describe('Semantic HTML', () => {
    it('should render as a span element', () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });
  });
});

