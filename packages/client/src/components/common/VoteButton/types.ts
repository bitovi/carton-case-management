export interface VoteButtonProps {
  /**
   * Vote direction (thumbs up or thumbs down)
   * @figma Variant: Type
   */
  type: 'up' | 'down';
  
  /**
   * Whether the user has voted (active state)
   * @default false
   * @figma Variant: State (Active vs Default)
   */
  active?: boolean;
  
  /**
   * Whether to display the vote count number
   * @default true
   * @figma Boolean: Count
   */
  showCount?: boolean;
  
  /**
   * The vote count value
   * @figma Text: "1" (placeholder)
   */
  count?: number;
  
  /**
   * Array of voter names to show in tooltip (shows first 3, then "+X more")
   * If provided with count, tooltip will appear on hover
   */
  voters?: string[];
  
  /**
   * Click handler for voting interaction
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

