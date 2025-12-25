import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

// Example shared types - expand these based on your domain
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  caseType: string;
  customerName: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  caseId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface CaseWithComments extends Case {
  comments: CommentWithAuthor[];
  assignee?: User;
  creator: User;
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum CaseType {
  INSURANCE_CLAIM_DISPUTE = 'Insurance Claim Dispute',
  POLICY_COVERAGE_INQUIRY = 'Policy Coverage Inquiry',
  PREMIUM_ADJUSTMENT = 'Premium Adjustment Request',
  CLAIM_STATUS_UPDATE = 'Claim Status Update',
  FRAUD_INVESTIGATION = 'Fraud Investigation',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API Input validation schemas
export const createCommentSchema = z.object({
  caseId: z.string().uuid('Invalid case ID'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment too long (max 5000 characters)'),
});

export const getCaseByIdSchema = z.object({
  id: z.string().uuid('Invalid case ID'),
});

export const listCasesSchema = z
  .object({
    status: z.nativeEnum(CaseStatus).optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  })
  .optional();

// API Input types
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type GetCaseByIdInput = z.infer<typeof getCaseByIdSchema>;
export type ListCasesInput = z.infer<typeof listCasesSchema>;
