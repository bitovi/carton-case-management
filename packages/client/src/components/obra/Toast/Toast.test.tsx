import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders with message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with title and message', () => {
    render(<Toast title="Success" message="Operation completed" />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Toast message="Test" icon={<span data-testid="test-icon">🎉</span>} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast message="Test" onDismiss={onDismiss} duration={0} />);

    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when open is false', () => {
    render(<Toast message="Test" open={false} />);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('applies success type styling', () => {
    render(<Toast type="success" title="Success" message="Test" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('applies error type styling', () => {
    render(<Toast type="error" title="Error" message="Test" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('applies neutral type styling', () => {
    render(<Toast type="neutral" title="Info" message="Test" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('renders dismiss button', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Toast title="Success" message="Test message" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Success')).toHaveAttribute('id', 'toast-title');
    expect(screen.getByText('Test message')).toHaveAttribute('id', 'toast-message');
  });
});
