import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import type { ToastProps } from './types';

describe('Toast', () => {
  const mockOnDismiss = vi.fn();

  const defaultProps: ToastProps = {
    variant: 'neutral',
    title: 'Test Title',
    message: 'Test message content',
    open: true,
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders toast when open is true', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test message content')).toBeInTheDocument();
    });

    it('does not render toast when open is false', () => {
      render(<Toast {...defaultProps} open={false} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders dismiss button', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('renders close button with aria-label', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders success variant with celebration emoji', () => {
      render(<Toast {...defaultProps} variant="success" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toContain('🎉');
    });

    it('renders error variant with folder icon', () => {
      render(<Toast {...defaultProps} variant="error" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      // FolderX icon should be present
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('renders neutral variant without default icon', () => {
      render(<Toast {...defaultProps} variant="neutral" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      // Should not have emoji or default icon
      expect(alert.textContent).not.toContain('🎉');
    });

    it('renders custom icon when provided', () => {
      render(<Toast {...defaultProps} icon={<span data-testid="custom-icon">⚠️</span>} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    // Use real timers for dismissal tests to avoid timeout issues with userEvent
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.useFakeTimers();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<Toast {...defaultProps} autoDismiss={false} />);

      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      await user.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<Toast {...defaultProps} autoDismiss={false} />);

      const closeButton = screen.getByRole('button', { name: 'Dismiss notification' });
      await user.click(closeButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<Toast {...defaultProps} autoDismiss={false} />);

      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/80');
      expect(backdrop).toBeInTheDocument();

      await user.click(backdrop as Element);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<Toast {...defaultProps} autoDismiss={false} />);

      await user.keyboard('{Escape}');

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auto-dismiss', () => {
    it('auto-dismisses after default duration (10 seconds)', () => {
      render(<Toast {...defaultProps} />);

      expect(mockOnDismiss).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10000);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses after custom duration', () => {
      render(<Toast {...defaultProps} duration={5000} />);

      expect(mockOnDismiss).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5000);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-dismiss when autoDismiss is false', () => {
      render(<Toast {...defaultProps} autoDismiss={false} />);

      vi.advanceTimersByTime(15000);

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('clears timeout when component unmounts', () => {
      const { unmount } = render(<Toast {...defaultProps} />);

      unmount();
      vi.advanceTimersByTime(10000);

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('resets timer when open changes to false and back to true', () => {
      const { rerender } = render(<Toast {...defaultProps} />);

      vi.advanceTimersByTime(5000);

      // Close and reopen
      rerender(<Toast {...defaultProps} open={false} />);
      rerender(<Toast {...defaultProps} open={true} />);

      // Should start new timer
      vi.advanceTimersByTime(5000);
      expect(mockOnDismiss).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5000);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Toast {...defaultProps} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('has accessible dismiss button label', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: 'Dismiss notification' });
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss notification');
    });

    it('marks icon as decorative with aria-hidden', () => {
      render(<Toast {...defaultProps} variant="success" />);

      const iconContainer = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies success variant styles', () => {
      render(<Toast {...defaultProps} variant="success" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('border-green-200');
      expect(alert.className).toContain('bg-green-50');
    });

    it('applies error variant styles', () => {
      render(<Toast {...defaultProps} variant="error" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('border-red-200');
      expect(alert.className).toContain('bg-red-50');
    });

    it('applies neutral variant styles', () => {
      render(<Toast {...defaultProps} variant="neutral" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('border-border');
      expect(alert.className).toContain('bg-background');
    });

    it('has fixed positioning and is centered', () => {
      render(<Toast {...defaultProps} />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('fixed');
      expect(alert.className).toContain('left-[50%]');
      expect(alert.className).toContain('top-[50%]');
      expect(alert.className).toContain('translate-x-[-50%]');
      expect(alert.className).toContain('translate-y-[-50%]');
    });

    it('has proper z-index for overlay', () => {
      render(<Toast {...defaultProps} />);

      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/80');
      expect(backdrop?.className).toContain('z-50');

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('z-50');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message gracefully', () => {
      render(<Toast {...defaultProps} message="" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('handles long messages', () => {
      const longMessage = 'This is a very long message that should still be displayed properly within the toast component without breaking the layout or causing any issues.';
      render(<Toast {...defaultProps} message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles duration of 0 as immediate dismiss', () => {
      render(<Toast {...defaultProps} duration={0} />);

      vi.advanceTimersByTime(0);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
