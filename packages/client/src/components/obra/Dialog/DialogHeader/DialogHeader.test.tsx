import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DialogHeader } from './DialogHeader';

describe('DialogHeader', () => {
  it('should render title and close button when title is provided', () => {
    render(<DialogHeader title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should render only close button when title is not provided', () => {
    render(<DialogHeader />);
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<DialogHeader className="custom-class" title="Test" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
