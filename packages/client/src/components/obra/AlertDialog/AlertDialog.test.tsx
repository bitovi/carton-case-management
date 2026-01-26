import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from './AlertDialog';

describe('AlertDialog', () => {
  it('should render title and description', () => {
    render(
      <AlertDialog
        open={true}
        title="Delete Item"
        description="This action cannot be undone."
        actionLabel="Delete"
        cancelLabel="Cancel"
      />
    );
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should render mobile variant with correct layout', () => {
    render(
      <AlertDialog
        open={true}
        type="mobile"
        title="Mobile Dialog"
        description="Mobile description"
        actionLabel="Action"
        cancelLabel="Cancel"
      />
    );
    
    expect(screen.getByText('Mobile Dialog')).toBeInTheDocument();
    expect(screen.getByText('Mobile description')).toBeInTheDocument();
  });

  it('should render desktop variant with correct layout', () => {
    render(
      <AlertDialog
        open={true}
        type="desktop"
        title="Desktop Dialog"
        description="Desktop description"
        actionLabel="Action"
        cancelLabel="Cancel"
      />
    );
    
    expect(screen.getByText('Desktop Dialog')).toBeInTheDocument();
    expect(screen.getByText('Desktop description')).toBeInTheDocument();
  });

  it('should call onAction when action button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionLabel="Confirm"
        cancelLabel="Cancel"
        onAction={handleAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /confirm/i }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionLabel="Confirm"
        cancelLabel="Cancel"
        onCancel={handleCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should render custom action button', () => {
    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionButton={<button>Custom Action</button>}
        cancelLabel="Cancel"
      />
    );

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('should render custom cancel button', () => {
    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionLabel="Action"
        cancelButton={<button>Custom Cancel</button>}
      />
    );

    expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
  });

  it('should render trigger when children provided', () => {
    render(
      <AlertDialog
        title="Test"
        description="Test description"
        actionLabel="Action"
        cancelLabel="Cancel"
      >
        <button>Open Dialog</button>
      </AlertDialog>
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('should call onOpenChange when dialog state changes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <AlertDialog
        title="Test"
        description="Test description"
        actionLabel="Action"
        cancelLabel="Cancel"
        onOpenChange={handleOpenChange}
      >
        <button>Open Dialog</button>
      </AlertDialog>
    );

    await user.click(screen.getByText('Open Dialog'));
    expect(handleOpenChange).toHaveBeenCalled();
  });

  it('should use default labels when not provided', () => {
    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
      />
    );

    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should default to mobile type', () => {
    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionLabel="Action"
        cancelLabel="Cancel"
      />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});

