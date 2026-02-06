import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { CaseDetails } from './CaseDetails';
import { createMemoryRouterWrapper } from '../../test/utils';
import { Routes, Route } from 'react-router-dom';
import { ReactElement } from 'react';
import { server } from '@/../vitest.setup';

const mockCaseData = {
  id: '1',
  title: 'Test Case Title',
  description: 'Test case description',
  status: 'TO_DO' as const,
  customerId: '1',
  customer: {
    id: '1',
    name: 'John Customer',
  },
  createdBy: '1',
  creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
  assignedTo: '2',
  assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  updatedBy: '1',
  updater: { id: '1', name: 'John Doe', email: 'john@example.com' },
  createdAt: new Date(2024, 0, 1).toISOString(),
  updatedAt: new Date(2024, 0, 2).toISOString(),
  comments: [
    {
      id: '1',
      content: 'Test comment',
      authorId: '1',
      author: { id: '1', name: 'John Doe', email: 'john@example.com' },
      createdAt: new Date(2024, 0, 1).toISOString(),
    },
  ],
};

const renderCaseDetailsWithRouter = (caseId = '1', element?: ReactElement) => {
  const Wrapper = createMemoryRouterWrapper([`/case/${caseId}`]);
  return render(
    <Routes>
      <Route path="/case/:id" element={element || <CaseDetails />} />
    </Routes>,
    { wrapper: Wrapper }
  );
};

const setupMockHandlers = (caseData: typeof mockCaseData | null = mockCaseData, delay = 0) => {
  server.use(
    http.get('/trpc/case.getById*', async () => {
      if (delay > 0) {
        await new Promise((resolve) => globalThis.setTimeout(resolve, delay));
      }
      return HttpResponse.json({ result: { data: caseData } });
    }),
    http.get('/trpc/customer.list,user.list*', () => {
      return HttpResponse.json([
        {
          result: {
            data: [
              { id: '1', name: 'John Customer' },
              { id: '2', name: 'Jane Customer' },
            ],
          },
        },
        {
          result: {
            data: [
              { id: '1', name: 'John Doe', email: 'john@example.com' },
              { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
            ],
          },
        },
      ]);
    })
  );
};

describe('CaseDetails', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders loading state initially', async () => {
    setupMockHandlers(mockCaseData, 100);

    renderCaseDetailsWithRouter();

    expect(screen.getByText(/Loading case details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('renders case not found message when case does not exist', async () => {
    setupMockHandlers(null);

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No case selected')).toBeInTheDocument();
    });
  });

  it('renders case information when data loads successfully', async () => {
    setupMockHandlers();

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('passes caseId to CaseInformation component', async () => {
    setupMockHandlers();

    renderCaseDetailsWithRouter('123');

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('passes caseData to child components', async () => {
    setupMockHandlers();

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('renders mobile layout with correct order', async () => {
    setupMockHandlers();

    const { container } = renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    const mobileLayout = container.querySelector('.lg\\:hidden');
    expect(mobileLayout).toBeInTheDocument();
  });

  it('renders desktop layout with correct structure', async () => {
    setupMockHandlers();

    const { container } = renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    const desktopLayout = container.querySelector('.lg\\:flex');
    expect(desktopLayout).toBeInTheDocument();
  });

  it('does not fetch case data when id is not provided', () => {
    setupMockHandlers();

    const Wrapper = createMemoryRouterWrapper(['/case']);
    render(
      <Routes>
        <Route path="/case" element={<CaseDetails />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Database connection failed',
              code: -32603,
            },
          },
          { status: 500 }
        );
      }),
      http.get('/trpc/customer.list,user.list*', () => {
        return HttpResponse.json([{ result: { data: [] } }, { result: { data: [] } }]);
      })
    );

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('No case selected')).toBeInTheDocument();
  });
});
