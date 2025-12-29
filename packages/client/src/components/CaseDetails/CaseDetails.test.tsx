import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseDetails } from './CaseDetails';

describe('CaseDetails', () => {
  it('renders without crashing', () => {
    render(<CaseDetails />);
    expect(screen.getByText('Case Information Placeholder')).toBeInTheDocument();
    expect(screen.getByText('Case Comments Placeholder')).toBeInTheDocument();
    expect(screen.getByText('Case Essential Details Placeholder')).toBeInTheDocument();
  });
});
