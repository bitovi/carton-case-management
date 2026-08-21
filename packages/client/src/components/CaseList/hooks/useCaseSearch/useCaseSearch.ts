import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [query, setQuery] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return cases;

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return cases;

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt);
      return (
        caseItem.title.toLowerCase().includes(normalizedQuery) ||
        caseNumber.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [cases, query]);

  return { query, setQuery, filteredCases };
}
