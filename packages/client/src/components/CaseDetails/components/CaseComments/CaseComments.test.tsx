import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CaseComments } from './CaseComments';

describe('CaseComments', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      id: '1',
      comments: [],
    };
    
    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders like and dislike controls for each comment and toggles vote state', async () => {
    const user = userEvent.setup();
    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          createdAt: '2026-05-28T00:00:00.000Z',
          author: {
            id: 'user-1',
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex@example.com',
          },
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);

    const upvoteButton = screen.getByRole('button', { name: 'Upvote' });
    const downvoteButton = screen.getByRole('button', { name: 'Downvote' });

    expect(upvoteButton).toHaveAttribute('aria-pressed', 'false');
    expect(downvoteButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByText('1')).toHaveLength(2);

    await user.click(upvoteButton);
    expect(upvoteButton).toHaveAttribute('aria-pressed', 'true');
    expect(downvoteButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(downvoteButton);
    expect(upvoteButton).toHaveAttribute('aria-pressed', 'false');
    expect(downvoteButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
