import { ListFilter } from 'lucide-react';
import { Badge } from '@/components/obra';
import { cn } from '@/lib/utils';
import type { FiltersTriggerProps } from './types';

export function FiltersTrigger({
  activeCount = 0,
  selected = false,
  onClick,
  className,
}: FiltersTriggerProps) {
  const hasActiveFilters = activeCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-4 py-2 rounded-lg transition-colors w-[200px]',
        selected
          ? 'bg-gray-200 hover:bg-gray-300'
          : 'bg-gray-100 hover:bg-gray-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-normal text-black">Filters</span>
        {hasActiveFilters && (
          <Badge 
            variant="primary" 
            roundness="round"
            className="bg-teal-500 text-white"
          >
            {activeCount}
          </Badge>
        )}
      </div>
      <ListFilter className="size-6 text-black" />
    </button>
  );
}
