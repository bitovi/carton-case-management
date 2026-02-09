import { ReactNode } from 'react';

export interface FilterItem<T = string> {
  /**
   * Unique identifier for the filter
   */
  id: string;
  
  /**
   * Label for the filter (e.g., "Customer", "Status")
   */
  label: string;
  
  /**
   * Current value of the filter
   */
  value: T;
  
  /**
   * Options for the select dropdown
   */
  options: Array<{
    value: T;
    label: string;
  }>;
  
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
