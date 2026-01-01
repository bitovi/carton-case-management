import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

// Case enums
export const casePrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export type CasePriority = z.infer<typeof casePrioritySchema>;

export const caseStatusSchema = z.enum(['TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']);
export type CaseStatus = z.infer<typeof caseStatusSchema>;

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
