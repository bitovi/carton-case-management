import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftToLine, ArrowRightFromLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuListProps } from './types';

export function MenuList({ items, className, onItemClick }: MenuListProps) {
  const activeItem = items.find((item) => item.isActive) || items[0];
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <nav id="main-navigation" className={`bg-[#fbfcfc] ${className || ''}`} aria-label="Main menu">
      {/* Mobile: Horizontal nav bar */}
      <div className="lg:hidden px-4 py-2 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#bcecef] rounded-md">
          {activeItem?.icon && <span className="flex-shrink-0">{activeItem.icon}</span>}
          <span className="text-sm text-[#334041]">{activeItem?.label}</span>
        </div>
      </div>

      {/* Desktop: Vertical nav with collapse/expand */}
      <div
        className={cn(
          'hidden lg:flex lg:fixed lg:left-0 lg:top-[72px] lg:bottom-0 lg:flex-col lg:py-8 lg:px-4 lg:bg-[#fbfcfc]',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'
        )}
      >
        {/* Menu items */}
        <div className="flex flex-col gap-2 flex-1">
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'flex items-center px-3 py-2 rounded-md transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2',
                item.isActive ? 'bg-[#bcecef]' : 'hover:bg-gray-100',
                isCollapsed ? 'justify-center' : 'gap-3'
              )}
              aria-current={item.isActive ? 'page' : undefined}
              aria-label={isCollapsed ? item.label : undefined}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span
                className={cn(
                  'transition-opacity duration-300 text-sm text-[#334041]',
                  isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Collapse/Expand button */}
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand navigation menu' : 'Collapse navigation menu'}
          aria-expanded={!isCollapsed}
          aria-controls="main-navigation"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md transition-colors mt-4',
            'hover:bg-gray-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2'
          )}
        >
          {isCollapsed ? (
            <span className="inline-flex" style={{ transform: 'scale(1.05)' }}>
              <ArrowRightFromLine className="h-4 w-4" />
            </span>
          ) : (
            <>
              <ArrowLeftToLine className="h-4 w-4" />
              <span className="text-sm text-[#334041]">Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
