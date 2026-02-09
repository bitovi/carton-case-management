import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersTrigger } from './FiltersTrigger';

describe('FiltersTrigger', () => {
  it('renders with default props', () => {
    render(<FiltersTrigger />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays badge when activeCount is greater than 0', () => {
    render(<FiltersTrigger activeCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not display badge when activeCount is 0', () => {
    render(<FiltersTrigger activeCount={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('applies selected style when selected is true', () => {
    render(<FiltersTrigger selected={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('applies default style when selected is false', () => {
    render(<FiltersTrigger selected={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FiltersTrigger onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<FiltersTrigger className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
