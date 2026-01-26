import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

describe('AlertDialog', () => {
  it('should render title and description', () => {
    render(
      <AlertDialog
        open={true}
        title="Delete Item"
        description="This action cannot be undone."
        actionButton={<Button>Delete</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
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
        actionButton={<Button>Action</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
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
        actionButton={<Button>Action</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
      />
    );
    
    expect(screen.getByText('Desktop Dialog')).toBeInTheDocument();
    expect(screen.getByText('Desktop description')).toBeInTheDocument();
  });

  it('should call onClick when action button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionButton={<Button onClick={handleAction}>Confirm</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
      />
    );

    await user.click(screen.getByRole('button', { name: /confirm/i }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(
      <AlertDialog
        open={true}
        title="Test"
        description="Test description"
        actionButton={<Button>Confirm</Button>}
        cancelButton={<Button variant="outline" onClick={handleCancel}>Cancel</Button>}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should render with custom action and cancel buttons', () => {
    render(
      <AlertDialog
        open={true}
        title="Custom Buttons"
        description="Test with custom button styles"
        actionButton={<Button variant="destructive" size="large">Delete Forever</Button>}
        cancelButton={<Button variant="ghost">Nevermind</Button>}
      />
    );

    expect(screen.getByRole('button', { name: /delete forever/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nevermind/i })).toBeInTheDocument();
  });
});

