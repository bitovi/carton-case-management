import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseComments } from './CaseComments';

const mockCaseData = {
  id: '1',
  comments: [
    {
      id: '1',
      content: 'First comment.',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
    },
  ],
};

describe('CaseComments', () => {
  it('renders without crashing', () => {
    renderWithTrpc(<CaseComments caseData={{ id: '1', comments: [] }} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders vote buttons for each comment', () => {
    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });
});
