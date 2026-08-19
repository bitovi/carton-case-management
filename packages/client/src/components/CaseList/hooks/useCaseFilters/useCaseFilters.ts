import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';
import type { FilteredCaseListItem } from './types';

export function useCaseFilters(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const casesWithNumber = useMemo<FilteredCaseListItem[] | undefined>(() => {
    if (!cases) return cases;

    return cases.map((caseItem) => ({
      ...caseItem,
      caseNumber: formatCaseNumber(caseItem.id, caseItem.createdAt),
    }));
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (!casesWithNumber) return casesWithNumber;

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) return casesWithNumber;

    return casesWithNumber.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(normalizedSearchTerm) ||
        caseItem.caseNumber.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [casesWithNumber, searchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
