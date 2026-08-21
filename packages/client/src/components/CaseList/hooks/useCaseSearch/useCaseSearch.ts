import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';
import type { UseCaseSearchResult } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined): UseCaseSearchResult {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return cases;
    }

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();
      return caseItem.title.toLowerCase().includes(query) || caseNumber.includes(query);
    });
  }, [cases, searchQuery]);

  return { searchQuery, setSearchQuery, filteredCases };
}
