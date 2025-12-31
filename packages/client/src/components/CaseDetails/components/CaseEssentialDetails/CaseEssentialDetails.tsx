import { useState } from 'react';
import { Button } from '@/ui/button';
import { EditablePriority } from '@/components/EditablePriority';
import { EditableSelect } from '@/components/EditableSelect';
import { trpc } from '@/lib/trpc';
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
      priority: newPriority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
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
              options={customers || []}
              onSave={handleCustomerChange}
              isLoading={updateCaseMutation.isPending}
              className="text-sm font-medium"
              placeholder="Select customer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">Priority</p>
            <EditablePriority
              value={caseData.priority || 'MEDIUM'}
              onSave={handlePriorityChange}
              isLoading={updateCaseMutation.isPending}
              className="text-sm font-medium"
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
            <p className="text-xs text-gray-600">Assigned To</p>
            <EditableSelect
              value={caseData.assignedTo || ''}
              options={users || []}
              onSave={handleAssigneeChange}
              isLoading={updateCaseMutation.isPending}
              className="text-sm font-medium"
              placeholder="Unassigned"
              allowEmpty
            />
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
        </>
      )}
    </div>
  );
}
