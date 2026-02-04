import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/obra';
import type { RelationshipManagerListProps } from './types';

export function RelationshipManagerList({
  title,
  items,
  onItemToggle,
  className,
}: RelationshipManagerListProps) {
  return (
    <div
      className={cn(
        'flex w-[342px] flex-col gap-4 px-4 pb-4 pt-0.5',
        className
      )}
    >
      <h2 className="text-xl font-semibold leading-6">{title}</h2>
      {items.map((item) => (
        <div key={item.id} className="flex items-center">
          <Checkbox
            checked={item.selected}
            onCheckedChange={() => onItemToggle(item.id)}
          />
          <div className="flex flex-1 flex-col rounded-lg px-4 py-2 text-sm leading-[21px]">
            <p className="font-semibold text-teal-600">{item.title}</p>
            <p className="text-gray-950">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
