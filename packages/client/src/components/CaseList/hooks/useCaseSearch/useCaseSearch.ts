import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';
import type { UseCaseSearchResult } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined): UseCaseSearchResult {
  const [query, setQuery] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return cases;
    }

    return cases.filter((caseItem) => {
      const title = caseItem.title.toLowerCase();
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();

      return title.includes(normalizedQuery) || caseNumber.includes(normalizedQuery);
    });
  }, [cases, query]);

  return { query, setQuery, filteredCases };
}
