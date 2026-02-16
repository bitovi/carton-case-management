import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentItem } from './CommentItem';

// Mock the hooks and components
vi.mock('@/hooks/useReaction', () => ({
  useReaction: vi.fn(() => ({
    upvotes: 5,
    downvotes: 2,
    upvoters: ['Alice', 'Bob'],
    downvoters: ['Charlie'],
    userVote: 'up',
    toggleUpvote: vi.fn(),
    toggleDownvote: vi.fn(),
    isLoading: false,
    isMutating: false,
  })),
}));

vi.mock('@/components/common/ReactionStatistics', () => ({
  ReactionStatistics: (props: {
    userVote: string;
    upvotes: number;
    downvotes: number;
  }) => (
    <div data-testid="reaction-statistics">
      {props.userVote} - {props.upvotes} up, {props.downvotes} down
    </div>
  ),
}));

describe('CommentItem', () => {
  const mockComment = {
    id: 'comment-1',
    content: 'This is a test comment',
    createdAt: '2024-01-15T10:30:00.000Z',
    author: {
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  it('should render comment content', () => {
    render(<CommentItem comment={mockComment} />);
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  it('should render author initials', () => {
    render(<CommentItem comment={mockComment} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should render author name', () => {
    render(<CommentItem comment={mockComment} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render formatted date', () => {
    render(<CommentItem comment={mockComment} />);
    // Date format will depend on locale, just check it exists
    const dateElement = screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should render ReactionStatistics component', () => {
    render(<CommentItem comment={mockComment} />);
    expect(screen.getByTestId('reaction-statistics')).toBeInTheDocument();
  });
});
