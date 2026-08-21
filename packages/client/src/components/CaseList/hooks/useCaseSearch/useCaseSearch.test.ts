import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: 'abc123de',
    title: 'Customer Login Issue',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'ffff9999',
    title: 'Payment Processing Error',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the search query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('returns undefined cases unchanged', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });

  it('filters cases by title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('login');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('240117');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('is case insensitive', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('PAYMENT');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('does not exist');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores leading and trailing whitespace', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('  login  ');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });
});
