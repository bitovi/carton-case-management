import { useDeferredValue, useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredCases = useMemo(() => {
    if (!cases) return cases;

    const normalizedTerm = deferredSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) return cases;

    return cases.filter((caseItem) => {
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();
      return (
        caseItem.title.toLowerCase().includes(normalizedTerm) || caseNumber.includes(normalizedTerm)
      );
    });
  }, [cases, deferredSearchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
