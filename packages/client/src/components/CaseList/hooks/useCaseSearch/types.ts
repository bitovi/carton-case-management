import type { CaseListItem } from '../../types';

export interface UseCaseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCases: CaseListItem[];
}
