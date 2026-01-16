export type TaskEssentialDetailsProps = {
  taskId: string;
  taskData: {
    priority: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    assignee: { id: string; name: string } | null;
    assignedTo: string | null;
    creator: { id: string; name: string; email: string };
    createdBy: string;
    updater: { id: string; name: string; email: string };
    updatedBy: string;
    case: {
      id: string;
      title: string;
      customer: { id: string; firstName: string; lastName: string };
    } | null;
    caseId: string | null;
  };
};
