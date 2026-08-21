import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: '1',
    title: 'First Case',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Second Case',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('returns an empty array when cases is undefined', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toEqual([]);
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
      result.current.setSearchTerm('CAS-240117');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when no case matches the search term', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores leading/trailing whitespace in the search term', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('  second  ');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });
});
