import { z } from 'zod';

// Re-export Prisma-generated types
export { ClaimStatus } from '@prisma/client';

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

// Claim/Case types
export interface Claim {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: string; // Will be ClaimStatus from Prisma
  customerName: string;
  assignedTo: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types for UI needs
export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ClaimWithDetails extends Claim {
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
  comments: CommentWithAuthor[];
}

// List view type (sidebar)
export interface ClaimListItem {
  id: string;
  title: string;
  caseNumber: string;
  status: string; // Will be ClaimStatus from Prisma
}

// Legacy Case types (keeping for backward compatibility)
export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
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
