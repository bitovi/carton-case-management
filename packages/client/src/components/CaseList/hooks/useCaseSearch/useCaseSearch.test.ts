import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  { id: 'abc12345', title: 'First Case', createdAt: '2024-01-15T12:00:00.000Z' },
  { id: 'def67890', title: 'Second Case', createdAt: '2024-01-17T12:00:00.000Z' },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when search query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));
    expect(result.current.filteredCases).toHaveLength(2);
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('first');
    });

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('First Case');
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('ABC12345');
    });

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('abc12345');
  });

  it('returns an empty array when no cases match', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('nonexistent');
    });

    expect(result.current.filteredCases).toHaveLength(0);
  });

  it('returns an empty array when cases is undefined', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));
    expect(result.current.filteredCases).toEqual([]);
  });
});
