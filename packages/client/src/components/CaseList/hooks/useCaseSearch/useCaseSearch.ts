import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';
import type { UseCaseSearchResult } from './types';

export function useCaseSearch(cases: CaseListItem[] | undefined): UseCaseSearchResult {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = useMemo(() => {
    if (!cases) {
      return [];
    }

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return cases;
    }

    return cases.filter((caseItem) => {
      const title = caseItem.title.toLowerCase();
      const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();

      return title.includes(query) || caseNumber.includes(query);
    });
  }, [cases, searchTerm]);

  return { searchTerm, setSearchTerm, filteredCases };
}
