import type { CaseListItem } from '../../types';

export interface UseCaseSearchResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredCases: CaseListItem[];
}
