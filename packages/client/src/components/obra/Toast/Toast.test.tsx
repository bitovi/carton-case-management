import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders with success type by default', () => {
    render(
      <Toast
        title="Success!"
        message="Operation completed successfully."
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('renders with deleted type', () => {
    render(
      <Toast
        type="Deleted"
        title="Deleted"
        message="Item has been deleted."
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Deleted')).toBeInTheDocument();
    expect(screen.getByText('Item has been deleted.')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test"
        message="Test message"
        onDismiss={onDismiss}
      />
    );

    await user.click(screen.getByText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test"
        message="Test message"
        onDismiss={onDismiss}
      />
    );

    const backdrop = screen.getByRole('alert').previousElementSibling;
    if (backdrop) {
      await user.click(backdrop);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    }
  });

  it('does not render when open is false', () => {
    render(
      <Toast
        title="Test"
        message="Test message"
        open={false}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(
      <Toast
        title="Custom"
        message="Custom icon test"
        icon={<span data-testid="custom-icon">⭐</span>}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
