import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
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

  it('renders like and dislike buttons for each comment', () => {
    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'c1',
          content: 'A comment',
          createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
          author: {
            id: 'u1',
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex@example.com',
          },
          reactions: [],
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByLabelText('Like comment')).toBeInTheDocument();
    expect(screen.getByLabelText('Dislike comment')).toBeInTheDocument();
  });

  it('shows like and dislike counts from reactions', () => {
    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'c1',
          content: 'A comment',
          createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
          author: {
            id: 'u1',
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex@example.com',
          },
          reactions: [
            { id: 'r1', type: 'LIKE' as const, userId: 'u2' },
            { id: 'r2', type: 'LIKE' as const, userId: 'u3' },
            { id: 'r3', type: 'DISLIKE' as const, userId: 'u4' },
          ],
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
