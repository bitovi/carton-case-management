import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('should render with success type by default', () => {
    render(
      <Toast
        id="test-toast"
        title="Success!"
        message="Operation completed successfully"
      />
    );
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render deleted type with warning icon', () => {
    render(
      <Toast
        id="test-toast"
        type="deleted"
        title="Deleted"
        message="Item has been removed"
      />
    );
    
    expect(screen.getByText('Deleted')).toBeInTheDocument();
    expect(screen.getByText('Item has been removed')).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();
    
    render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test message"
        onDismiss={handleDismiss}
      />
    );
    
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('should render custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">⭐</span>;
    
    render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test message"
        icon={<CustomIcon />}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test message"
        className="custom-class"
      />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Toast
        id="test-toast-123"
        title="Test"
        message="Test message"
      />
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('data-toast-id', 'test-toast-123');
  });
});
