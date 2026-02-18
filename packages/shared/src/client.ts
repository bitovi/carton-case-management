// Browser-safe exports only - no Prisma dependencies
// Use this entry point for client-side code

// Types from generated Zod schemas (type-only import from @prisma/client is tree-shaken)
export { CasePrioritySchema, CaseStatusSchema, VoteTypeSchema } from './generated/index.js';
export type { CasePriorityType, CaseStatusType, VoteTypeType } from './generated/index.js';

// Legacy type aliases for backwards compatibility
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type CaseStatus = 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type VoteType = 'UP' | 'DOWN';

// Helper constants for UI
export const CASE_PRIORITY_OPTIONS = [
  { value: 'LOW' as const, label: 'Low' },
  { value: 'MEDIUM' as const, label: 'Medium' },
  { value: 'HIGH' as const, label: 'High' },
  { value: 'URGENT' as const, label: 'Urgent' },
] as const;

export const CASE_STATUS_OPTIONS = [
  { value: 'TO_DO' as const, label: 'To Do' },
  { value: 'IN_PROGRESS' as const, label: 'In Progress' },
  { value: 'COMPLETED' as const, label: 'Completed' },
  { value: 'CLOSED' as const, label: 'Closed' },
] as const;

// Utilities (browser-safe)
export { formatDate, formatCaseNumber } from './utils.js';

// Schema derivation helpers
export { PRISMA_AUTO_FIELDS } from './helpers.js';
export type { PrismaAutoFieldKeys } from './helpers.js';
