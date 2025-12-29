import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseInformation } from './CaseInformation';

describe('CaseInformation', () => {
  it('renders without crashing', () => {
    render(<CaseInformation />);
    expect(screen.getByText('Case Information Placeholder')).toBeInTheDocument();
  });
});
