export interface RelationshipManagerListItem {
  id: string;
  title: string;
  subtitle: string;
  selected: boolean;
}

export interface RelationshipManagerListProps {
  /**
   * Title displayed at the top
   */
  title: string;

  /**
   * Array of relationship items to display
   */
  items: RelationshipManagerListItem[];

  /**
   * Callback when an item is selected/deselected
   */
  onItemToggle: (itemId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
