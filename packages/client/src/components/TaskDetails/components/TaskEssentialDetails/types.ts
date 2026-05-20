export type TaskEssentialDetailsProps = {
  taskId: string;
  taskData: {
    case: { id: string; title: string };
    caseId: string;
    createdAt: string;
    updatedAt: string;
    assignee: { id: string; firstName: string; lastName: string; email: string } | null;
    assignedTo: string | null;
    creator: { id: string; firstName: string; lastName: string; email: string };
    createdBy: string;
  };
};
