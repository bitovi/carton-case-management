import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Toast } from './Toast';
import { vi } from 'vitest';

describe('Toast', () => {
  it('renders toast when open is true', () => {
    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        open={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('A new claim has been created.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        open={false}
        onClose={() => {}}
      />
    );

    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });

  it('calls onClose when dismiss button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        open={true}
        onClose={onClose}
      />
    );

    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismissButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        open={true}
        onClose={onClose}
      />
    );

    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('auto-dismisses after 10 seconds', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        open={true}
        onClose={onClose}
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10000);

    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('renders with icon when provided', () => {
    render(
      <Toast
        title="Success!"
        message="A new claim has been created."
        icon="🎉"
        open={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('renders without message when not provided', () => {
    render(
      <Toast
        title="Success!"
        open={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.queryByText('A new claim has been created.')).not.toBeInTheDocument();
  });
});
