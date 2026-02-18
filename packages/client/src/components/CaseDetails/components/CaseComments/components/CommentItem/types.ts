import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;
type CaseDetailResponse = Exclude<RouterOutputs['case']['getById'], null>;

export type CommentType = CaseDetailResponse['comments'][number];

export interface CommentItemProps {
  comment: CommentType;
}
