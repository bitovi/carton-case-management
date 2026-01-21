import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup body overflow after each test
    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('renders nothing when closed', () => {
      render(
        <Sheet open={false} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when open', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with scrollable=true by default (close button + footer)', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByLabelText('Close')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('renders without close button and footer when scrollable=false', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}} scrollable={false}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });
  });

  describe('custom labels', () => {
    it('renders custom cancel label', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}} cancelLabel="Discard">
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByText('Discard')).toBeInTheDocument();
    });

    it('renders custom action label', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}} actionLabel="Save Changes">
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onOpenChange when close button clicked', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Sheet open={true} onOpenChange={handleOpenChange}>
          <div>Content</div>
        </Sheet>
      );

      await user.click(screen.getByLabelText('Close'));
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange when backdrop clicked', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Sheet open={true} onOpenChange={handleOpenChange}>
          <div>Content</div>
        </Sheet>
      );

      // Click on backdrop (the div with bg-black/60)
      const backdrop = document.querySelector('.bg-black\\/60');
      expect(backdrop).toBeInTheDocument();

      await user.click(backdrop!);
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange when Escape key pressed', () => {
      const handleOpenChange = vi.fn();

      render(
        <Sheet open={true} onOpenChange={handleOpenChange}>
          <div>Content</div>
        </Sheet>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onCancel and onOpenChange when cancel button clicked', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      const handleCancel = vi.fn();

      render(
        <Sheet open={true} onOpenChange={handleOpenChange} onCancel={handleCancel}>
          <div>Content</div>
        </Sheet>
      );

      await user.click(screen.getByText('Cancel'));
      expect(handleCancel).toHaveBeenCalled();
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onAction when action button clicked', async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();

      render(
        <Sheet open={true} onOpenChange={() => {}} onAction={handleAction}>
          <div>Content</div>
        </Sheet>
      );

      await user.click(screen.getByText('Submit'));
      expect(handleAction).toHaveBeenCalled();
    });
  });

  describe('body scroll lock', () => {
    it('locks body scroll when open', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', () => {
      const { rerender } = render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Sheet open={false} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has dialog role', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('close button has accessible label', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies custom className to sheet', () => {
      render(
        <Sheet open={true} onOpenChange={() => {}} className="custom-class">
          <div>Content</div>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toHaveClass('custom-class');
    });
  });
});
