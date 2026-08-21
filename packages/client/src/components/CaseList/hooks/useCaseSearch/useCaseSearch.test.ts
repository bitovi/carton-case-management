import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const cases = [
  { id: '1', title: 'Customer Login Issue', createdAt: '2024-01-15T12:00:00.000Z' },
  { id: '2', title: 'Payment Processing Error', createdAt: '2024-01-16T12:00:00.000Z' },
  { id: '3', title: 'Feature Request: Dark Mode', createdAt: '2024-01-10T12:00:00.000Z' },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    expect(result.current.filteredCases).toEqual(cases);
  });

  it('filters cases by title (case-insensitive)', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => {
      result.current.setSearchTerm('payment');
    });

    expect(result.current.filteredCases).toEqual([cases[1]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => {
      result.current.setSearchTerm('#CAS-240115');
    });

    expect(result.current.filteredCases).toEqual([cases[0]]);
  });

  it('ignores leading and trailing whitespace', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => {
      result.current.setSearchTerm('  dark mode  ');
    });

    expect(result.current.filteredCases).toEqual([cases[2]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(cases));

    act(() => {
      result.current.setSearchTerm('nonexistent case');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('passes through an undefined case list', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
