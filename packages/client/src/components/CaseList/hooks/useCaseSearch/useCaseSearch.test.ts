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
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the search query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('second');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('CAS-240115');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('FIRST');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('no match');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('returns an empty array when cases are undefined', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toEqual([]);
  });
});
