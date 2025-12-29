export type CaseStatus = 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface StatusDropdownProps {
  caseId: string;
  currentStatus: CaseStatus;
}
