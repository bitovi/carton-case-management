import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast } from './Toast';
import { PartyPopper } from 'lucide-react';

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
        title="Test Title"
        message="Test message"
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <Toast
        open={false}
        title="Test Title"
        message="Test message"
        onDismiss={vi.fn()}
      />
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders with icon when provided', () => {
    render(
      <Toast
        open={true}
        title="Test Title"
        icon={<PartyPopper data-testid="party-icon" />}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByTestId('party-icon')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when backdrop is clicked', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={onDismiss}
      />
    );

    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
    
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    }
  });

  it('auto-dismisses after default duration (10 seconds)', () => {
    const onDismiss = vi.fn();
    render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={onDismiss}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10000);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after custom duration', () => {
    const onDismiss = vi.fn();
    render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={onDismiss}
        duration={3000}
      />
    );

    vi.advanceTimersByTime(3000);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss when duration is 0', () => {
    const onDismiss = vi.fn();
    render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={onDismiss}
        duration={0}
      />
    );

    vi.advanceTimersByTime(20000);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('renders with Success type styling', () => {
    render(
      <Toast
        open={true}
        type="Success"
        title="Success Title"
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Success Title')).toBeInTheDocument();
  });

  it('renders with Error type styling', () => {
    render(
      <Toast
        open={true}
        type="Error"
        title="Error Title"
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Error Title')).toBeInTheDocument();
  });

  it('renders with Neutral type styling', () => {
    render(
      <Toast
        open={true}
        type="Neutral"
        title="Neutral Title"
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByText('Neutral Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Toast
        open={true}
        title="Test Title"
        onDismiss={vi.fn()}
        className="custom-class"
      />
    );

    const toastModal = container.querySelector('.custom-class');
    expect(toastModal).toBeInTheDocument();
  });
});
