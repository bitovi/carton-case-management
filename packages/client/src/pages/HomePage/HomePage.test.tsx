import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import HomePage from './HomePage';
import { renderWithTrpc } from '../test/utils';

// Setup MSW server for API mocking
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('HomePage', () => {
  it('renders loading state initially', async () => {
    // Mock slow response to ensure we see loading state
    server.use(
      http.get('http://localhost:3000/trpc/case.list', async () => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderWithTrpc(<HomePage />);
    
    // Loading state should be visible
    expect(screen.getByText(/Loading cases/i)).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading cases/i)).not.toBeInTheDocument();
    });
  });

  it('renders cases list when data loads successfully', async () => {
    // Mock successful API response
    server.use(
      http.get('http://localhost:3000/trpc/case.list', () => {
        return HttpResponse.json({
          result: {
            data: [
              {
                id: '1',
                title: 'Test Case',
                description: 'Test Description',
                status: 'OPEN',
                creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
                assignee: { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
        });
      })
    );

    renderWithTrpc(<HomePage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Case')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Status: OPEN/i)).toBeInTheDocument();
    expect(screen.getByText(/Created by: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned to: Jane Doe/i)).toBeInTheDocument();
  });

  it('renders error state when API call fails', async () => {
    // Mock error response
    server.use(
      http.get('http://localhost:3000/trpc/case.list', () => {
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

    renderWithTrpc(<HomePage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error loading cases/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no cases exist', async () => {
    // Mock empty response
    server.use(
      http.get('http://localhost:3000/trpc/case.list', () => {
        return HttpResponse.json({
          result: {
            data: [],
          },
        });
      })
    );

    renderWithTrpc(<HomePage />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading cases/i)).not.toBeInTheDocument();
    });

    // No cases should be rendered
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

