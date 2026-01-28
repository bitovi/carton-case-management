import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DialogFooter } from './DialogFooter';

describe('DialogFooter', () => {
  it('should render correctly with children', () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Submit</button>
      </DialogFooter>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <DialogFooter className="custom-class">
        <button>Action</button>
      </DialogFooter>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
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
