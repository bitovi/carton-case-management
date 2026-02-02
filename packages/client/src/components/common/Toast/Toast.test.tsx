import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when open is false', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={false}
        onClose={onClose}
        title="Test"
        description="Test description"
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Success!"
        description="Operation completed successfully"
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Success!"
        description="Test"
        icon={<span data-testid="test-icon">🎉</span>}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should call onClose when Dismiss button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Test"
        description="Test"
        autoHideDuration={0}
      />
    );

    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Test"
        description="Test"
        autoHideDuration={0}
      />
    );

    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
    
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss after default 10 seconds', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Test"
        description="Test"
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss after custom duration', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Test"
        description="Test"
        autoHideDuration={5000}
      />
    );

    vi.advanceTimersByTime(5000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not auto-dismiss when autoHideDuration is 0', () => {
    const onClose = vi.fn();
    render(
      <Toast
        open={true}
        onClose={onClose}
        title="Test"
        description="Test"
        autoHideDuration={0}
      />
    );

    vi.advanceTimersByTime(10000);

    expect(onClose).not.toHaveBeenCalled();
  });
});
