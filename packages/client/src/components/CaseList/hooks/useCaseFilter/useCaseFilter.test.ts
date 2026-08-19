import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseFilter } from './useCaseFilter';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: 'abc12345',
    title: 'First Case',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'def67890',
    title: 'Second Case',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseFilter', () => {
  it('returns all cases when the search query is empty', () => {
    const { result } = renderHook(() => useCaseFilter(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('passes through an undefined case list unchanged', () => {
    const { result } = renderHook(() => useCaseFilter(undefined));
    expect(result.current.filteredCases).toBeUndefined();
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseFilter(mockCases));

    act(() => result.current.setSearchQuery('first'));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseFilter(mockCases));

    act(() => result.current.setSearchQuery('CAS-240117'));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseFilter(mockCases));

    act(() => result.current.setSearchQuery('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores leading and trailing whitespace in the query', () => {
    const { result } = renderHook(() => useCaseFilter(mockCases));

    act(() => result.current.setSearchQuery('  second  '));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });
});
