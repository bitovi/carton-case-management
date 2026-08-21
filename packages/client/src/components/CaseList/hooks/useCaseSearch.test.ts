import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../types';

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
  it('returns all cases when there is no search term', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('first'));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by formatted case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    // Format: #CAS-YYMMDD-{last8chars}
    act(() => result.current.setSearchTerm('#cas-240117'));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('passes through an undefined cases list', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
