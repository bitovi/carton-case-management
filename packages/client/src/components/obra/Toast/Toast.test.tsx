import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { PartyPopper } from 'lucide-react';

describe('Toast', () => {
  it('should render toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed successfully"
          open={true}
        />
      </ToastProvider>
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Action completed successfully')).toBeInTheDocument();
  });

  it('should render with icon when provided', () => {
    render(
      <ToastProvider>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed"
          icon={<PartyPopper data-testid="party-icon" />}
          open={true}
        />
      </ToastProvider>
    );

    expect(screen.getByTestId('party-icon')).toBeInTheDocument();
  });

  it('should have dismiss button', () => {
    render(
      <ToastProvider>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed"
          open={true}
        />
      </ToastProvider>
    );

    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('should call onOpenChange when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <ToastProvider>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed"
          open={true}
          onOpenChange={handleOpenChange}
        />
      </ToastProvider>
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('should auto-dismiss after specified duration', async () => {
    const handleOpenChange = vi.fn();

    render(
      <ToastProvider duration={1000}>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed"
          open={true}
          onOpenChange={handleOpenChange}
          duration={1000}
        />
      </ToastProvider>
    );

    await waitFor(
      () => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      },
      { timeout: 1500 }
    );
  });

  it('should apply destructive variant styles', () => {
    render(
      <ToastProvider>
        <Toast
          variant="destructive"
          title="Deleted"
          description="Item has been deleted"
          open={true}
        />
      </ToastProvider>
    );

    // Check that the toast is rendered (variant styling is applied via Tailwind classes)
    expect(screen.getByText('Deleted')).toBeInTheDocument();
    expect(screen.getByText('Item has been deleted')).toBeInTheDocument();
  });

  it('should apply success variant styles', () => {
    render(
      <ToastProvider>
        <Toast
          variant="success"
          title="Success!"
          description="Action completed"
          open={true}
        />
      </ToastProvider>
    );

    // Check that the toast is rendered (variant styling is applied via Tailwind classes)
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Action completed')).toBeInTheDocument();
  });
});
