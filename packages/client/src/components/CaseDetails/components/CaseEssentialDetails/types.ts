export type CaseEssentialDetailsProps = {
  caseId: string;
  caseData: {
    customer: { id: string; name: string };
    customerId: string;
    priority?: string;
    createdAt: string;
    updatedAt: string;
    assignee: { id: string; name: string } | null;
    assignedTo: string | null;
  };
};
