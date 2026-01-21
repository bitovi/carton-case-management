import * as React from 'react';

/**
 * Card component props
 * @figma Node: 55:4701 (Slot No.=1 Slot)
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Card content (should be CardHeader, CardContent, CardFooter, etc.) */
  children: React.ReactNode;
}

/**
 * CardHeader component props - Container for title and description
 * @figma Node: 179:29221 (Header slot)
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Header content (typically CardTitle and CardDescription) */
  children: React.ReactNode;
}

/**
 * CardTitle component props - Card title text styling
 * @figma Typography: paragraph/bold - Semibold, 16px
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Additional CSS classes */
  className?: string;
  /** Title text */
  children: React.ReactNode;
}

/**
 * CardDescription component props - Subtitle/description styling
 * @figma Typography: paragraph small/regular - Regular, 14px, muted-foreground
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Additional CSS classes */
  className?: string;
  /** Description text */
  children: React.ReactNode;
}

/**
 * CardContent component props - Main content area
 * @figma Node: 55:4698 (Main slot)
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Content to display */
  children: React.ReactNode;
}

/**
 * CardFooter component props - Footer area for actions/metadata
 * @figma Node: 179:29227 (Footer slot)
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Footer content */
  children: React.ReactNode;
}
