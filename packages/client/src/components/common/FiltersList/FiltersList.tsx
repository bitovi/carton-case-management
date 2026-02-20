import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/obra';
import { MultiSelect } from '../MultiSelect';
import { cn } from '@/lib/utils';
import type { FiltersListProps } from './types';

export function FiltersList({ filters, title = 'Filters', className }: FiltersListProps) {
  return (
    <div className={cn('flex flex-col gap-4 px-4 pt-0.5 pb-4 w-[342px]', className)}>
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-black text-left leading-6">{title}</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {filters.map((filter) => {
          if (filter.multiSelect) {
            return (
              <MultiSelect
                key={filter.id}
                label={filter.label}
                options={filter.options}
                value={Array.isArray(filter.value) ? filter.value : []}
                onChange={(value) => filter.onChange(value)}
              />
            );
          }
          
          const displayLabel = filter.count !== undefined ? `${filter.label} (${filter.count})` : filter.label;
          
          return (
            <div key={filter.id} className="flex flex-col gap-0 w-full">
              <Select value={String(filter.value)} onValueChange={(value) => filter.onChange(value as string)}>
                <SelectTrigger size="regular" layout="stacked" className="w-full">
                  <div className="flex flex-col items-start w-full">
                    <span className="text-xs font-semibold text-gray-600">{displayLabel}</span>
                    <SelectValue placeholder="None selected" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={String(option.value)} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
