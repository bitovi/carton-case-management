import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTrpc } from '@/test/utils';
import { CaseEssentialDetails } from './CaseEssentialDetails';
import { server } from '@/../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('CaseEssentialDetails', () => {
  beforeEach(() => {
    // Mock the batched tRPC query for customer.list and user.list
    server.use(
      http.get('/trpc/customer.list,user.list', () => {
        return HttpResponse.json([
          {
            result: {
              data: [
                { id: '1', name: 'Test Customer' },
                { id: '2', name: 'Another Customer' },
              ],
            },
          },
          {
            result: {
              data: [
                { id: '2', name: 'Test Assignee', email: 'assignee@test.com' },
                { id: '3', name: 'Test Creator', email: 'creator@test.com' },
                { id: '4', name: 'Test Updater', email: 'updater@test.com' },
              ],
            },
          },
        ]);
      })
    );
  });

  it('renders without crashing', async () => {
    const mockCaseData = {
      customer: { id: '1', name: 'Test Customer' },
      customerId: '1',
      createdAt: new Date(2026, 0, 2).toISOString(),
      updatedAt: new Date(2026, 0, 2).toISOString(),
      assignee: { id: '2', name: 'Test Assignee', email: 'assignee@test.com' },
      assignedTo: '2',
      creator: { id: '3', name: 'Test Creator', email: 'creator@test.com' },
      createdBy: '3',
      updater: { id: '4', name: 'Test Updater', email: 'updater@test.com' },
      updatedBy: '4',
    };

    renderWithTrpc(<CaseEssentialDetails caseId="1" caseData={mockCaseData} />);

    expect(screen.getByText('Essential Details')).toBeInTheDocument();

    // Wait for customer data to load and be displayed
    expect(await screen.findByText('Test Customer')).toBeInTheDocument();
  });
});
