import { useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import type { CaseListItem } from '../../types';

export function useCaseSearch(cases: CaseListItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.trim().toLowerCase();

  const filteredCases = !term
    ? cases ?? []
    : (cases ?? []).filter((caseItem) => {
        const caseNumber = formatCaseNumber(caseItem.id, caseItem.createdAt).toLowerCase();
        return caseItem.title.toLowerCase().includes(term) || caseNumber.includes(term);
      });

  return { searchTerm, setSearchTerm, filteredCases };
}
