import type { FilterItem } from '../FiltersList/types';

export interface FiltersDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog state should change
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Array of filter configurations
   */
  filters: FilterItem[];
  
  /**
   * Title for the filters section
   * @default "Filters"
   */
  title?: string;
  
  /**
   * Callback when Apply button is clicked
   */
  onApply: () => void;
  
  /**
   * Callback when Clear button is clicked
   */
  onClear: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
