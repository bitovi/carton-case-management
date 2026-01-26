import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('should render correctly when open', () => {
    render(<Sheet open={true}>Test content</Sheet>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should not render content when closed', () => {
    render(<Sheet open={false}>Test content</Sheet>);
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('should apply custom className to panel', () => {
    render(<Sheet open={true} className="custom-class">Content</Sheet>);
    const panel = document.querySelector('.custom-class');
    expect(panel).toBeTruthy();
  });

  it('should render children when open', () => {
    render(
      <Sheet open={true}>
        <div data-testid="child">Child element</div>
      </Sheet>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render header when provided', () => {
    render(
      <Sheet open={true} header={<div data-testid="header">Header</div>}>
        Content
      </Sheet>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(
      <Sheet open={true} footer={<div data-testid="footer">Footer</div>}>
        Content
      </Sheet>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
