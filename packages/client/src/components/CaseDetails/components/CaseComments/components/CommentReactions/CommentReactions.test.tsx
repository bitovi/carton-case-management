import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommentReactions } from './CommentReactions';

describe('CommentReactions', () => {
  it('renders both buttons with zero counts when no reactions', () => {
    render(
      <CommentReactions reactions={[]} currentUserId="u1" onReact={() => {}} />
    );
    expect(screen.getByLabelText('Like comment')).toBeInTheDocument();
    expect(screen.getByLabelText('Dislike comment')).toBeInTheDocument();
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('shows correct counts for likes and dislikes', () => {
    render(
      <CommentReactions
        reactions={[
          { id: 'r1', type: 'LIKE', userId: 'u1' },
          { id: 'r2', type: 'LIKE', userId: 'u2' },
          { id: 'r3', type: 'DISLIKE', userId: 'u3' },
        ]}
        currentUserId="u1"
        onReact={() => {}}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('marks the current user reaction as pressed', () => {
    render(
      <CommentReactions
        reactions={[{ id: 'r1', type: 'LIKE', userId: 'u1' }]}
        currentUserId="u1"
        onReact={() => {}}
      />
    );
    expect(screen.getByLabelText('Like comment')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Dislike comment')).toHaveAttribute('aria-pressed', 'false');
  });

  it('invokes onReact with the clicked type', () => {
    const onReact = vi.fn();
    render(
      <CommentReactions reactions={[]} currentUserId="u1" onReact={onReact} />
    );
    fireEvent.click(screen.getByLabelText('Like comment'));
    fireEvent.click(screen.getByLabelText('Dislike comment'));
    expect(onReact).toHaveBeenNthCalledWith(1, 'LIKE');
    expect(onReact).toHaveBeenNthCalledWith(2, 'DISLIKE');
  });

  it('disables buttons when no currentUserId', () => {
    render(<CommentReactions reactions={[]} onReact={() => {}} />);
    expect(screen.getByLabelText('Like comment')).toBeDisabled();
    expect(screen.getByLabelText('Dislike comment')).toBeDisabled();
  });
});
