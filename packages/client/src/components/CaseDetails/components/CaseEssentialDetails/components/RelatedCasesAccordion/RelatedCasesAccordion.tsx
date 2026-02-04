import {  Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, Button } from '@/components/obra';
import type { RelatedCasesAccordionProps } from './types';

export function RelatedCasesAccordion({
  cases,
  defaultOpen = false,
  onAddClick,
  className,
}: RelatedCasesAccordionProps) {
  return (
    <div className={cn('w-[200px]', className)}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? 'related-cases' : undefined}
        items={[
          {
            value: 'related-cases',
            trigger: 'Related Cases',
            triggerProps: {
              className: 'text-sm font-semibold text-gray-950 px-0 py-4',
            },
            content: (
              <div className="flex flex-col gap-3">
                {cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between rounded-lg px-4 py-2"
                  >
                    <div className="flex flex-col text-sm leading-[21px]">
                      <p className="font-semibold text-teal-600">
                        {caseItem.title}
                      </p>
                      <p className="text-gray-950">{caseItem.caseNumber}</p>
                    </div>
                  </div>
                ))}
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
