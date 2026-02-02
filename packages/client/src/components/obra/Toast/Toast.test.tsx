import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders when open is true', () => {
    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        icon="🎉"
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <Toast
        open={false}
        title="Success!"
        message="Operation completed"
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays the icon when provided', () => {
    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        icon="🎉"
      />
    );

    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('calls onClose when Dismiss button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
      />
    );

    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismissButton);

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when close button (X) is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
      />
    );

    // Find and click the backdrop
    const backdrop = screen.getByRole('alert').previousSibling as HTMLElement;
    await user.click(backdrop);

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('auto-dismisses after default timeout (10 seconds)', async () => {
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
      />
    );

    expect(handleClose).not.toHaveBeenCalled();

    // Fast-forward time by 10 seconds
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledOnce();
    });
  });

  it('auto-dismisses after custom timeout', async () => {
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
        autoClose={3000}
      />
    );

    expect(handleClose).not.toHaveBeenCalled();

    // Fast-forward time by 3 seconds
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledOnce();
    });
  });

  it('does not auto-dismiss when autoClose is 0', async () => {
    const handleClose = vi.fn();

    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
        autoClose={0}
      />
    );

    // Fast-forward time significantly
    vi.advanceTimersByTime(60000);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('clears timeout when component unmounts', () => {
    const handleClose = vi.fn();

    const { unmount } = render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
        onClose={handleClose}
        autoClose={5000}
      />
    );

    unmount();

    // Fast-forward time
    vi.advanceTimersByTime(10000);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders backdrop overlay', () => {
    const { container } = render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
      />
    );

    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
  });

  it('renders toast centered on screen', () => {
    render(
      <Toast
        open={true}
        title="Success!"
        message="Operation completed"
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('left-1/2');
    expect(toast).toHaveClass('top-1/2');
    expect(toast).toHaveClass('-translate-x-1/2');
    expect(toast).toHaveClass('-translate-y-1/2');
  });
});
