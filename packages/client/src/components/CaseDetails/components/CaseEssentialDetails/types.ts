export type CaseEssentialDetailsProps = {
  caseId: string;
  caseData: {
    customer: { id: string; firstName: string; lastName: string };
    customerId: string;
    priority?: string;
    createdAt: string;
    updatedAt: string;
    assignee: { id: string; firstName: string; lastName: string; email: string } | null;
    assignedTo: string | null;
    creator: { id: string; firstName: string; lastName: string; email: string };
    createdBy: string;
  };
};
