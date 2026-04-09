import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTrpc } from '@/test/utils';
import { CaseRelatedCases } from './CaseRelatedCases';
import { server } from '@/../vitest.setup';
import { http, HttpResponse } from 'msw';

const mockRelatedCases = [
  {
    id: 'related-1',
    title: 'Policy Coverage Inquiry',
    status: 'TO_DO',
    priority: 'MEDIUM',
    createdAt: new Date(2024, 0, 15).toISOString(),
  },
];

const mockAllCases = [
  {
    id: 'case-1',
    title: 'Current Case',
    status: 'TO_DO',
    priority: 'MEDIUM',
    createdAt: new Date(2024, 0, 10).toISOString(),
    customer: { id: 'c1', firstName: 'John', lastName: 'Doe' },
    creator: { id: 'u1', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    assignee: null,
  },
  {
    id: 'related-1',
    title: 'Policy Coverage Inquiry',
    status: 'TO_DO',
    priority: 'MEDIUM',
    createdAt: new Date(2024, 0, 15).toISOString(),
    customer: { id: 'c1', firstName: 'John', lastName: 'Doe' },
    creator: { id: 'u1', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    assignee: null,
  },
  {
    id: 'related-2',
    title: 'Premium Adjustment Request',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: new Date(2024, 1, 20).toISOString(),
    customer: { id: 'c1', firstName: 'John', lastName: 'Doe' },
    creator: { id: 'u1', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    assignee: null,
  },
];

const setupMocks = (relatedCases = mockRelatedCases) => {
  server.use(
    http.get('/trpc/case.relatedCases.list,case.list', () => {
      return HttpResponse.json([
        { result: { data: relatedCases } },
        { result: { data: mockAllCases } },
      ]);
    }),
    http.get('/trpc/case.relatedCases.list', () => {
      return HttpResponse.json({ result: { data: relatedCases } });
    }),
    http.get('/trpc/case.list', () => {
      return HttpResponse.json({ result: { data: mockAllCases } });
    })
  );
};

describe('CaseRelatedCases', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders the Related Cases accordion', async () => {
    renderWithTrpc(<CaseRelatedCases caseId="case-1" />);
    expect(screen.getByText('Related Cases')).toBeInTheDocument();
  });

  it('displays related cases when loaded', async () => {
    renderWithTrpc(<CaseRelatedCases caseId="case-1" />);
    expect(await screen.findByText('Policy Coverage Inquiry')).toBeInTheDocument();
  });

  it('renders Add button within accordion', async () => {
    renderWithTrpc(<CaseRelatedCases caseId="case-1" />);
    expect(await screen.findByText('Add')).toBeInTheDocument();
  });

  it('opens dialog when Add button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCases caseId="case-1" />);

    const addButton = await screen.findByText('Add');
    await user.click(addButton);

    expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
  });

  it('excludes current case from dialog items', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCases caseId="case-1" />);

    const addButton = await screen.findByText('Add');
    await user.click(addButton);

    expect(screen.queryByText('Current Case')).not.toBeInTheDocument();
  });
});
