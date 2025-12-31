import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithTrpc } from '@/test/utils';
import { CaseEssentialDetails } from './CaseEssentialDetails';

describe('CaseEssentialDetails', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      customer: { id: '1', name: 'Test Customer' },
      customerId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: { id: '2', name: 'Test Assignee' },
      assignedTo: '2',
    };

    renderWithTrpc(<CaseEssentialDetails caseId="1" caseData={mockCaseData} />);
    expect(screen.getByText('Essential Details')).toBeInTheDocument();
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
  });
});
