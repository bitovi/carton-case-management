import type { CaseStatus } from '../../../StatusDropdown/types';

export type CaseInformationProps = {
  caseId: string;
  caseData: {
    title: string;
    caseNumber: string;
    status: CaseStatus;
    description: string;
  };
  onMenuClick?: () => void;
};
