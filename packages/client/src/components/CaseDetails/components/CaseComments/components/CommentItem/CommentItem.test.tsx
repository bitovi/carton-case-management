import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: 'c1',
  content: 'Great point.',
  createdAt: '2024-01-15T10:00:00Z',
  author: { id: 'u1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
};

const mockCurrentUser = {
  id: 'u2',
  firstName: 'Jamie',
  lastName: 'Lee',
  email: 'jamie@example.com',
};

describe('CommentItem', () => {
  it('renders comment author, timestamp, and content', () => {
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Great point.')).toBeInTheDocument();
  });

  it('shows "0" on both sides when there are no votes', () => {
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });

  it('clicking upvote selects it and increments the count to 1', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('1');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });

  it('clicking an active upvote again clears it back to 0', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
  });

  it('clicking downvote while upvoted switches the vote to downvote', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Downvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('1');
  });

  it("shows the current user's name in the voter tooltip after upvoting", async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.hover(screen.getByLabelText('Upvote'));

    expect(await screen.findByText('Jamie Lee')).toBeInTheDocument();
  });

  it('does not record a vote when currentUser has not loaded yet', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={undefined} />);

    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
  });
});
