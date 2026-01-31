/**
 * Vote Types and Utilities for Comment Voting System
 *
 * This module provides shared types, enums, and utilities for the comment voting feature.
 * It exports the VoteType enum and related types used across client and server.
 */

import { z } from 'zod';
import { VoteTypeSchema } from './generated';

/**
 * VoteType enum representing the type of vote a user can cast on a comment
 * - LIKE: Positive vote (thumbs up)
 * - DISLIKE: Negative vote (thumbs down)
 */
export enum VoteType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

// Re-export the Zod schema from generated types
export { VoteTypeSchema };

/**
 * TypeScript type derived from VoteTypeSchema
 */
export type VoteTypeValue = z.infer<typeof VoteTypeSchema>;

/**
 * Vote counts aggregated by type
 */
export interface VoteCounts {
  likes: number;
  dislikes: number;
}

/**
 * Vote data including counts and current user's vote
 */
export interface CommentVoteData extends VoteCounts {
  userVote: VoteType | null;
}

/**
 * Input for casting or updating a vote
 */
export const voteInputSchema = z.object({
  commentId: z.string().uuid(),
  voteType: VoteTypeSchema,
});

export type VoteInput = z.infer<typeof voteInputSchema>;

/**
 * Input for removing a vote
 */
export const removeVoteInputSchema = z.object({
  commentId: z.string().uuid(),
});

export type RemoveVoteInput = z.infer<typeof removeVoteInputSchema>;

/**
 * Helper function to determine if a value is a valid VoteType
 */
export function isValidVoteType(value: unknown): value is VoteType {
  return value === VoteType.LIKE || value === VoteType.DISLIKE;
}

/**
 * Helper function to get the opposite vote type
 */
export function getOppositeVote(voteType: VoteType): VoteType {
  return voteType === VoteType.LIKE ? VoteType.DISLIKE : VoteType.LIKE;
}
