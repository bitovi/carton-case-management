import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { CaseList } from './CaseList';
import { createMemoryRouterWrapper } from '../../test/utils';
import { Routes, Route } from 'react-router-dom';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCases = [
  {
    id: '1',
    title: 'First Case',
    description: 'First case description',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-15T12:00:00.000Z', // Use noon UTC to avoid timezone shifts
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Second Case',
    description: 'Second case description',
    status: 'IN_PROGRESS',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: '2024-01-17T12:00:00.000Z', // Use noon UTC to avoid timezone shifts
    updatedAt: '2024-01-18T12:00:00.000Z',
  },
];

describe('CaseList', () => {
  it('renders loading state initially', async () => {
    server.use(
      http.get('/trpc/case.list*', async () => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });
  });

  it('renders list of cases when data loads successfully', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    // Format: #CAS-YYMMDD-{last8chars}
    // Using noon UTC times ensures consistent dates across all timezones
    expect(screen.getByText('#CAS-240115-1')).toBeInTheDocument();
    expect(screen.getByText('Second Case')).toBeInTheDocument();
    expect(screen.getByText('#CAS-240117-2')).toBeInTheDocument();
  });

  it('renders error state when API call fails', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Database connection failed',
              code: -32603,
            },
          },
          { status: 500 }
        );
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Error loading cases/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders empty state when no cases exist', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('No cases found')).toBeInTheDocument();
    });
  });

  it('highlights active case based on route params', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CaseList />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    const activeLink = screen.getByText('First Case').closest('a');
    expect(activeLink).toHaveClass('bg-[#e8feff]');
  });

  it('renders cases as links with correct paths', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    const firstCaseLink = screen.getByText('First Case').closest('a');
    const secondCaseLink = screen.getByText('Second Case').closest('a');

    expect(firstCaseLink).toHaveAttribute('href', '/cases/1');
    expect(secondCaseLink).toHaveAttribute('href', '/cases/2');
  });

  it('calls onCaseClick callback when case is clicked', async () => {
    const handleCaseClick = vi.fn();
    const user = userEvent.setup();

    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList onCaseClick={handleCaseClick} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    const firstCaseLink = screen.getByText('First Case');
    await user.click(firstCaseLink);

    expect(handleCaseClick).toHaveBeenCalled();
  });

  it('applies hover styles to non-active cases', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CaseList />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('Second Case')).toBeInTheDocument();
    });

    const inactiveLink = screen.getByText('Second Case').closest('a');
    expect(inactiveLink).toHaveClass('hover:bg-gray-100');
  });

  it('truncates long case titles and numbers', async () => {
    const longCase = {
      id: '3',
      title: 'Very Long Case Title That Should Be Truncated',
      description: 'Description',
      status: 'OPEN',
      creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
      assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    };

    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: [longCase] } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(<CaseList />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Very Long Case Title That Should Be Truncated')).toBeInTheDocument();
    });

    const titleElement = screen.getByText('Very Long Case Title That Should Be Truncated');
    expect(titleElement).toHaveClass('truncate');
  });
});
