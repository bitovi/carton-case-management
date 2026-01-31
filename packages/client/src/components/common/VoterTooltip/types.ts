import { ReactNode } from "react";

export interface VoterTooltipProps {
  /**
   * Visual theme variant
   * @default 'up'
   * @figma Variant: Type
   */
  type?: 'up' | 'down';
  
  /**
   * The element that triggers the tooltip when hovered
   */
  trigger: ReactNode;
  
  /**
   * Content to display in the tooltip card
   * @figma Slot: .Slot Inner
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes for root element
   */
  className?: string;
}
