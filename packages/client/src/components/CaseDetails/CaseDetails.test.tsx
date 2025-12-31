import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { CaseDetails } from './CaseDetails';
import { createMemoryRouterWrapper } from '../../test/utils';
import { Routes, Route } from 'react-router-dom';
import { ReactElement } from 'react';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCaseData = {
  id: '1',
  title: 'Test Case Title',
  description: 'Test case description',
  status: 'OPEN',
  customerName: 'John Customer',
  creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
  assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-02').toISOString(),
  comments: [
    {
      id: '1',
      content: 'Test comment',
      author: { id: '1', name: 'John Doe', email: 'john@example.com' },
      createdAt: new Date('2024-01-01').toISOString(),
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

describe('CaseDetails', () => {
  it('renders loading state initially', async () => {
    server.use(
      http.get('/trpc/case.getById*', async () => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter();

    expect(screen.getByText(/Loading case details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('renders case not found message when case does not exist', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: null } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Case not found')).toBeInTheDocument();
    });
  });

  it('renders case information when data loads successfully', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('passes caseId to CaseInformation component', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter('123');

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('passes caseData to child components', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('calls onMenuClick callback when passed to CaseInformation', async () => {
    const handleMenuClick = vi.fn();

    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderCaseDetailsWithRouter('1', <CaseDetails onMenuClick={handleMenuClick} />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('renders mobile layout with correct order', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const { container } = renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    const mobileLayout = container.querySelector('.lg\\:hidden');
    expect(mobileLayout).toBeInTheDocument();
  });

  it('renders desktop layout with correct structure', async () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      }),
      http.get('/trpc/user.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const { container } = renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    const desktopLayout = container.querySelector('.lg\\:flex');
    expect(desktopLayout).toBeInTheDocument();
  });

  it('does not fetch case data when id is not provided', () => {
    server.use(
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

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
      })
    );

    renderCaseDetailsWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Case not found')).toBeInTheDocument();
  });
});
