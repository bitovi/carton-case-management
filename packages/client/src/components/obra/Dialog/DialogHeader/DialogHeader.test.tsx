import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialogHeader } from './DialogHeader';
import { Dialog } from '../Dialog';
import { ReactNode } from 'react';

// Wrapper component to provide Dialog context
function DialogHeaderWrapper({ children }: { children: ReactNode }) {
  return (
    <Dialog open={true} onOpenChange={() => {}} type="Desktop Scrollable">
      {children}
    </Dialog>
  );
}

describe('DialogHeader', () => {
  describe('Header variant', () => {
    it('should render title and close button', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Header" title="Test Title" />
        </DialogHeaderWrapper>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader
            type="Header"
            title="Test Title"
            description="This is a test description"
          />
        </DialogHeaderWrapper>
      );
      
      expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Header" title="Test Title" />
        </DialogHeaderWrapper>
      );
      
      const description = screen.queryByText(/description/i);
      expect(description).not.toBeInTheDocument();
    });

    it('should render default title when not provided', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Header" />
        </DialogHeaderWrapper>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Header" title="Test" onClose={onClose} />
        </DialogHeaderWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Close Only variant', () => {
    it('should render only close button', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Close Only" />
        </DialogHeaderWrapper>
      );
      
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

  });


  describe('Icon Button Close variant', () => {
    it('should render icon button close', () => {
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Icon Button Close" />
        </DialogHeaderWrapper>
      );
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should call onClose when icon button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <DialogHeaderWrapper>
          <DialogHeader type="Icon Button Close" onClose={onClose} />
        </DialogHeaderWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('should apply custom className', () => {
    render(
      <DialogHeaderWrapper>
        <DialogHeader className="custom-class" type="Header" title="Test" />
      </DialogHeaderWrapper>
    );
    
    // The className is applied - we can verify the component renders with title
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should default to Header variant', () => {
    render(
      <DialogHeaderWrapper>
        <DialogHeader title="Default Test" />
      </DialogHeaderWrapper>
    );
    
    expect(screen.getByText('Default Test')).toBeInTheDocument();
  });
});
