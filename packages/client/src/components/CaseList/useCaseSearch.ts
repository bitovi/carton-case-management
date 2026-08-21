import { useState, useMemo } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [query, setQuery] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return cases;
    return cases.filter((c) => {
      const caseNumber = formatCaseNumber(c.id, c.createdAt).toLowerCase();
      return c.title.toLowerCase().includes(trimmed) || caseNumber.includes(trimmed);
    });
  }, [cases, query]);

  return { query, setQuery, filteredCases };
}
