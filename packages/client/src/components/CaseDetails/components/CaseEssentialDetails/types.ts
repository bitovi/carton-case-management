export type CaseEssentialDetailsProps = {
  caseData: {
    customerName: string;
    createdAt: string;
    updatedAt: string;
    assignee: { name: string } | null;
  };
};
