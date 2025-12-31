import { useState } from 'react';
import { Button } from '@/ui/button';
import type { CaseEssentialDetailsProps } from './types';

export function CaseEssentialDetails({ caseData }: CaseEssentialDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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
            <p className="text-sm font-medium">{caseData.customerName}</p>
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
            <p className="text-sm font-medium">{caseData.assignee?.name || 'Unassigned'}</p>
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
