export type TaskCommentsProps = {
  taskData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; firstName: string; lastName: string; email: string };
    }>;
  };
};
