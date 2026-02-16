import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReaction } from './useReaction';
import { trpc } from '@/lib/trpc';

// Mock trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: vi.fn(),
    reaction: {
      getByEntity: {
        useQuery: vi.fn(),
      },
      toggle: {
        useMutation: vi.fn(),
      },
    },
  },
}));

describe('useReaction', () => {
  const mockUtils = {
    reaction: {
      getByEntity: {
        cancel: vi.fn(),
        getData: vi.fn(),
        setData: vi.fn(),
        invalidate: vi.fn(),
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.useUtils as any).mockReturnValue(mockUtils);
  });

  it('should return initial state when no data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.getByEntity.useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.toggle.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    const { result } = renderHook(() =>
      useReaction({ entityType: 'CASE', entityId: 'case-123' })
    );

    expect(result.current.upvotes).toBe(0);
    expect(result.current.downvotes).toBe(0);
    expect(result.current.userVote).toBe('none');
    expect(result.current.isLoading).toBe(true);
  });

  it('should return reaction data when loaded', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.getByEntity.useQuery as any).mockReturnValue({
      data: {
        upvotes: 5,
        downvotes: 2,
        upvoters: ['Alice', 'Bob'],
        downvoters: ['Charlie'],
        userVote: 'up',
      },
      isLoading: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.toggle.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    const { result } = renderHook(() =>
      useReaction({ entityType: 'CASE', entityId: 'case-123' })
    );

    expect(result.current.upvotes).toBe(5);
    expect(result.current.downvotes).toBe(2);
    expect(result.current.upvoters).toEqual(['Alice', 'Bob']);
    expect(result.current.downvoters).toEqual(['Charlie']);
    expect(result.current.userVote).toBe('up');
    expect(result.current.isLoading).toBe(false);
  });

  it('should call toggle mutation when toggleUpvote is called', () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.getByEntity.useQuery as any).mockReturnValue({
      data: { upvotes: 0, downvotes: 0, upvoters: [], downvoters: [], userVote: 'none' },
      isLoading: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.toggle.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    const { result } = renderHook(() =>
      useReaction({ entityType: 'CASE', entityId: 'case-123' })
    );

    result.current.toggleUpvote();

    expect(mockMutate).toHaveBeenCalledWith({
      entityType: 'CASE',
      entityId: 'case-123',
      type: 'UP',
    });
  });

  it('should call toggle mutation when toggleDownvote is called', () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.getByEntity.useQuery as any).mockReturnValue({
      data: { upvotes: 0, downvotes: 0, upvoters: [], downvoters: [], userVote: 'none' },
      isLoading: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.toggle.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    const { result } = renderHook(() =>
      useReaction({ entityType: 'CASE', entityId: 'case-123' })
    );

    result.current.toggleDownvote();

    expect(mockMutate).toHaveBeenCalledWith({
      entityType: 'CASE',
      entityId: 'case-123',
      type: 'DOWN',
    });
  });

  it('should indicate when mutation is pending', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.getByEntity.useQuery as any).mockReturnValue({
      data: { upvotes: 0, downvotes: 0, upvoters: [], downvoters: [], userVote: 'none' },
      isLoading: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trpc.reaction.toggle.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    const { result } = renderHook(() =>
      useReaction({ entityType: 'CASE', entityId: 'case-123' })
    );

    expect(result.current.isMutating).toBe(true);
  });
});
