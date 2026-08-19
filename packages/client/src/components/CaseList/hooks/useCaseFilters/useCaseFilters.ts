import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';

export function useCaseFilters(cases: CaseListItem[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('');

  const casesWithNumbers = useMemo(
    () =>
      (cases ?? []).map((caseItem) => ({
        ...caseItem,
        caseNumber: formatCaseNumber(caseItem.id, caseItem.createdAt),
      })),
    [cases]
  );

  const filteredCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return casesWithNumbers;

    return casesWithNumbers.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(query) ||
        caseItem.caseNumber.toLowerCase().includes(query)
    );
  }, [casesWithNumbers, searchQuery]);

  return { searchQuery, setSearchQuery, filteredCases };
}
