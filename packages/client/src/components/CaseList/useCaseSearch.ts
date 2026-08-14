import { useState, useMemo } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    if (!searchQuery.trim()) return cases;

    const query = searchQuery.trim().toLowerCase();
    return cases.filter((caseItem) => {
      const titleMatch = caseItem.title.toLowerCase().includes(query);
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();
      const caseNumberMatch = caseNumber.includes(query);
      return titleMatch || caseNumberMatch;
    });
  }, [cases, searchQuery]);

  return { searchQuery, setSearchQuery, filteredCases };
}
