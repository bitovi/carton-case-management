import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;

// Get the exact type from the case.getById comments array
export type Comment = NonNullable<RouterOutputs['case']['getById']>['comments'][number];

export interface CommentItemProps {
  comment: Comment;
  caseId: string;
}
