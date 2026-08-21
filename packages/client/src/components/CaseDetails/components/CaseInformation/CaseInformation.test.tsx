import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseInformation } from './CaseInformation';

describe('CaseInformation', () => {
  it('renders without crashing', () => {
    const mockCaseData = {
      id: '1',
      title: 'Test Case',
      status: 'TO_DO' as const,
      description: 'Test description',
      createdAt: new Date(2024, 0, 15).toISOString(), // Using local date: January 15, 2024
    };

    renderWithTrpc(<CaseInformation caseId="1" caseData={mockCaseData} />);

    expect(screen.getAllByText('Test Case').length).toBeGreaterThan(0);
    // Case number is formatted as #CAS-YYYYMMDD-{last 8 chars of id}
    expect(screen.getAllByText('#CAS-20240115-1').length).toBeGreaterThan(0);
  });
});
