import { useState, useMemo } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [query, setQuery] = useState('');

  const casesWithNumber = useMemo(
    () =>
      (cases ?? []).map((c) => ({
        item: c,
        caseNumber: formatCaseNumber(c.id, c.createdAt).toLowerCase(),
      })),
    [cases]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return cases ?? [];
    const lower = query.toLowerCase();
    return casesWithNumber
      .filter((c) => c.item.title.toLowerCase().includes(lower) || c.caseNumber.includes(lower))
      .map((c) => c.item);
  }, [casesWithNumber, query, cases]);

  return { query, setQuery, filtered };
}
