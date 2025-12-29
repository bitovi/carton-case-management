import { StatusDropdown } from '../../../StatusDropdown';
import type { CaseStatus } from '../../../StatusDropdown/types';

type CaseInformationProps = {
  caseId: string;
  caseData: {
    title: string;
    caseNumber: string;
    status: CaseStatus;
    description: string;
  };
};

export function CaseInformation({ caseId, caseData }: CaseInformationProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile: Menu button + Title */}
      <div className="flex items-start gap-4 md:hidden w-full">
        <button
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
          aria-label="Menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate">{caseData.title}</h1>
          <p className="text-base font-semibold text-gray-600">#{caseData.caseNumber}</p>
        </div>
      </div>

      {/* Mobile: Status Badge */}
      <div className="md:hidden self-start">
        <StatusDropdown caseId={caseId} currentStatus={caseData.status} />
      </div>

      {/* Desktop: Title + Status on same line */}
      <div className="hidden md:flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h1 className="text-3xl font-semibold">{caseData.title}</h1>
          <p className="text-xl text-gray-600">#{caseData.caseNumber}</p>
        </div>
        <StatusDropdown caseId={caseId} currentStatus={caseData.status} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">Case Description</h2>
        <p className="text-sm text-gray-700">{caseData.description}</p>
      </div>
    </div>
  );
}
