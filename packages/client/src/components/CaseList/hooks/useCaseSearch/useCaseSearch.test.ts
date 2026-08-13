import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: '1',
    title: 'Customer Login Issue',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    createdAt: '2024-01-17T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns every case when the search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toHaveLength(2);
    expect(result.current.searchTerm).toBe('');
  });

  it('returns an empty array when cases are undefined', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('filters by case title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('payment'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Payment Processing Error');
  });

  it('filters by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('240115'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('1');
  });

  it('matches case numbers including the prefix', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('#CAS-240117'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('2');
  });

  it('ignores case when matching', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('CUSTOMER'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Customer Login Issue');
  });

  it('ignores surrounding whitespace', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('   login   '));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Customer Login Issue');
  });

  it('returns no cases when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setSearchTerm('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });
});
