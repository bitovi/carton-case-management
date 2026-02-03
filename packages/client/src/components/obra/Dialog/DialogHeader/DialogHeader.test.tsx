import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialogHeader } from './DialogHeader';

describe('DialogHeader', () => {
  describe('Header variant', () => {
    it('should render title and close button', () => {
      render(<DialogHeader type="Header" title="Test Title" />);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should render default title when not provided', () => {
      render(<DialogHeader type="Header" />);
      
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(<DialogHeader type="Header" title="Test" onClose={onClose} />);
      
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Close Only variant', () => {
    it('should render only close button', () => {
      render(<DialogHeader type="Close Only" />);
      
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should not render title even if provided', () => {
      render(<DialogHeader type="Close Only" title="Should not show" />);
      
      expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
    });
  });

  describe('Icon Button Close variant', () => {
    it('should render icon button close', () => {
      render(<DialogHeader type="Icon Button Close" />);
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should call onClose when icon button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(<DialogHeader type="Icon Button Close" onClose={onClose} />);
      
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(<DialogHeader className="custom-class" type="Header" title="Test" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should default to Header variant', () => {
    render(<DialogHeader title="Default Test" />);
    
    expect(screen.getByText('Default Test')).toBeInTheDocument();
  });
});
