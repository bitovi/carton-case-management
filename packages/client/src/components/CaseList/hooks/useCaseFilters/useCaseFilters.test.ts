import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { formatCaseNumber } from '@carton/shared/client';
import { useCaseFilters } from './useCaseFilters';
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

const withCaseNumber = (caseItem: CaseListItem) => ({
  ...caseItem,
  caseNumber: formatCaseNumber(caseItem.id, caseItem.createdAt),
});

describe('useCaseFilters', () => {
  it('returns all cases with a caseNumber attached when search term is empty', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases.map(withCaseNumber));
  });

  it('returns undefined when cases have not loaded yet', () => {
    const { result } = renderHook(() => useCaseFilters(undefined));
    expect(result.current.filteredCases).toBeUndefined();
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => {
      result.current.setSearchTerm('first');
    });

    expect(result.current.filteredCases).toEqual([withCaseNumber(mockCases[0])]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => {
      result.current.setSearchTerm('#CAS-240117');
    });

    expect(result.current.filteredCases).toEqual([withCaseNumber(mockCases[1])]);
  });

  it('returns an empty list when nothing matches', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => {
      result.current.setSearchTerm('no match');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores surrounding whitespace in the search term', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => {
      result.current.setSearchTerm('  second  ');
    });

    expect(result.current.filteredCases).toEqual([withCaseNumber(mockCases[1])]);
  });
});
