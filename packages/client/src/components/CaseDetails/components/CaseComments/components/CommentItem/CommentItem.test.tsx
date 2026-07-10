import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'This is a test comment.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  author: {
    id: '42',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
};

describe('CommentItem', () => {
  it('renders author name', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders comment content', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByText('This is a test comment.')).toBeInTheDocument();
  });

  it('renders upvote and downvote buttons', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('starts with zero like and dislike counts', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('clicking like increments the like count', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clicking like marks the like button as active', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking like again toggles it off and decrements count', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('clicking dislike after liking switches the vote', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Downvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'true');
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(1);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
