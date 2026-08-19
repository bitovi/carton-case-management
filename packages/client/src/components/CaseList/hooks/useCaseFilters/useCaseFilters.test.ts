import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseFilters } from './useCaseFilters';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: 'abcd1234',
    title: 'Customer Login Issue',
    description: 'Customer cannot log in',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: 'efgh5678',
    title: 'Payment Processing Error',
    description: 'Payment fails at checkout',
    status: 'IN_PROGRESS',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-17T12:00:00.000Z',
    updatedAt: '2024-01-18T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseFilters', () => {
  it('returns all cases when the search query is empty', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));
    expect(result.current.filteredCases).toHaveLength(2);
  });

  it('returns an empty array when cases is undefined', () => {
    const { result } = renderHook(() => useCaseFilters(undefined));
    expect(result.current.filteredCases).toEqual([]);
  });

  it('filters cases by title, case-insensitively', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => result.current.setSearchQuery('login'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].title).toBe('Customer Login Issue');
  });

  it('filters cases by case number, case-insensitively', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => result.current.setSearchQuery('ABCD1234'));

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('abcd1234');
  });

  it('returns an empty array when no cases match the query', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => result.current.setSearchQuery('nonexistent'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('trims whitespace from the search query', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => result.current.setSearchQuery('  login  '));

    expect(result.current.filteredCases).toHaveLength(1);
  });
});
