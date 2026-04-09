import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { formatCaseNumber } from '@carton/shared/client';
import { RelationshipManagerAccordion } from '@/components/common/RelationshipManagerAccordion';
import { RelationshipManagerDialog } from '@/components/common/RelationshipManagerDialog';

interface CaseRelatedCasesAccordionProps {
  caseId: string;
}

export function CaseRelatedCasesAccordion({ caseId }: CaseRelatedCasesAccordionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialRelatedIds, setInitialRelatedIds] = useState<string[]>([]);

  const trpcUtils = trpc.useUtils();

  const { data: relatedCases = [] } = trpc.case.getRelatedCases.useQuery({ id: caseId });
  const { data: allCases = [] } = trpc.case.list.useQuery();

  const addRelatedCasesMutation = trpc.case.addRelatedCases.useMutation({
    onSuccess: () => {
      trpcUtils.case.getRelatedCases.invalidate({ id: caseId });
    },
  });

  const handleAddClick = () => {
    const currentIds = relatedCases.map((c) => c.id);
    setInitialRelatedIds(currentIds);
    setSelectedIds(currentIds);
    setIsDialogOpen(true);
  };

  const handleAdd = async (ids: string[]) => {
    await addRelatedCasesMutation.mutateAsync({
      caseId,
      relatedCaseIds: ids,
    });
    setIsDialogOpen(false);
  };

  const accordionItems = relatedCases.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: formatCaseNumber(c.id, c.createdAt),
    to: `/cases/${c.id}`,
  }));

  const dialogItems = allCases
    .filter((c) => c.id !== caseId)
    .map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: formatCaseNumber(c.id, c.createdAt),
    }));

  const hasChanges = useMemo(() => {
    const initialSet = new Set(initialRelatedIds);
    const selectedSet = new Set(selectedIds);
    return (
      selectedIds.some((id) => !initialSet.has(id)) ||
      initialRelatedIds.some((id) => !selectedSet.has(id))
    );
  }, [initialRelatedIds, selectedIds]);

  return (
    <>
      <RelationshipManagerAccordion
        accordionTitle="Related Cases"
        items={accordionItems}
        defaultOpen={true}
        onAddClick={handleAddClick}
        className="w-full"
      />
      <RelationshipManagerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Add Related Cases"
        items={dialogItems}
        selectedItems={selectedIds}
        onSelectionChange={setSelectedIds}
        onAdd={handleAdd}
        isAddDisabled={!hasChanges}
      />
    </>
  );
}
