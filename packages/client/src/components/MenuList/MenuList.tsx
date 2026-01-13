import { Link } from 'react-router-dom';
import type { MenuListProps } from './types';

export function MenuList({ items, className, onItemClick }: MenuListProps) {
  return (
    <nav className={`bg-[#fbfcfc] ${className || ''}`} aria-label="Main menu">
      {/* Mobile: Horizontal nav bar showing all items */}
      <div className="lg:hidden px-4 py-2 flex items-center gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => onItemClick?.(item)}
            className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
              item.isActive ? 'bg-[#bcecef]' : 'hover:bg-gray-100'
            }`}
            aria-current={item.isActive ? 'page' : undefined}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span className="text-sm text-[#334041]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop: Vertical icon-only nav - positioned absolutely */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-[72px] lg:bottom-0 lg:w-[68px] lg:flex-col lg:gap-2 lg:py-8 lg:px-4 lg:bg-[#fbfcfc]">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => onItemClick?.(item)}
            className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2 ${
              item.isActive ? 'bg-[#bcecef]' : 'hover:bg-gray-100'
            }`}
            aria-current={item.isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
