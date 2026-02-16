import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastContextProvider, useToast } from './useToast';
import { PartyPopper } from 'lucide-react';
import { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}

describe('useToast', () => {
  it('should throw error when used outside ToastContextProvider', () => {
    // Suppress console error for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastContextProvider');

    console.error = consoleError;
  });

  it('should add toast to the list', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({
        variant: 'success',
        title: 'Success!',
        description: 'Action completed',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Success!');
    expect(result.current.toasts[0].description).toBe('Action completed');
  });

  it('should add toast with icon', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({
        variant: 'success',
        title: 'Success!',
        description: 'Action completed',
        icon: <PartyPopper />,
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].icon).toBeTruthy();
  });

  it('should remove toast from the list', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let toastId: string;
    act(() => {
      toastId = result.current.toast({
        variant: 'success',
        title: 'Success!',
        description: 'Action completed',
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId!);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({
        variant: 'success',
        title: 'Toast 1',
        description: 'First toast',
      });
      result.current.toast({
        variant: 'destructive',
        title: 'Toast 2',
        description: 'Second toast',
      });
      result.current.toast({
        variant: 'success',
        title: 'Toast 3',
        description: 'Third toast',
      });
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].title).toBe('Toast 1');
    expect(result.current.toasts[1].title).toBe('Toast 2');
    expect(result.current.toasts[2].title).toBe('Toast 3');
  });

  it('should assign unique IDs to each toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let id1: string, id2: string;
    act(() => {
      id1 = result.current.toast({
        variant: 'success',
        title: 'Toast 1',
        description: 'First toast',
      });
      id2 = result.current.toast({
        variant: 'success',
        title: 'Toast 2',
        description: 'Second toast',
      });
    });

    expect(id1!).not.toBe(id2!);
    expect(result.current.toasts[0].id).toBe(id1!);
    expect(result.current.toasts[1].id).toBe(id2!);
  });

  it('should support custom duration', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({
        variant: 'success',
        title: 'Success!',
        description: 'Action completed',
        duration: 2000,
      });
    });

    expect(result.current.toasts[0].duration).toBe(2000);
  });
});
