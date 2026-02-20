export interface RelationshipManagerDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog is closed
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Title for the dialog content
   */
  title: string;

  /**
   * Array of available items
   */
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
  }>;

  /**
   * Array of selected item IDs
   */
  selectedItems: string[];

  /**
   * Callback when selection changes
   */
  onSelectionChange: (selectedIds: string[]) => void;

  /**
   * Callback when add button is clicked
   */
  onAdd: (selectedIds: string[]) => void;

  /** Additional CSS classes */
  className?: string;
}
