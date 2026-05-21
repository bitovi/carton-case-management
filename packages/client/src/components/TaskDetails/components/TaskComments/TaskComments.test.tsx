import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { TaskComments } from './TaskComments';

describe('TaskComments', () => {
  it('renders without crashing', () => {
    const mockTaskData = {
      id: '1',
      comments: [],
    };

    renderWithTrpc(<TaskComments taskData={mockTaskData} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });
});
