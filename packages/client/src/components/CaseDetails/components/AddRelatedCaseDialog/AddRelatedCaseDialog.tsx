import * as React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogFooter, DialogHeader } from '@/components/obra/Dialog';
import { Button } from '@/components/obra';
import { RelatedCasesList } from './components/RelatedCasesList';
import type { AddRelatedCaseDialogProps } from './types';
import type { RelatedCaseItem } from './components/RelatedCasesList/types';

export function AddRelatedCaseDialog({
  open,
  onOpenChange,
  cases,
  selectedCases,
  onSelectionChange,
  onAdd,
  className,
}: AddRelatedCaseDialogProps) {
  const listCases: RelatedCaseItem[] = cases.map((c) => ({
    ...c,
    selected: selectedCases.includes(c.id),
  }));

  const handleToggle = (caseId: string) => {
    if (selectedCases.includes(caseId)) {
      onSelectionChange(selectedCases.filter((id) => id !== caseId));
    } else {
      onSelectionChange([...selectedCases, caseId]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      type="Desktop Scrollable"
      header={
        <DialogHeader
          type="Close Only"
          onClose={() => {
            onOpenChange(false);
          }}
        />
      }
      footer={
        <DialogFooter>
          <Button
            onClick={onAdd}
            disabled={selectedCases.length === 0}
            className="bg-gray-950 text-white hover:bg-gray-800"
          >
            Add
          </Button>
        </DialogFooter>
      }
      className={cn('w-[400px] h-auto max-h-[90vh]', className)}
    >
      <RelatedCasesList cases={listCases} onCaseToggle={handleToggle} className="w-full" />
    </Dialog>
  );
}
