import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseFilters(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return cases;

    const query = searchTerm.trim().toLowerCase();
    if (!query) return cases;

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt);
      return (
        caseItem.title.toLowerCase().includes(query) || caseNumber.toLowerCase().includes(query)
      );
    });
  }, [cases, searchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
