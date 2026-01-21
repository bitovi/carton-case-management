import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  describe('rendering', () => {
    it('renders with default variant', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse', 'bg-neutral-100', 'rounded-lg');
    });

    it('renders with aria-hidden for accessibility', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('variant prop', () => {
    it('renders default variant with rounded-lg', () => {
      render(<Skeleton data-testid="skeleton" variant="default" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
    });

    it('renders line variant with h-4 and rounded-lg', () => {
      render(<Skeleton data-testid="skeleton" variant="line" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-4', 'rounded-lg');
    });

    it('renders object variant with rounded-lg', () => {
      render(<Skeleton data-testid="skeleton" variant="object" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
    });

    it('renders avatar variant with rounded-full', () => {
      render(<Skeleton data-testid="skeleton" variant="avatar" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('rounded-full');
    });
  });

  describe('size prop (avatar variant)', () => {
    it('renders small avatar with h-8 w-8', () => {
      render(<Skeleton data-testid="skeleton" variant="avatar" size="sm" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-8', 'w-8');
    });

    it('renders medium avatar with h-12 w-12', () => {
      render(<Skeleton data-testid="skeleton" variant="avatar" size="md" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-12', 'w-12');
    });

    it('renders large avatar with h-16 w-16', () => {
      render(<Skeleton data-testid="skeleton" variant="avatar" size="lg" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-16', 'w-16');
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      render(<Skeleton data-testid="skeleton" className="custom-class" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
    });

    it('allows overriding width and height via className', () => {
      render(<Skeleton data-testid="skeleton" className="h-20 w-40" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-20', 'w-40');
    });

    it('combines variant classes with custom className', () => {
      render(
        <Skeleton data-testid="skeleton" variant="line" className="w-full" />
      );
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-4', 'rounded-lg', 'w-full');
    });
  });

  describe('HTML attributes', () => {
    it('spreads additional HTML attributes', () => {
      render(<Skeleton data-testid="skeleton" data-custom="value" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute(
        'data-custom',
        'value'
      );
    });

    it('accepts id attribute', () => {
      render(<Skeleton data-testid="skeleton" id="my-skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('id', 'my-skeleton');
    });
  });

  describe('base styles', () => {
    it('always applies animate-pulse for loading animation', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    });

    it('always applies bg-neutral-100 background', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('bg-neutral-100');
    });
  });

  describe('composition patterns', () => {
    it('renders card loading pattern', () => {
      render(
        <div data-testid="card-skeleton">
          <div className="flex items-center gap-4">
            <Skeleton data-testid="avatar" variant="avatar" />
            <div className="space-y-2">
              <Skeleton data-testid="line1" variant="line" className="w-64" />
              <Skeleton data-testid="line2" variant="line" className="w-48" />
            </div>
          </div>
          <Skeleton data-testid="object" variant="object" className="h-32" />
        </div>
      );

      expect(screen.getByTestId('avatar')).toHaveClass('rounded-full');
      expect(screen.getByTestId('line1')).toHaveClass('h-4');
      expect(screen.getByTestId('line2')).toHaveClass('h-4');
      expect(screen.getByTestId('object')).toHaveClass('rounded-lg');
    });
  });
});
