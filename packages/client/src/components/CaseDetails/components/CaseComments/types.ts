import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type CaseWithComments = NonNullable<RouterOutput['case']['getById']>;

export type CaseCommentsProps = {
  caseData: CaseWithComments;
};
