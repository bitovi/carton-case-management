import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CasePage } from './CasePage';

describe('CasePage', () => {
  it('renders without crashing', () => {
    render(<CasePage />);
    expect(screen.getByText('Case List Placeholder')).toBeInTheDocument();
    expect(screen.getByText('Case Details Placeholder')).toBeInTheDocument();
  });
});
