import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const cases = [
  {
    id: 'aaaaaaa1',
    title: 'Customer Login Issue',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'bbbbbbb2',
    title: 'Payment Processing Error',
    createdAt: '2024-02-20T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns every case when the query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    expect(result.current.query).toBe('');
    expect(result.current.filteredCases).toEqual(cases);
  });

  it('returns an empty list when there are no cases', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('filters by title regardless of casing', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('LOGIN'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Customer Login Issue');
  });

  it('filters by a partial title match', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('processing'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Payment Processing Error');
  });

  it('filters by the formatted case number', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('CAS-240115'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('aaaaaaa1');
  });

  it('filters by a case number fragment regardless of casing', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('bbbbbbb2'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('bbbbbbb2');
  });

  it('ignores surrounding whitespace', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('   payment   '));

    expect(result.current.filteredCases).toHaveLength(1);
  });

  it('returns no cases when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => result.current.setQuery('shipping'));

    expect(result.current.filteredCases).toEqual([]);
  });
});
