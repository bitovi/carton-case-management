import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const cases = [
  {
    id: 'abcd1234',
    title: 'Customer Login Issue',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'efgh5678',
    title: 'Payment Processing Error',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(cases));
    expect(result.current.filteredCases).toEqual(cases);
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setSearchTerm('payment'));

    expect(result.current.filteredCases).toEqual([cases[1]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setSearchTerm('CAS-240115'));

    expect(result.current.filteredCases).toEqual([cases[0]]);
  });

  it('returns an empty list when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setSearchTerm('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('handles an undefined case list', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
