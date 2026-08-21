import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return cases;

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return cases;

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt);
      return (
        caseItem.title.toLowerCase().includes(normalizedSearch) ||
        caseNumber.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [cases, searchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
