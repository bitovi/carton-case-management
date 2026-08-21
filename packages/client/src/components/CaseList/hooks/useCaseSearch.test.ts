import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../types';

const mockCases = [
  {
    id: 'aaaaaaaa-1111',
    title: 'First Case',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-2222',
    title: 'Second Case',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title (case-insensitive)', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('first');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('#CAS-240117');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('no match');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('handles an undefined case list', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
