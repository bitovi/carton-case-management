import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../types';

const mockCases: CaseListItem[] = [
  {
    id: 'abc12345',
    title: 'Customer Login Issue',
    description: 'Customer cannot log in',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: 'def67890',
    title: 'Payment Processing Error',
    description: 'Payment fails at checkout',
    status: 'IN_PROGRESS',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-17T12:00:00.000Z',
    updatedAt: '2024-01-18T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the search term is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('login');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchTerm('#CAS-240117-DEF67890');
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

  it('returns undefined cases as-is', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));
    expect(result.current.filteredCases).toBeUndefined();
  });
});
