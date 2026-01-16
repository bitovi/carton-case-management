import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server/src/router';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type TaskListItem = RouterOutput['task']['list'][number];

export interface TaskListProps {
  onTaskClick?: () => void;
}
