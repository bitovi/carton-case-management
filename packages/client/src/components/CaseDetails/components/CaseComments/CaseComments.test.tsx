import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/../vitest.setup';
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

  it('renders reaction counts and sends a toggle reaction request', async () => {
    const user = userEvent.setup();
    let toggleReactionRequests = 0;

    server.use(
      http.get('http://localhost:3000/trpc/user.list*', () => {
        return HttpResponse.json({
          result: {
            data: [
              {
                id: 'user-1',
                firstName: 'Alex',
                lastName: 'Morgan',
                username: 'alex',
                email: 'alex@example.com',
                dateJoined: new Date('2024-01-01').toISOString(),
                createdAt: new Date('2024-01-01').toISOString(),
                updatedAt: new Date('2024-01-01').toISOString(),
              },
            ],
          },
        });
      }),
      http.post('http://localhost:3000/trpc/comment.toggleReaction*', async () => {
        toggleReactionRequests += 1;
        await new Promise((resolve) => globalThis.setTimeout(resolve, 50));
        return HttpResponse.json(
          {
            result: {
              data: { success: true },
            },
          },
          { status: 200 }
        );
      })
    );

    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'comment-1',
          content: 'Like this idea',
          createdAt: new Date('2024-01-01').toISOString(),
          author: {
            id: 'user-2',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
          },
          reactions: [
            {
              id: 'reaction-1',
              reactionType: 'LIKE' as const,
              userId: 'user-2',
              user: { id: 'user-2', firstName: 'Jane', lastName: 'Doe' },
            },
            {
              id: 'reaction-2',
              reactionType: 'DISLIKE' as const,
              userId: 'user-3',
              user: { id: 'user-3', firstName: 'Sam', lastName: 'Lee' },
            },
          ],
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);

    await waitFor(() => {
      expect(screen.getByText('Like this idea')).toBeInTheDocument();
    });

    expect(screen.getAllByText('1')).toHaveLength(2);

    await user.click(screen.getByLabelText('Upvote'));

    await waitFor(() => {
      expect(toggleReactionRequests).toBe(1);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    });
  });
});
