import { trpc } from '@/lib/trpc';
import { Comments } from '@/components/common/Comments';
import type { TaskCommentsProps } from './types';

export function TaskComments({ taskData }: TaskCommentsProps) {
  const utils = trpc.useUtils();

  const { data: users } = trpc.user.list.useQuery();
  const currentUser = users?.[0];

  const createCommentMutation = trpc.comment.create.useMutation({
    onMutate: async (variables) => {
      await utils.task.getById.cancel({ id: taskData.id });
      const previousTask = utils.task.getById.getData({ id: taskData.id });

      if (previousTask && currentUser) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: variables.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caseId: null,
          taskId: taskData.id,
          authorId: currentUser.id,
          author: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
        };

        utils.task.getById.setData(
          { id: taskData.id },
          {
            ...previousTask,
            comments: [optimisticComment, ...(previousTask.comments || [])],
          }
        );
      }

      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTask) {
        utils.task.getById.setData({ id: taskData.id }, context.previousTask);
      }
    },
    onSettled: () => {
      utils.task.getById.invalidate({ id: taskData.id });
    },
  });

  const handleSubmit = (content: string) => {
    if (!currentUser) return;
    createCommentMutation.mutate({ taskId: taskData.id, content });
  };

  return (
    <Comments
      comments={taskData.comments || []}
      onSubmit={handleSubmit}
      isSubmitting={createCommentMutation.isPending}
    />
  );
}
