import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;
type CaseWithComments = RouterOutputs['case']['getById'];

export type CommentData = NonNullable<CaseWithComments>['comments'][number];

export interface CommentItemProps {
  comment: CommentData;
  caseId: string;
  currentUserId?: string;
}
