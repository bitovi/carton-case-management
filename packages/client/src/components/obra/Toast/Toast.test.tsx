import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastProvider';
import { Toast } from './Toast';
import * as ToastPrimitive from '@radix-ui/react-toast';

// Test component to trigger toasts
function TestComponent() {
  const { showToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Success!',
            description: 'Operation completed',
            emoji: '🎉',
          })
        }
      >
        Show Success Toast
      </button>
      <button
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Error',
            description: 'Operation failed',
          })
        }
      >
        Show Error Toast
      </button>
    </div>
  );
}

describe('Toast', () => {
  it('renders with title', () => {
    render(
      <ToastPrimitive.Provider>
        <Toast
          title="Test Toast"
          open={true}
          onOpenChange={() => {}}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <ToastPrimitive.Provider>
        <Toast
          title="Test Toast"
          description="Test description"
          open={true}
          onOpenChange={() => {}}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with emoji', () => {
    render(
      <ToastPrimitive.Provider>
        <Toast
          title="Test Toast"
          emoji="🎉"
          open={true}
          onOpenChange={() => {}}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <ToastPrimitive.Provider>
        <Toast
          title="Test Toast"
          open={true}
          onOpenChange={handleOpenChange}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );

    const closeButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies success styling', () => {
    render(
      <ToastPrimitive.Provider>
        <Toast
          type="success"
          title="Success"
          open={true}
          onOpenChange={() => {}}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
    const title = screen.getByText('Success');
    expect(title).toHaveClass('text-foreground');
  });

  it('applies error styling', () => {
    render(
      <ToastPrimitive.Provider>
        <Toast
          type="error"
          title="Error"
          open={true}
          onOpenChange={() => {}}
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    );
    const title = screen.getByText('Error');
    expect(title).toHaveClass('text-destructive');
  });
});

describe('ToastProvider', () => {
  it('provides toast context', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Show Success Toast')).toBeInTheDocument();
  });

  it('shows toast when showToast is called', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success Toast'));

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('shows error toast', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Error Toast'));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
    expect(screen.getByText('Operation failed')).toBeInTheDocument();
  });

  it('hides toast when dismissed', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Success Toast'));

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });
  });
});
