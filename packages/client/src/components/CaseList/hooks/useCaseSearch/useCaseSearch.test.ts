import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: '1',
    title: 'First Case',
    description: 'First case description',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Second Case',
    description: 'Second case description',
    status: 'IN_PROGRESS',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-17T12:00:00.000Z',
    updatedAt: '2024-01-18T12:00:00.000Z',
  },
] as unknown as CaseListItem[];

describe('useCaseSearch', () => {
  it('returns all cases when the query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));
    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters by a case-insensitive title match', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setQuery('first'));

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters by a partial case number match', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setQuery('CAS-240117'));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setQuery('no such case'));

    expect(result.current.filteredCases).toEqual([]);
  });

  it('ignores leading/trailing whitespace in the query', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => result.current.setQuery('  second  '));

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('passes through an undefined case list unchanged', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
