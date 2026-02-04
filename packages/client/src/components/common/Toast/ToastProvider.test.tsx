import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

// Test component that uses the useToast hook
function TestComponent() {
  const { showToast } = useToast();
  
  return (
    <div>
      <button onClick={() => showToast({
        type: 'success',
        title: 'Success!',
        message: 'Test toast message',
      })}>
        Show Toast
      </button>
    </div>
  );
}

describe('ToastProvider', () => {
  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    expect(screen.getByRole('button', { name: /show toast/i })).toBeInTheDocument();
  });

  it('displays toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByRole('button', { name: /show toast/i });
    
    act(() => {
      button.click();
    });
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
  });

  it('auto-dismisses toast after 5 seconds', () => {
    vi.useFakeTimers();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByRole('button', { name: /show toast/i });
    
    act(() => {
      button.click();
    });
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    
    // Fast-forward time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('dismisses toast when dismiss button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const showButton = screen.getByRole('button', { name: /show toast/i });
    act(() => {
      showButton.click();
    });
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    act(() => {
      dismissButton.click();
    });
    
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
    
    consoleSpy.mockRestore();
  });
});
