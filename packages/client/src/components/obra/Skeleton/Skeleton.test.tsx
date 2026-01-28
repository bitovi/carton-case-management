import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('should render correctly', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have default animation and styling classes', () => {
    const { container } = render(<Skeleton />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('animate-pulse');
    expect(element).toHaveClass('bg-slate-50');
  });

  it('should render with default object variant', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('rounded-md');
  });

  it('should render with avatar variant', () => {
    const { container } = render(<Skeleton variant="avatar" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('h-10');
    expect(element).toHaveClass('w-10');
    expect(element).toHaveClass('rounded-full');
  });

  it('should render with line variant', () => {
    const { container } = render(<Skeleton variant="line" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('h-4');
    expect(element).toHaveClass('w-full');
    expect(element).toHaveClass('rounded');
  });

  it('should render with object variant', () => {
    const { container } = render(<Skeleton variant="object" />);
    expect(container.firstChild).toHaveClass('rounded-md');
  });

  it('should allow className to override variant styles', () => {
    const { container } = render(
      <Skeleton variant="avatar" className="h-16 w-16" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('h-16');
    expect(element).toHaveClass('w-16');
    expect(element).toHaveClass('rounded-full');
  });

  it('should spread HTML attributes', () => {
    const { container } = render(
      <Skeleton data-testid="skeleton" aria-label="Loading" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('data-testid', 'skeleton');
    expect(element).toHaveAttribute('aria-label', 'Loading');
  });
});
