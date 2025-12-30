import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { CasePage } from './CasePage';
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
    caseNumber: 'CASE-001',
    description: 'First case description',
    status: 'OPEN',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '2',
    title: 'Second Case',
    caseNumber: 'CASE-002',
    description: 'Second case description',
    status: 'IN_PROGRESS',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-04').toISOString(),
  },
];

const mockCaseData = {
  id: '1',
  title: 'First Case',
  caseNumber: 'CASE-001',
  description: 'First case description',
  status: 'OPEN',
  customerName: 'John Customer',
  creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
  assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-02').toISOString(),
  comments: [],
};

describe('CasePage', () => {
  it('renders CaseList on desktop layout', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    const { container } = render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    const desktopList = container.querySelector('.lg\\:block');
    expect(desktopList).toBeInTheDocument();
  });

  it('renders CaseDetails component', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('redirects to first case when accessing root path with cases available', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(
      <Routes>
        <Route path="/" element={<CasePage />} />
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('does not redirect when case ID is present in URL', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });
  });

  it('renders mobile sheet component', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('handles empty case list', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases']);
    render(
      <Routes>
        <Route path="/cases" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('No cases found')).toBeInTheDocument();
    });
  });

  it('renders with proper layout structure', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    const { container } = render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('First Case')).toBeInTheDocument();
    });

    const layoutDiv = container.querySelector('.bg-\\[\\#fbfcfc\\]');
    expect(layoutDiv).toBeInTheDocument();
  });

  it('passes onMenuClick prop to CaseDetails', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockCases } });
      }),
      http.get('/trpc/case.getById*', () => {
        return HttpResponse.json({ result: { data: mockCaseData } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/cases/1']);
    render(
      <Routes>
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading case details/i)).not.toBeInTheDocument();
    });
  });

  it('does not redirect when no cases are available', async () => {
    server.use(
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const Wrapper = createMemoryRouterWrapper(['/']);
    render(
      <Routes>
        <Route path="/" element={<CasePage />} />
      </Routes>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('No cases found')).toBeInTheDocument();
    });
  });
});
