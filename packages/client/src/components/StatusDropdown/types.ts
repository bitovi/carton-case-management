import type { CaseStatus } from '@carton/server/src/index';

export type { CaseStatus };

export interface StatusDropdownProps {
  caseId: string;
  currentStatus: CaseStatus;
}
