import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { CustomerListDialog } from './CustomerListDialog';
import { createTrpcWrapper } from '../../test/utils';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCustomers = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    username: 'asmith',
    email: 'alice@example.com',
    dateJoined: null,
    satisfactionRate: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    username: 'bjones',
    email: 'bob@example.com',
    dateJoined: null,
    satisfactionRate: null,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'White',
    username: 'cwhite',
    email: 'carol@example.com',
    dateJoined: null,
    satisfactionRate: null,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

describe('CustomerListDialog', () => {
  it('does not render content when closed', () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={false} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    expect(screen.queryByText('Customers')).not.toBeInTheDocument();
  });

  it('renders dialog title when open', async () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Customers')).toBeInTheDocument();
    });
  });

  it('renders loading skeletons while fetching', async () => {
    server.use(
      http.get('/trpc/customer.list*', async () => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });
  });

  it('renders customer list when data loads', async () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Carol White')).toBeInTheDocument();
  });

  it('shows delete button for each customer', async () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    expect(deleteButtons).toHaveLength(3);
  });

  it('filters customers by search query', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search customers...');
    await user.type(searchInput, 'alice');

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
    expect(screen.queryByText('Carol White')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no matches', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search customers...');
    await user.type(searchInput, 'zzznomatch');

    expect(screen.getByText('No customers match your search')).toBeInTheDocument();
  });

  it('shows empty state when no customers exist', async () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument();
    });
  });

  it('shows error state when API call fails', async () => {
    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json(
          { error: { message: 'Internal Server Error', code: -32603 } },
          { status: 500 }
        );
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Error loading customers/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('opens confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: 'Delete Alice Smith' });
    await user.click(deleteButton);

    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete Alice Smith/)).toBeInTheDocument();
  });

  it('calls delete mutation when confirmed', async () => {
    const user = userEvent.setup();
    let deleteWasCalled = false;

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      }),
      http.post('/trpc/customer.delete*', () => {
        deleteWasCalled = true;
        return HttpResponse.json({ result: { data: { id: '1' } } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Alice Smith' }));

    await waitFor(() => {
      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteWasCalled).toBe(true);
    });
  });

  it('cancels deletion when cancel button is clicked in confirmation', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={vi.fn()} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Alice Smith' }));

    await waitFor(() => {
      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Delete Customer')).not.toBeInTheDocument();
    });
  });

  it('clears search query when dialog is closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    server.use(
      http.get('/trpc/customer.list*', () => {
        return HttpResponse.json({ result: { data: mockCustomers } });
      })
    );

    const Wrapper = createTrpcWrapper();
    render(<CustomerListDialog open={true} onOpenChange={onOpenChange} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search customers...');
    await user.type(searchInput, 'alice');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
