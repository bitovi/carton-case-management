import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseInformation } from './CaseInformation';

describe('CaseInformation', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: 'Test description',
    };
    
    renderWithTrpc(
      <CaseInformation 
        caseId="1" 
        caseData={mockCaseData}
      />
    );
    
    expect(screen.getAllByText('Test Case').length).toBeGreaterThan(0);
    const caseNumbers = screen.getAllByText((content, element) => {
      return element?.textContent === '#CASE-001';
    });
    expect(caseNumbers.length).toBeGreaterThan(0);
  });
});
