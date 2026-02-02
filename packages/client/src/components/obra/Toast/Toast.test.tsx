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

  it('should render title and message', () => {
    render(
      <Toast
        open={true}
        onOpenChange={vi.fn()}
        title="Success!"
        message="A new claim has been created."
      />
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('A new claim has been created.')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(
      <Toast
        open={true}
        onOpenChange={vi.fn()}
        title="Success!"
        message="Operation completed."
        icon={<span data-testid="test-icon">🎉</span>}
      />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should call onOpenChange when Dismiss button is clicked', async () => {
    vi.useRealTimers(); // Use real timers for user interaction
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Toast
        open={true}
        onOpenChange={handleOpenChange}
        title="Test"
        message="Test message"
        autoHideDuration={0} // Disable auto-dismiss for this test
      />
    );

    const dismissButton = screen.getByText(/dismiss/i);
    await user.click(dismissButton);
    
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    vi.useFakeTimers(); // Restore fake timers for other tests
  });

  it('should auto-dismiss after default duration (10 seconds)', () => {
    const handleOpenChange = vi.fn();

    render(
      <Toast
        open={true}
        onOpenChange={handleOpenChange}
        title="Test"
        message="Test message"
      />
    );

    expect(handleOpenChange).not.toHaveBeenCalled();

    // Fast-forward time by 10 seconds
    vi.advanceTimersByTime(10000);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('should auto-dismiss after custom duration', () => {
    const handleOpenChange = vi.fn();

    render(
      <Toast
        open={true}
        onOpenChange={handleOpenChange}
        title="Test"
        message="Test message"
        autoHideDuration={5000}
      />
    );

    // Fast-forward time by 4 seconds - should not dismiss yet
    vi.advanceTimersByTime(4000);
    expect(handleOpenChange).not.toHaveBeenCalled();

    // Fast-forward another 1 second - should dismiss
    vi.advanceTimersByTime(1000);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not auto-dismiss if autoHideDuration is 0', () => {
    const handleOpenChange = vi.fn();

    render(
      <Toast
        open={true}
        onOpenChange={handleOpenChange}
        title="Test"
        message="Test message"
        autoHideDuration={0}
      />
    );

    // Fast-forward time significantly
    vi.advanceTimersByTime(20000);

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('should clear timeout when dismissed manually before auto-dismiss', async () => {
    vi.useRealTimers(); // Use real timers for user interaction
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Toast
        open={true}
        onOpenChange={handleOpenChange}
        title="Test"
        message="Test message"
        autoHideDuration={100} // Short timeout for test
      />
    );

    // Manually dismiss quickly before auto-dismiss
    const dismissButton = screen.getByText(/dismiss/i);
    await user.click(dismissButton);
    
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    // Reset the mock
    handleOpenChange.mockClear();

    // Wait to ensure auto-dismiss doesn't trigger
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should not be called again
    expect(handleOpenChange).not.toHaveBeenCalled();

    vi.useFakeTimers(); // Restore fake timers for other tests
  });
});
