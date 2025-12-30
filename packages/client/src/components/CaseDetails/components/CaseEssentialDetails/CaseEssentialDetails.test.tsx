import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseEssentialDetails } from './CaseEssentialDetails';

describe('CaseEssentialDetails', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      customerName: 'Test Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: { name: 'Test Assignee' },
    };
    
    render(<CaseEssentialDetails caseData={mockCaseData} />);
    expect(screen.getByText('Essential Details')).toBeInTheDocument();
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
  });
});
