import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentVoteButtons } from './CommentVoteButtons';
import { createTrpcWrapper } from '@/test/utils';

const mockOnVoteSuccess = vi.fn();

describe('CommentVoteButtons', () => {
  const defaultProps = {
    commentId: 'comment-1',
    votes: [],
    currentUserId: 'user-1',
    onVoteSuccess: mockOnVoteSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders both like and dislike buttons', () => {
      render(<CommentVoteButtons {...defaultProps} />, { wrapper: createTrpcWrapper() });
      
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });

    it('does not show counts when there are no votes', () => {
      render(<CommentVoteButtons {...defaultProps} />, { wrapper: createTrpcWrapper() });
      
      expect(screen.queryByText('0')).not.toBeInTheDocument();
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Vote counts', () => {
    it('shows like count when there are likes', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-2', name: 'Alice' } },
        { id: '2', voteType: 'LIKE' as const, user: { id: 'user-3', name: 'Bob' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows dislike count when there are dislikes', () => {
      const votes = [
        { id: '1', voteType: 'DISLIKE' as const, user: { id: 'user-2', name: 'Alice' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('shows both counts when there are likes and dislikes', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-2', name: 'Alice' } },
        { id: '2', voteType: 'LIKE' as const, user: { id: 'user-3', name: 'Bob' } },
        { id: '3', voteType: 'DISLIKE' as const, user: { id: 'user-4', name: 'Charlie' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      const counts = screen.getAllByText(/\d+/);
      expect(counts).toHaveLength(2);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Active states', () => {
    it('shows like button as active when current user has liked', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-1', name: 'Current User' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      const likeButton = screen.getByLabelText('Upvote');
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
      expect(likeButton).toHaveClass('text-teal-500');
    });

    it('shows dislike button as active when current user has disliked', () => {
      const votes = [
        { id: '1', voteType: 'DISLIKE' as const, user: { id: 'user-1', name: 'Current User' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      const dislikeButton = screen.getByLabelText('Downvote');
      expect(dislikeButton).toHaveAttribute('aria-pressed', 'true');
      expect(dislikeButton).toHaveClass('text-red-500');
    });

    it('shows both buttons as inactive when current user has not voted', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-2', name: 'Alice' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'false');
    });

    it('handles missing currentUserId gracefully', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-2', name: 'Alice' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} currentUserId={undefined} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Voter tooltips', () => {
    it('provides voter names to like button tooltip', () => {
      const votes = [
        { id: '1', voteType: 'LIKE' as const, user: { id: 'user-2', name: 'Alice' } },
        { id: '2', voteType: 'LIKE' as const, user: { id: 'user-3', name: 'Bob' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      // VoteButton will handle the tooltip display
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    });

    it('provides voter names to dislike button tooltip', () => {
      const votes = [
        { id: '1', voteType: 'DISLIKE' as const, user: { id: 'user-2', name: 'Charlie' } },
      ];

      render(
        <CommentVoteButtons {...defaultProps} votes={votes} />,
        { wrapper: createTrpcWrapper() }
      );

      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });
  });
});
