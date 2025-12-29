import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseList } from './CaseList';

describe('CaseList', () => {
  it('renders without crashing', () => {
    render(<CaseList />);
    expect(screen.getByText('Case List Placeholder')).toBeInTheDocument();
  });
});
