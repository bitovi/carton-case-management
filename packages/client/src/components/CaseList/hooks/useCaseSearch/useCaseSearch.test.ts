import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaseSearch } from './useCaseSearch';
import type { CaseListItem } from '../../types';

const mockCases = [
  {
    id: 'abc123ef',
    title: 'First Case',
    description: 'First case description',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: 'xyz789gh',
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
  it('returns all cases when search query is empty', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    expect(result.current.filteredCases).toEqual(mockCases);
  });

  it('filters cases by title', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('first');
    });

    expect(result.current.filteredCases).toEqual([mockCases[0]]);
  });

  it('filters cases by case number', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('#CAS-240117-XYZ789GH');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('SECOND');
    });

    expect(result.current.filteredCases).toEqual([mockCases[1]]);
  });

  it('returns an empty list when nothing matches', () => {
    const { result } = renderHook(() => useCaseSearch(mockCases));

    act(() => {
      result.current.setSearchQuery('no match');
    });

    expect(result.current.filteredCases).toEqual([]);
  });

  it('handles undefined cases', () => {
    const { result } = renderHook(() => useCaseSearch(undefined));

    expect(result.current.filteredCases).toBeUndefined();
  });
});
