import { z } from 'zod';

// Re-export enum schemas from generated
export { CasePrioritySchema, CaseStatusSchema, VoteTypeSchema } from './generated/index.js';
export type { CasePriorityType, CaseStatusType, VoteTypeType } from './generated/index.js';

// Import for local alias
import { CasePrioritySchema, CaseStatusSchema, VoteTypeSchema } from './generated/index.js';

// Lowercase aliases for backwards compatibility
export const casePrioritySchema = CasePrioritySchema;
export const caseStatusSchema = CaseStatusSchema;
export const voteTypeSchema = VoteTypeSchema;

// Legacy type aliases for backwards compatibility
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type CaseStatus = 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type VoteType = 'UP' | 'DOWN';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

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
