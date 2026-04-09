import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTrpc } from '@/test/utils';
import { CaseRelatedCasesAccordion } from './CaseRelatedCasesAccordion';
import { server } from '@/../vitest.setup';
import { http, HttpResponse } from 'msw';

const mockRelatedCases = [
  {
    id: 'related-1',
    title: 'Related Case One',
    status: 'TO_DO',
    priority: 'MEDIUM',
    createdAt: new Date(2024, 0, 1).toISOString(),
    updatedAt: new Date(2024, 0, 1).toISOString(),
  },
];

const mockAllCases = [
  {
    id: 'case-2',
    title: 'Another Case',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: new Date(2024, 0, 2).toISOString(),
    updatedAt: new Date(2024, 0, 2).toISOString(),
    customer: { id: 'c1', firstName: 'Jane', lastName: 'Doe' },
    creator: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: null,
  },
  {
    id: 'related-1',
    title: 'Related Case One',
    status: 'TO_DO',
    priority: 'MEDIUM',
    createdAt: new Date(2024, 0, 1).toISOString(),
    updatedAt: new Date(2024, 0, 1).toISOString(),
    customer: { id: 'c2', firstName: 'Bob', lastName: 'Smith' },
    creator: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    assignee: null,
  },
];

describe('CaseRelatedCasesAccordion', () => {
  beforeEach(() => {
    server.use(
      http.get('/trpc/case.getRelatedCases,case.list*', () => {
        return HttpResponse.json([
          { result: { data: mockRelatedCases } },
          { result: { data: mockAllCases } },
        ]);
      }),
      http.get('/trpc/case.getRelatedCases*', () => {
        return HttpResponse.json({ result: { data: mockRelatedCases } });
      }),
      http.get('/trpc/case.list*', () => {
        return HttpResponse.json({ result: { data: mockAllCases } });
      }),
      http.post('/trpc/case.addRelatedCases*', () => {
        return HttpResponse.json({ result: { data: { success: true } } });
      })
    );
  });

  it('renders Related Cases accordion', async () => {
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);
    expect(screen.getByText('Related Cases')).toBeInTheDocument();
  });

  it('displays related cases after loading', async () => {
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);
    await waitFor(() => {
      expect(screen.getByText('Related Case One')).toBeInTheDocument();
    });
  });

  it('opens dialog when Add button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
    });
  });

  it('pre-selects existing related cases in dialog', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);

    await waitFor(() => {
      expect(screen.getByText('Related Case One')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.some((cb) => cb.getAttribute('aria-checked') === 'true')).toBe(true);
    });
  });

  it('disables Add button in dialog when no changes made', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);

    await waitFor(() => {
      expect(screen.getByText('Related Case One')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole('button', { name: 'Add' });
    const dialogAddButton = addButtons[addButtons.length - 1];
    expect(dialogAddButton).toBeDisabled();
  });

  it('closes dialog when X button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTrpc(<CaseRelatedCasesAccordion caseId="current-case" />);

    await waitFor(() => {
      expect(screen.getByText('Related Cases')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Add Related Cases')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Add Related Cases')).not.toBeInTheDocument();
    });
  });
});
