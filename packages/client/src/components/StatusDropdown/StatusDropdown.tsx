import { useState, useRef, useEffect } from 'react';
import { trpc } from '../../lib/trpc';
import type { StatusDropdownProps, CaseStatus } from './types';

const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: 'TO_DO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
];

export function StatusDropdown({ caseId, currentStatus }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const updateCaseMutation = trpc.case.update.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot the previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update the cache
      if (previousCase && variables.status) {
        utils.case.getById.setData(
          { id: caseId },
          {
            ...previousCase,
            status: variables.status,
          }
        );
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous value on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      // Refetch after mutation to ensure data is in sync
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  const currentLabel =
    STATUS_OPTIONS.find((opt) => opt.value === currentStatus)?.label || currentStatus;

  const handleStatusChange = (newStatus: CaseStatus) => {
    updateCaseMutation.mutate({
      id: caseId,
      status: newStatus,
    });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updateCaseMutation.isPending}
        className="px-3 py-1.5 bg-gray-200 rounded-full text-sm font-semibold flex items-center gap-1.5 flex-shrink-0 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentLabel}
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                option.value === currentStatus ? 'bg-gray-50 font-semibold' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
