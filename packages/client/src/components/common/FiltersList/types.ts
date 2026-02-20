import { ReactNode } from 'react';

export interface FilterItem<T = string | string[]> {
  /**
   * Unique identifier for the filter
   */
  id: string;
  
  /**
   * Label for the filter (e.g., "Customer", "Status")
   */
  label: string;
  
  /**
   * Current value of the filter (string for single-select, string[] for multi-select)
   */
  value: T;
  
  /**
   * Options for the select dropdown
   */
  options: Array<{
    value: string;
    label: string;
  }>;
  
  /**
   * Whether this filter supports multiple selections
   * @default false
   */
  multiSelect?: boolean;
  
  /**
   * Number of items matching this filter (shown in parentheses)
   */
  count?: number;
  
  /**
   * Change handler for the filter
   */
  onChange: (value: T) => void;
  
  /**
   * Custom render for the trigger (optional)
   */
  renderTrigger?: (currentValue: T, label: string) => ReactNode;
}

export interface FiltersListProps {
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
   * Additional CSS classes
   */
  className?: string;
}
