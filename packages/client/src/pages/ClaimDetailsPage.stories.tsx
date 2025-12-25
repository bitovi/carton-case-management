import type { Meta, StoryObj } from '@storybook/react';
import { ClaimDetailsPage } from './ClaimDetailsPage';
import { ClaimStatus } from '@carton/shared';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof ClaimDetailsPage> = {
  title: 'Pages/ClaimDetailsPage',
  component: ClaimDetailsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    reactRouter: {
      routePath: '/claims/:id',
      routeParams: { id: '123e4567-e89b-12d3-a456-426614174000' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClaimDetailsPage>;

const mockClaimData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Insurance Claim Dispute',
  caseNumber: 'CAS-242314-2124',
  description:
    'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
  status: ClaimStatus.TO_DO,
  customerName: 'Sarah Johnson',
  assignedTo: '789e4567-e89b-12d3-a456-426614174000',
  createdBy: '456e4567-e89b-12d3-a456-426614174000',
  createdAt: '2025-10-24T10:00:00.000Z',
  updatedAt: '2025-12-12T15:30:00.000Z',
  creator: {
    id: '456e4567-e89b-12d3-a456-426614174000',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
  },
  assignee: {
    id: '789e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  comments: [],
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/getClaim', () => {
          return HttpResponse.json({
            result: {
              data: mockClaimData,
            },
          });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/getClaim', async () => {
          await new Promise(() => {}); // Never resolves
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/getClaim', () => {
          return HttpResponse.json(
            {
              error: {
                code: 'NOT_FOUND',
                message: 'Claim not found',
              },
            },
            { status: 404 }
          );
        }),
      ],
    },
  },
};

export const NoAssignedAgent: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/getClaim', () => {
          return HttpResponse.json({
            result: {
              data: {
                ...mockClaimData,
                assignedTo: null,
                assignee: null,
              },
            },
          });
        }),
      ],
    },
  },
};
