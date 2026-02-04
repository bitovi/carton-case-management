export interface RelatedCaseItem {
  id: string;
  title: string;
  caseNumber: string;
  selected: boolean;
}

export interface RelatedCasesListProps {
  /**
   * Title displayed at the top
   * @default 'Add Related Cases'
   */
  title?: string;

  /**
   * Array of cases to display
   */
  cases: RelatedCaseItem[];

  /**
   * Callback when a case is selected/deselected
   */
  onCaseToggle: (caseId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
