import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('should render with children only', () => {
    render(<Alert>Line 1</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Line 1');
  });

  it('should render with children and description when showLine2 is true', () => {
    render(<Alert description="Line 2" showLine2>Line 1</Alert>);
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  it('should render Neutral type (default)', () => {
    render(<Alert>Test</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should render Error type', () => {
    render(<Alert type="Error">Error message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should render with icon at start position (flipIcon=false)', () => {
    render(
      <Alert 
        icon={<span data-testid="test-icon">icon</span>}
        showIcon
        flipIcon={false}
      >
        Test
      </Alert>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render with icon at end position (flipIcon=true)', () => {
    render(
      <Alert 
        icon={<span data-testid="test-icon">icon</span>}
        showIcon
        flipIcon
      >
        Test
      </Alert>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render with action button when showButton is true', () => {
    render(
      <Alert 
        action={<button data-testid="action-button">Action</button>}
        showButton
      >
        Test
      </Alert>
    );
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('should render all props together', () => {
    render(
      <Alert
        type="Error"
        description="Line 2"
        showLine2
        icon={<span data-testid="test-icon">icon</span>}
        showIcon
        flipIcon
        action={<button data-testid="action-button">Action</button>}
        showButton
      >
        Line 1
      </Alert>
    );
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Alert className="custom-class">Test</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('should not render description when showLine2 is false', () => {
    render(<Alert description="Line 2" showLine2={false}>Only title</Alert>);
    expect(screen.queryByText('Line 2')).not.toBeInTheDocument();
  });

  it('should not render icon when showIcon is false', () => {
    const { container } = render(
      <Alert icon={<span data-testid="test-icon">icon</span>} showIcon={false}>
        Test
      </Alert>
    );
    const iconContainer = container.querySelector('[data-testid="test-icon"]');
    expect(iconContainer).not.toBeInTheDocument();
  });

  it('should not render action when showButton is false', () => {
    const { container } = render(
      <Alert action={<button data-testid="action-button">Action</button>} showButton={false}>
        Test
      </Alert>
    );
    const actionButton = container.querySelector('[data-testid="action-button"]');
    expect(actionButton).not.toBeInTheDocument();
  });
});
