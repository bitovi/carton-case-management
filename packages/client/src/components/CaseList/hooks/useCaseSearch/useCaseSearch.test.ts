import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: 'abc12345',
    title: 'Customer Login Issue',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'def67890',
    title: 'Payment Processing Error',
    createdAt: '2024-01-16T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('login');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('ABC12345');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('PAYMENT');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('handles undefined cases', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));
    expect(result.current.filteredCases).toBeUndefined();
  });
});
