import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('should not render when open is false', () => {
    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={false}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={true}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render success variant with celebration emoji', () => {
    render(
      <Toast
        variant="success"
        title="Success!"
        message="Operation successful"
        open={true}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /celebration/i })).toBeInTheDocument();
  });

  it('should render error variant with folder icon', () => {
    render(
      <Toast
        variant="error"
        title="Deleted"
        message="Case deleted"
        open={true}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  it('should call onDismiss when Dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={true}
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('should call onDismiss when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={true}
        onDismiss={onDismiss}
      />
    );

    const backdrop = screen.getByRole('alertdialog').previousElementSibling as HTMLElement;
    await user.click(backdrop);

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('should auto-dismiss after specified duration', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={true}
        onDismiss={onDismiss}
        autoHideDuration={3000}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledOnce();
    });

    vi.useRealTimers();
  });

  it('should not auto-dismiss when autoHideDuration is 0', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <Toast
        title="Test Toast"
        message="Test message"
        open={true}
        onDismiss={onDismiss}
        autoHideDuration={0}
      />
    );

    vi.advanceTimersByTime(15000);

    expect(onDismiss).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should render custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;

    render(
      <Toast
        title="Test Toast"
        message="Test message"
        icon={customIcon}
        open={true}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render without message when not provided', () => {
    render(
      <Toast
        title="Test Toast"
        open={true}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});

