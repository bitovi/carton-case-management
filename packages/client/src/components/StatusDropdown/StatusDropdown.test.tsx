import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StatusDropdown } from './StatusDropdown';
import { createTrpcWrapper } from '../../test/utils';

// Mock the trpc hooks
vi.mock('../../lib/trpc', () => ({
  trpc: {
    case: {
      update: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isPending: false,
        })),
      },
    },
    useUtils: vi.fn(() => ({
      case: {
        getById: {
          invalidate: vi.fn(),
        },
      },
    })),
  },
}));

describe('StatusDropdown', () => {
  it('renders current status', () => {
    render(<StatusDropdown caseId="1" currentStatus="TO_DO" />, {
      wrapper: createTrpcWrapper(),
    });

    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(<StatusDropdown caseId="1" currentStatus="TO_DO" />, {
      wrapper: createTrpcWrapper(),
    });

    const button = screen.getByText('To Do');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });

  it('displays all status options', async () => {
    render(<StatusDropdown caseId="1" currentStatus="TO_DO" />, {
      wrapper: createTrpcWrapper(),
    });

    fireEvent.click(screen.getByText('To Do'));

    await waitFor(() => {
      expect(screen.getAllByText('To Do')).toHaveLength(2); // Button + option
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });
});
