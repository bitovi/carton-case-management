import type { CaseListItem } from '../../types';

export interface UseCaseSearchResult {
  /** Current search query */
  query: string;
  /** Updates the search query */
  setQuery: (query: string) => void;
  /** Cases matching the current query, or every case when the query is empty */
  filteredCases: CaseListItem[];
}
