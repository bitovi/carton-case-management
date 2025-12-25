import { z } from 'zod';

// Input schemas for tRPC procedures

export const getClaimInput = z.object({
  id: z.string().uuid('Invalid claim ID format'),
});

export const getClaimsListInput = z
  .object({
    limit: z.number().int().positive().max(100).optional().default(20),
  })
  .optional();

export const addCommentInput = z.object({
  caseId: z.string().uuid('Invalid case ID format'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
});

// Type inference helpers
export type GetClaimInput = z.infer<typeof getClaimInput>;
export type GetClaimsListInput = z.infer<typeof getClaimsListInput>;
export type AddCommentInput = z.infer<typeof addCommentInput>;
