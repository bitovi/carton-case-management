import { useState, useMemo } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!cases) return [];
    if (!query.trim()) return cases;
    const lower = query.toLowerCase();
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        formatCaseNumber(c.id, c.createdAt).toLowerCase().includes(lower)
    );
  }, [cases, query]);

  return { query, setQuery, filtered };
}
