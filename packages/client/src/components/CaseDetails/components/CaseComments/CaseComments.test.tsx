import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseComments } from './CaseComments';

describe('CaseComments', () => {
  it('renders without crashing', () => {
    render(<CaseComments />);
    expect(screen.getByText('Case Comments Placeholder')).toBeInTheDocument();
  });
});
