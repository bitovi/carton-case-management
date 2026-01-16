import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditableSelect } from '@/components/inline-edit';
import { trpc } from '@/lib/trpc';
import { type CasePriority, CASE_PRIORITY_OPTIONS } from '@carton/shared/client';
import type { CaseEssentialDetailsProps } from './types';

export function CaseEssentialDetails({ caseData, caseId }: CaseEssentialDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const trpcUtils = trpc.useUtils();

  const { data: customers } = trpc.customer.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();

  const updateCaseMutation = trpc.case.update.useMutation({
    onSuccess: () => {
      trpcUtils.case.getById.invalidate({ id: caseId });
      trpcUtils.case.list.invalidate();
    },
  });

  const handlePriorityChange = async (newPriority: string) => {
    await updateCaseMutation.mutateAsync({
      id: caseId,
      priority: newPriority as CasePriority,
    });
  };

  const handleCustomerChange = async (newCustomerId: string) => {
    await updateCaseMutation.mutateAsync({
      id: caseId,
      customerId: newCustomerId,
    });
  };

  // Special value to represent "unassigned" since Radix Select doesn't allow empty strings
  const UNASSIGNED_VALUE = '__unassigned__';

  const handleAssigneeChange = async (newAssigneeId: string) => {
    await updateCaseMutation.mutateAsync({
      id: caseId,
      assignedTo: newAssigneeId === UNASSIGNED_VALUE ? null : newAssigneeId,
    });
  };

  return (
    <div className="w-full lg:w-[200px] flex flex-col gap-3">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="flex items-center justify-between py-4 w-full h-auto"
      >
        <h3 className="text-sm font-semibold">Essential Details</h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform text-gray-600 ${!isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      {isExpanded && (
        <>
          <EditableSelect
            label="Customer Name"
            value={caseData.customerId}
            options={(customers || []).map((c: { id: string; firstName: string; lastName: string }) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))}
            onSave={handleCustomerChange}
            readonly={updateCaseMutation.isPending}
            placeholder="Select customer"
          />
          <EditableSelect
            label="Priority"
            value={caseData.priority || 'MEDIUM'}
            options={[...CASE_PRIORITY_OPTIONS]}
            onSave={handlePriorityChange}
            readonly={updateCaseMutation.isPending}
          />
          <EditableSelect
            label="Assigned To"
            value={caseData.assignedTo || UNASSIGNED_VALUE}
            options={[
              { value: UNASSIGNED_VALUE, label: 'Unassigned' },
              ...(users || []).map((u: { id: string; name: string }) => ({ value: u.id, label: u.name })),
            ]}
            onSave={handleAssigneeChange}
            readonly={updateCaseMutation.isPending}
            placeholder="Unassigned"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Date Opened</span>
            <p className="text-sm font-medium px-1 py-2">
              {new Date(caseData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Created By</span>
            <p className="text-sm font-medium px-1 py-2">{caseData.creator.name}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Last Updated</span>
            <p className="text-sm font-medium px-1 py-2">
              {new Date(caseData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Updated By</span>
            <p className="text-sm font-medium px-1 py-2">{caseData.updater.name}</p>
          </div>
        </>
      )}
    </div>
  );
}
