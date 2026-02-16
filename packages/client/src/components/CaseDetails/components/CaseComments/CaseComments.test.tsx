import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseComments } from './CaseComments';
import type { CaseWithComments } from './types';

describe('CaseComments', () => {
  it('renders without crashing', () => {
    const mockCaseData: CaseWithComments = {
      id: '1',
      title: 'Test Case',
      description: 'Test Description',
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      customerId: 'customer-1',
      createdBy: 'user-1',
      assignedTo: null,
      customer: {
        id: 'customer-1',
        firstName: 'John',
        lastName: 'Doe',
      },
      creator: {
        id: 'user-1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
      assignee: null,
      comments: [],
    };
    
    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });
});
