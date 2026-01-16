export type CaseEssentialDetailsProps = {
  caseId: string;
  caseData: {
    customer: { id: string; firstName: string; lastName: string };
    customerId: string;
    priority?: string;
    createdAt: string;
    updatedAt: string;
    assignee: { id: string; name: string } | null;
    assignedTo: string | null;
    creator: { id: string; name: string; email: string };
    createdBy: string;
    updater: { id: string; name: string; email: string };
    updatedBy: string;
  };
};
