import { formatCaseNumber } from '@carton/shared';
import { RelationshipManagerAccordion } from '../RelationshipManagerAccordion/RelationshipManagerAccordion';

interface RelatedCasesAccordionProps {
  cases: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

export function RelatedCasesAccordion({ cases }: RelatedCasesAccordionProps) {
  const items = (cases || []).map((caseItem) => ({
    id: caseItem.id,
    title: caseItem.title,
    subtitle: formatCaseNumber(caseItem.id, caseItem.createdAt),
    to: `/cases/${caseItem.id}`,
  }));

  return (
    <div className="lg:w-[300px] flex-shrink-0">
      <RelationshipManagerAccordion
        accordionTitle="Related Cases"
        items={items}
        defaultOpen={true}
      />
    </div>
  );
}
