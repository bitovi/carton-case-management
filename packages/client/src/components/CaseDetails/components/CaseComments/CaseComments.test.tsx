import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseComments } from './CaseComments';

describe('CaseComments', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      id: '1',
      title: 'Test Case',
      description: 'Test description',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      customerId: '1',
      createdBy: '1',
      assignedTo: null,
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-16T14:30:00Z').toISOString(),
      customer: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      },
      creator: {
        id: '1',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
      },
      assignee: null,
      comments: [],
    };
    
    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });
});
