import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditableSelect } from '@/components/common/EditableSelect';
import { trpc } from '@/lib/trpc';
import { type CasePriority, CASE_PRIORITY_OPTIONS } from '@carton/shared';
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

  const handlePriorityChange = (newPriority: string) => {
    updateCaseMutation.mutate({
      id: caseId,
      priority: newPriority as CasePriority,
    });
  };

  const handleCustomerChange = (newCustomerId: string) => {
    updateCaseMutation.mutate({
      id: caseId,
      customerId: newCustomerId,
    });
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    updateCaseMutation.mutate({
      id: caseId,
      assignedTo: newAssigneeId === '' ? null : newAssigneeId,
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
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Customer Name</p>
            <EditableSelect
              value={caseData.customerId}
              options={(customers || []).map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }))}
              onChange={handleCustomerChange}
              disabled={updateCaseMutation.isPending}
              displayClassName="text-sm font-medium"
              placeholder="Select customer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Priority</p>
            <EditableSelect
              value={caseData.priority || 'MEDIUM'}
              options={[...CASE_PRIORITY_OPTIONS]}
              onChange={handlePriorityChange}
              disabled={updateCaseMutation.isPending}
              displayClassName="text-sm font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Assigned To</p>
            <EditableSelect
              value={caseData.assignedTo || ''}
              options={(users || []).map((u: { id: string; name: string }) => ({ value: u.id, label: u.name }))}
              onChange={handleAssigneeChange}
              disabled={updateCaseMutation.isPending}
              displayClassName="text-sm font-medium"
              placeholder="Unassigned"
              emptyLabel="Unassigned"
              allowEmpty
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Date Opened</p>
            <p className="text-sm font-medium">
              {new Date(caseData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Created By</p>
            <p className="text-sm font-medium">{caseData.creator.name}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Last Updated</p>
            <p className="text-sm font-medium">
              {new Date(caseData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Updated By</p>
            <p className="text-sm font-medium">{caseData.updater.name}</p>
          </div>
        </>
      )}
    </div>
  );
}
