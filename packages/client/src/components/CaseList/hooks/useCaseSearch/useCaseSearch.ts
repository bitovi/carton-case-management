import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) return cases;

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) return cases;

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();
      return (
        caseItem.title.toLowerCase().includes(normalizedSearchTerm) ||
        caseNumber.includes(normalizedSearchTerm)
      );
    });
  }, [cases, searchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
