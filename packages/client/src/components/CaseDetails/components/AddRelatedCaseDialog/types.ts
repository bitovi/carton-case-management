export interface AddRelatedCaseDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog is closed
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Array of available cases
   */
  cases: Array<{
    id: string;
    title: string;
    caseNumber: string;
  }>;

  /**
   * Array of selected case IDs
   */
  selectedCases: string[];

  /**
   * Callback when selection changes
   */
  onSelectionChange: (selectedIds: string[]) => void;

  /**
   * Callback when add button is clicked
   */
  onAdd: () => void;

  /** Additional CSS classes */
  className?: string;
}
