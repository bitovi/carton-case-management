import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  isActive?: boolean;
}

export interface MenuListProps {
  items: MenuItem[];
  className?: string;
  onItemClick?: (item: MenuItem) => void;
}
