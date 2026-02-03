import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader';
import { DialogFooter } from './DialogFooter';

describe('Dialog', () => {
  it('renders with default props', () => {
    render(
      <Dialog>
        <div>Test Content</div>
      </Dialog>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders Desktop variant correctly', () => {
    const { container } = render(
      <Dialog type="Desktop">
        <div>Desktop Content</div>
      </Dialog>
    );
    
    const dialogElement = container.firstChild as HTMLElement;
    expect(dialogElement).toHaveClass('w-[640px]');
    expect(dialogElement).toHaveClass('h-[480px]');
    expect(dialogElement).toHaveClass('rounded-[10px]');
  });

  it('renders Desktop Scrollable variant correctly', () => {
    const { container } = render(
      <Dialog type="Desktop Scrollable">
        <div>Scrollable Content</div>
      </Dialog>
    );
    
    const dialogElement = container.firstChild as HTMLElement;
    expect(dialogElement).toHaveClass('w-[640px]');
    expect(dialogElement).toHaveClass('h-[480px]');
    expect(dialogElement).toHaveClass('rounded-xl');
  });

  it('renders Mobile variant correctly', () => {
    const { container } = render(
      <Dialog type="Mobile">
        <div>Mobile Content</div>
      </Dialog>
    );
    
    const dialogElement = container.firstChild as HTMLElement;
    expect(dialogElement).toHaveClass('w-[320px]');
    expect(dialogElement).toHaveClass('h-[240px]');
  });

  it('renders Mobile Full Screen Scrollable variant correctly', () => {
    const { container } = render(
      <Dialog type="Mobile Full Screen Scrollable">
        <div>Full Screen Content</div>
      </Dialog>
    );
    
    const dialogElement = container.firstChild as HTMLElement;
    expect(dialogElement).toHaveClass('w-[320px]');
    expect(dialogElement).toHaveClass('h-[640px]');
  });

  it('shows close button for non-scrollable variants', () => {
    render(
      <Dialog type="Desktop" onClose={vi.fn()}>
        <div>Content</div>
      </Dialog>
    );
    
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Dialog type="Desktop" onClose={onClose}>
        <div>Content</div>
      </Dialog>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders header for scrollable variants', () => {
    render(
      <Dialog 
        type="Desktop Scrollable"
        header={<DialogHeader title="Test Header" onClose={vi.fn()} />}
      >
        <div>Content</div>
      </Dialog>
    );
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders footer for scrollable variants', () => {
    render(
      <Dialog 
        type="Desktop Scrollable"
        footer={<DialogFooter><button>Action</button></DialogFooter>}
      >
        <div>Content</div>
      </Dialog>
    );
    
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('does not render header and footer for non-scrollable variants', () => {
    render(
      <Dialog 
        type="Desktop"
        header={<DialogHeader title="Should not show" onClose={vi.fn()} />}
        footer={<DialogFooter><button>Should not show</button></DialogFooter>}
      >
        <div>Content</div>
      </Dialog>
    );
    
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Dialog className="custom-class">
        <div>Content</div>
      </Dialog>
    );
    
    const dialogElement = container.firstChild as HTMLElement;
    expect(dialogElement).toHaveClass('custom-class');
  });

  it('renders children content', () => {
    render(
      <Dialog>
        <div data-testid="custom-content">
          <h1>Title</h1>
          <p>Description</p>
        </div>
      </Dialog>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
