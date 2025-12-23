// TODO: this trpc mocking pattern is not correct - use setup file and override returns?

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import * as trpcModule from '../lib/trpc';

// Mock the trpc module
vi.mock('../lib/trpc', () => ({
  trpc: {
    case: {
      list: {
        useQuery: vi.fn(),
      },
    },
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.spyOn(trpcModule.trpc.case.list, 'useQuery').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading cases/i)).toBeInTheDocument();
  });

  it('renders cases list', () => {
    vi.spyOn(trpcModule.trpc.case.list, 'useQuery').mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Test Case',
          description: 'Test Description',
          status: 'OPEN',
          creator: { name: 'John Doe' },
          assignee: { name: 'Jane Doe' },
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Test Case/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
  });
});
