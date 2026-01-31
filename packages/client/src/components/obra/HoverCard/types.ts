import type { ReactNode } from 'react';

export interface HoverCardProps {
  /**
   * The element that triggers the hover card
   */
  trigger: ReactNode;

  /**
   * The content to display in the hover card
   */
  children: ReactNode;

  /**
   * The preferred side of the trigger to render against when open
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * The distance in pixels from the trigger
   * @default 5
   */
  sideOffset?: number;

  /**
   * The preferred alignment against the trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * The duration from when the mouse enters the trigger until the hover card opens
   * @default 700
   */
  openDelay?: number;

  /**
   * The duration from when the mouse leaves the trigger until the hover card closes
   * @default 300
   */
  closeDelay?: number;

  /**
   * Additional CSS class for the content
   */
  className?: string;
}
