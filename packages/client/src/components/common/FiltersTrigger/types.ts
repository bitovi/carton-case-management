export interface FiltersTriggerProps {
  /**
   * Number of active filters applied
   * Shows a badge when greater than 0
   */
  activeCount?: number;
  
  /**
   * Whether the trigger is in selected/active state
   * @default false
   */
  selected?: boolean;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
