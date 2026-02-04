import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders with success type by default', () => {
    render(
      <Toast
        title="Success!"
        message="Operation completed successfully"
      />
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('renders with deleted type', () => {
    render(
      <Toast
        type="deleted"
        title="Deleted"
        message="Case has been deleted"
      />
    );
    
    expect(screen.getByText('Deleted')).toBeInTheDocument();
    expect(screen.getByText('Case has been deleted')).toBeInTheDocument();
  });

  it('renders with error type', () => {
    render(
      <Toast
        type="error"
        title="Error"
        message="Something went wrong"
      />
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();
    
    render(
      <Toast
        title="Test"
        message="Test message"
        onDismiss={handleDismiss}
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when showDismiss is false', () => {
    render(
      <Toast
        title="Test"
        message="Test message"
        showDismiss={false}
      />
    );
    
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Toast
        title="Test"
        message="Test message"
        className="custom-class"
      />
    );
    
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });
});
