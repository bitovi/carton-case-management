import type { CaseStatus } from '@carton/shared/client';

export type CaseInformationProps = {
  caseId: string;
  caseData: {
    id: string;
    title: string;
    status: CaseStatus;
    description: string;
    createdAt: Date | string;
  };
};
