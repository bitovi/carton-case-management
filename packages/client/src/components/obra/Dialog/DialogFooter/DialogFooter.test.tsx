import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DialogFooter } from './DialogFooter';

describe('DialogFooter', () => {
  describe('2 Buttons Right variant', () => {
    it('should render children with right alignment', () => {
      render(
        <DialogFooter type="2 Buttons Right">
          <button>Cancel</button>
          <button>Submit</button>
        </DialogFooter>
      );
      
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('2 Full-width Buttons variant', () => {
    it('should render children in full-width layout', () => {
      render(
        <DialogFooter type="2 Full-width Buttons">
          <button>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
      );
      
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('Single Full-width Button variant', () => {
    it('should render single button in full-width layout', () => {
      render(
        <DialogFooter type="Single Full-width Button">
          <button>Acknowledge</button>
        </DialogFooter>
      );
      
      expect(screen.getByText('Acknowledge')).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <DialogFooter className="custom-class">
        <button>Action</button>
      </DialogFooter>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should default to 2 Buttons Right variant', () => {
    render(
      <DialogFooter>
        <button>Default</button>
      </DialogFooter>
    );
    
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should render multiple action buttons', () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Save Draft</button>
        <button>Submit</button>
      </DialogFooter>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Draft')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
