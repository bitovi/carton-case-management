import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentReactions } from './CommentReactions';
import type { CommentReaction } from './types';

describe('CommentReactions', () => {
  const mockOnReactionToggle = vi.fn();
  const commentId = 'comment-1';
  const currentUserId = 'user-1';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render like and dislike buttons with zero counts', () => {
    render(
      <CommentReactions
        commentId={commentId}
        reactions={[]}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    // Both buttons should be rendered with 0 count
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('should display correct counts for likes and dislikes', () => {
    const reactions: CommentReaction[] = [
      { id: '1', type: 'LIKE', userId: 'user-2' },
      { id: '2', type: 'LIKE', userId: 'user-3' },
      { id: '3', type: 'DISLIKE', userId: 'user-4' },
    ];

    render(
      <CommentReactions
        commentId={commentId}
        reactions={reactions}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Like count
    expect(screen.getByText('1')).toBeInTheDocument(); // Dislike count
  });

  it('should show active state when user has liked', () => {
    const reactions: CommentReaction[] = [
      { id: '1', type: 'LIKE', userId: currentUserId },
    ];

    render(
      <CommentReactions
        commentId={commentId}
        reactions={reactions}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    const likeButton = screen.getByLabelText('Upvote');
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should show active state when user has disliked', () => {
    const reactions: CommentReaction[] = [
      { id: '1', type: 'DISLIKE', userId: currentUserId },
    ];

    render(
      <CommentReactions
        commentId={commentId}
        reactions={reactions}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    const dislikeButton = screen.getByLabelText('Downvote');
    expect(dislikeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call onReactionToggle with LIKE when like button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CommentReactions
        commentId={commentId}
        reactions={[]}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    await user.click(screen.getByLabelText('Upvote'));
    expect(mockOnReactionToggle).toHaveBeenCalledWith('LIKE');
  });

  it('should call onReactionToggle with DISLIKE when dislike button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CommentReactions
        commentId={commentId}
        reactions={[]}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    await user.click(screen.getByLabelText('Downvote'));
    expect(mockOnReactionToggle).toHaveBeenCalledWith('DISLIKE');
  });

  it('should not call onReactionToggle when isLoading is true', async () => {
    const user = userEvent.setup();

    render(
      <CommentReactions
        commentId={commentId}
        reactions={[]}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
        isLoading={true}
      />
    );

    await user.click(screen.getByLabelText('Upvote'));
    expect(mockOnReactionToggle).not.toHaveBeenCalled();
  });

  it('should handle switching from like to dislike', () => {
    const reactions: CommentReaction[] = [
      { id: '1', type: 'LIKE', userId: currentUserId },
      { id: '2', type: 'DISLIKE', userId: 'user-2' },
    ];

    render(
      <CommentReactions
        commentId={commentId}
        reactions={reactions}
        currentUserId={currentUserId}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    const likeButton = screen.getByLabelText('Upvote');
    const dislikeButton = screen.getByLabelText('Downvote');

    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    expect(dislikeButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should work without currentUserId (unauthenticated)', () => {
    const reactions: CommentReaction[] = [
      { id: '1', type: 'LIKE', userId: 'user-2' },
    ];

    render(
      <CommentReactions
        commentId={commentId}
        reactions={reactions}
        currentUserId={undefined}
        onReactionToggle={mockOnReactionToggle}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // Like count still shows
    const likeButton = screen.getByLabelText('Upvote');
    expect(likeButton).toHaveAttribute('aria-disabled', 'true');
  });
});
