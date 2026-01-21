import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';

describe('AlertDialog', () => {
  it('renders trigger button', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('closes dialog when cancel is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('closes dialog when action is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when dialog state changes', async () => {
    const onOpenChange = vi.fn();

    render(
      <AlertDialog onOpenChange={onOpenChange}>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe('variants', () => {
    it('applies desktop variant classes by default', async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent data-testid="content">
            <AlertDialogHeader>
              <AlertDialogTitle>Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('w-[480px]');
    });

    it('applies mobile variant classes', async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent variant="mobile" data-testid="content">
            <AlertDialogHeader>
              <AlertDialogTitle>Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('w-[320px]');
    });
  });

  describe('action button variants', () => {
    it('applies default action button styling', async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogAction data-testid="action">Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveClass('bg-primary');
    });

    it('applies destructive action button styling', async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogAction variant="destructive" data-testid="action">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveClass('text-destructive-foreground');
    });
  });

  it('renders with controlled open state', async () => {
    const { rerender } = render(
      <AlertDialog open={false}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    rerender(
      <AlertDialog open={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('merges custom className on content', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent className="custom-class" data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId('content')).toHaveClass('custom-class');
  });
});
