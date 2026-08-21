import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: '1a2b3c4d',
    title: 'First Case',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: '5e6f7a8b',
    title: 'Second Case',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('first'));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('240115'));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('matches case-insensitively', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('SECOND'));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores leading and trailing whitespace', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('  first  '));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('passes through an undefined case list', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
