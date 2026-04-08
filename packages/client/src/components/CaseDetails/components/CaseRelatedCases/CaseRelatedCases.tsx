import { useMemo, useState } from 'react';
import { formatCaseNumber } from '@carton/shared/client';
import { trpc } from '@/lib/trpc';
import { RelationshipManagerAccordion } from '@/components/common/RelationshipManagerAccordion';
import { RelationshipManagerDialog } from '@/components/common/RelationshipManagerDialog';
import type { CaseRelatedCasesProps } from './types';

export function CaseRelatedCases({ caseId }: CaseRelatedCasesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialIds, setInitialIds] = useState<string[]>([]);

  const trpcUtils = trpc.useUtils();

  const { data: relatedCases = [] } = trpc.case.relatedCases.list.useQuery({ caseId });
  const { data: allCases = [] } = trpc.case.list.useQuery();

  const updateRelatedCases = trpc.case.relatedCases.update.useMutation({
    onSuccess: () => {
      trpcUtils.case.relatedCases.list.invalidate({ caseId });
    },
  });

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

  const handleAddClick = () => {
    const ids = relatedCases.map((c) => c.id);
    setInitialIds(ids);
    setSelectedIds(ids);
    setDialogOpen(true);
  };

  const handleAdd = (selectedCaseIds: string[]) => {
    updateRelatedCases.mutate({ caseId, relatedCaseIds: selectedCaseIds });
    setDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const initialSet = useMemo(() => new Set(initialIds), [initialIds]);
  const hasChanges =
    selectedSet.size !== initialSet.size || [...selectedSet].some((id) => !initialSet.has(id));

  return (
    <>
      <RelationshipManagerAccordion
        accordionTitle="Related Cases"
        items={accordionItems}
        defaultOpen={true}
        onAddClick={handleAddClick}
      />
      <RelationshipManagerDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
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
