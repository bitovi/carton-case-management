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
});
