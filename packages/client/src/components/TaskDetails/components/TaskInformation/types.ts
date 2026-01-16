export type TaskInformationProps = {
  taskId: string;
  taskData: {
    id: string;
    title: string;
    description: string;
    createdAt: Date | string;
  };
  onMenuClick?: () => void;
};
