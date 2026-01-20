import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  // ==========================================================================
  // BASIC RENDERING
  // ==========================================================================

  it('should render with default props', () => {
    render(<Input placeholder="Enter value" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('should render with a value', () => {
    render(<Input defaultValue="Test value" />);
    expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('custom-class');
  });

  it('should forward ref to input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // ==========================================================================
  // SIZE VARIANTS
  // ==========================================================================

  it('should render with size="mini"', () => {
    render(<Input size="mini" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('h-6');
  });

  it('should render with size="sm"', () => {
    render(<Input size="sm" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('h-8');
  });

  it('should render with size="md" (default)', () => {
    render(<Input size="md" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('h-9');
  });

  it('should render with size="lg"', () => {
    render(<Input size="lg" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('h-10');
  });

  // ==========================================================================
  // ROUNDNESS VARIANTS
  // ==========================================================================

  it('should render with roundness="default"', () => {
    render(<Input roundness="default" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('rounded-md');
  });

  it('should render with roundness="round"', () => {
    render(<Input roundness="round" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('rounded-full');
  });

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  it('should render with error state', () => {
    render(<Input error data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('border-destructive');
  });

  it('should not have error styling when error is false', () => {
    render(<Input error={false} data-testid="input" />);
    expect(screen.getByTestId('input')).not.toHaveClass('border-destructive');
  });

  // ==========================================================================
  // DISABLED STATE
  // ==========================================================================

  it('should render disabled state', () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('should have disabled styling', () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('disabled:opacity-50');
  });

  // ==========================================================================
  // DECORATORS
  // ==========================================================================

  it('should render with left decorator', () => {
    render(
      <Input
        leftDecorator={<span data-testid="left-decorator">$</span>}
        placeholder="Amount"
      />
    );
    expect(screen.getByTestId('left-decorator')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('should render with right decorator', () => {
    render(
      <Input
        rightDecorator={<span data-testid="right-decorator">USD</span>}
        placeholder="Amount"
      />
    );
    expect(screen.getByTestId('right-decorator')).toBeInTheDocument();
  });

  it('should render with both decorators', () => {
    render(
      <Input
        leftDecorator={<span data-testid="left-decorator">$</span>}
        rightDecorator={<span data-testid="right-decorator">USD</span>}
        placeholder="Amount"
      />
    );
    expect(screen.getByTestId('left-decorator')).toBeInTheDocument();
    expect(screen.getByTestId('right-decorator')).toBeInTheDocument();
  });

  it('should wrap input in container when decorators are present', () => {
    const { container } = render(
      <Input
        leftDecorator={<span>$</span>}
        placeholder="Amount"
      />
    );
    // With decorators, input is wrapped in a div
    const wrapper = container.querySelector('div');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.querySelector('input')).toBeInTheDocument();
  });

  // ==========================================================================
  // USER INTERACTION
  // ==========================================================================

  it('should allow user to type in the input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('should not allow typing when disabled', async () => {
    const user = userEvent.setup();
    render(<Input disabled placeholder="Type here" defaultValue="" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('');
  });

  it('should call onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hi');
    
    expect(handleChange).toHaveBeenCalled();
  });

  // ==========================================================================
  // INPUT TYPES
  // ==========================================================================

  it('should render as password input', () => {
    render(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
  });

  it('should render as email input', () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
  });

  it('should render as number input', () => {
    render(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });

  // ==========================================================================
  // COMBINED VARIANTS
  // ==========================================================================

  it('should combine size and roundness variants', () => {
    render(
      <Input size="lg" roundness="round" data-testid="input" />
    );
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('h-10');
    expect(input).toHaveClass('rounded-full');
  });

  it('should combine error and disabled states', () => {
    render(
      <Input error disabled data-testid="input" />
    );
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border-destructive');
    expect(input).toBeDisabled();
  });

  it('should apply all variants together', () => {
    render(
      <Input
        size="sm"
        roundness="round"
        error
        leftDecorator={<span data-testid="icon">🔍</span>}
        placeholder="Search"
      />
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
