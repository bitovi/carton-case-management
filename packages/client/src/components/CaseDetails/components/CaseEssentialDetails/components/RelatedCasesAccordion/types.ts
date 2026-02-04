export interface RelatedCase {
  id: string;
  title: string;
  caseNumber: string;
}

export interface RelatedCasesAccordionProps {
  /**
   * Array of related cases to display
   */
  cases: RelatedCase[];

  /**
   * Whether the accordion is open by default
   * @default false
   * @figma Variant: State
   */
  defaultOpen?: boolean;

  /**
   * Callback when add button is clicked
   */
  onAddClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
