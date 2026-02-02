import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './index';
import { Button } from '@/components/obra/Button';

function TestComponent() {
  const { showToast, hideToast } = useToast();

  return (
    <div>
      <Button
        onClick={() =>
          showToast({
            variant: 'success',
            title: 'Success',
            message: 'Operation completed',
          })
        }
      >
        Show Success
      </Button>

      <Button
        onClick={() =>
          showToast({
            variant: 'error',
            title: 'Error',
            message: 'Something went wrong',
          })
        }
      >
        Show Error
      </Button>

      <Button
        onClick={() =>
          showToast({
            variant: 'neutral',
            title: 'Info',
            message: 'Informational message',
            duration: 5000,
          })
        }
      >
        Show Custom Duration
      </Button>

      <Button onClick={hideToast}>Hide Toast</Button>
    </div>
  );
}

// Helper to render ToastContext and return methods
function renderToastContext() {
  let contextValue: ReturnType<typeof useToast> | null = null;

  function TestWrapper() {
    contextValue = useToast();
    return null;
  }

  render(
    <ToastProvider>
      <TestWrapper />
    </ToastProvider>
  );

  return contextValue!;
}

describe('ToastContext', () => {
  describe('ToastProvider', () => {
    it('provides toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
    });

    it('throws error when useToast is used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToastContext must be used within a ToastProvider');

      consoleError.mockRestore();
    });
  });

  describe('showToast', () => {
    // Use real timers for user interaction tests
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.useFakeTimers();
    });

    it('displays success toast when showToast is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const showButton = screen.getByText('Show Success');
      await user.click(showButton);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('displays error toast when showToast is called with error variant', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const showButton = screen.getByText('Show Error');
      await user.click(showButton);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('replaces previous toast when new toast is shown', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show success toast
      const showSuccessButton = screen.getByText('Show Success');
      await user.click(showSuccessButton);

      expect(screen.getByText('Success')).toBeInTheDocument();

      // Show error toast (should replace success toast)
      const showErrorButton = screen.getByText('Show Error');
      await user.click(showErrorButton);

      expect(screen.queryByText('Success')).not.toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('showToast with custom duration', () => {
    it('displays toast with custom duration', () => {
      vi.useFakeTimers();

      const { showToast } = renderToastContext();

      act(() => {
        showToast({
          variant: 'neutral',
          title: 'Info',
          message: 'Informational message',
          duration: 5000,
        });
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Info')).toBeInTheDocument();

      // Should still be visible before 5 seconds
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Should be dismissed after 5 seconds
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('hideToast', () => {
    // Use real timers for user interaction tests
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.useFakeTimers();
    });

    it('hides toast when hideToast is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show toast
      const showButton = screen.getByText('Show Success');
      await user.click(showButton);

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Hide toast
      const hideButton = screen.getByText('Hide Toast');
      await user.click(hideButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('dismisses toast when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show toast
      const showButton = screen.getByText('Show Success');
      await user.click(showButton);

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Click dismiss button in toast
      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      await user.click(dismissButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Auto-dismiss', () => {
    it('auto-dismisses toast after default duration', () => {
      vi.useFakeTimers();

      const { showToast } = renderToastContext();

      act(() => {
        showToast({
          variant: 'success',
          title: 'Success',
          message: 'Operation completed',
        });
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Should still be visible before 10 seconds
      act(() => {
        vi.advanceTimersByTime(9000);
      });
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Should be dismissed after 10 seconds
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Multiple toasts', () => {
    // Use real timers for user interaction tests
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.useFakeTimers();
    });

    it('shows only one toast at a time', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show first toast
      const showSuccessButton = screen.getByText('Show Success');
      await user.click(showSuccessButton);

      // Show second toast
      const showErrorButton = screen.getByText('Show Error');
      await user.click(showErrorButton);

      // Should only have one alert
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(1);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('provides stable references for showToast and hideToast', () => {
      let renderCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let showToastRef: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let hideToastRef: any;

      function TestStability() {
        const { showToast, hideToast } = useToast();
        renderCount++;

        if (renderCount === 1) {
          showToastRef = showToast;
          hideToastRef = hideToast;
        } else {
          // References should be stable across renders
          expect(showToast).toBe(showToastRef);
          expect(hideToast).toBe(hideToastRef);
        }

        return <div>Render count: {renderCount}</div>;
      }

      const { rerender } = render(
        <ToastProvider>
          <TestStability />
        </ToastProvider>
      );

      rerender(
        <ToastProvider>
          <TestStability />
        </ToastProvider>
      );

      expect(renderCount).toBeGreaterThan(1);
    });
  });
});
