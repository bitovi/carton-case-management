import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { Comments } from './Comments';

describe('Comments', () => {
  const mockOnSubmit = () => {};

  it('renders without crashing with no comments', () => {
    render(<Comments comments={[]} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('No comments yet')).toBeInTheDocument();
  });

  it('renders a list of comments', () => {
    const comments = [
      {
        id: '1',
        content: 'First comment',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        author: { id: 'u1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
      },
    ];
    render(<Comments comments={comments} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
  });
});
