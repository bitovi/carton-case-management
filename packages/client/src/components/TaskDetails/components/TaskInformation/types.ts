import type { TaskStatus } from '@carton/shared/client';

export type TaskInformationProps = {
  taskId: string;
  taskData: {
    id: string;
    summary: string;
    description: string;
    status: TaskStatus;
    createdAt: Date | string;
  };
};
