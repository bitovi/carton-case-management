import {  Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, Button } from '@/components/obra';
import type { RelationshipManagerAccordionProps } from './types';

export function RelationshipManagerAccordion({
  accordionTitle,
  items,
  defaultOpen = false,
  onAddClick,
  className,
}: RelationshipManagerAccordionProps) {
  const accordionValue = accordionTitle.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={cn('w-full sm:w-[200px]', className)}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? accordionValue : undefined}
        items={[
          {
            value: accordionValue,
            trigger: accordionTitle,
            triggerProps: {
              className: 'text-sm font-semibold text-gray-950 px-0 py-4',
            },
            content: (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg px-4 py-2"
                    >
                      <div className="flex flex-col text-sm leading-[21px]">
                        <p className="font-semibold text-teal-600">
                          {item.title}
                        </p>
                        <p className="text-gray-950">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {onAddClick && (
                  <Button
                    variant="secondary"
                    size="regular"
                    onClick={onAddClick}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
