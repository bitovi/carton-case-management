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

  it('renders a reaction row with zero counts for each comment', () => {
    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'c1',
          content: 'First comment',
          createdAt: '2024-01-15T10:00:00Z',
          author: { id: 'u1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);

    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });
});
