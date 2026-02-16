import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseComments } from './CaseComments';

const mockUsers = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    username: 'alex',
    dateJoined: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockCaseData = {
  id: '1',
  title: 'Test Case',
  description: 'Test description',
  status: 'IN_PROGRESS',
  comments: [
    {
      id: '1',
      content: 'This is the first comment on the case.',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      author: {
        id: '1',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
      },
      votes: [
        {
          id: 'v1',
          userId: '2',
          voteType: 'UP' as const,
          commentId: '1',
          createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
          updatedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
          user: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      ],
    },
    {
      id: '2',
      content: 'Here is a follow-up comment with more details.',
      createdAt: new Date('2024-01-16T14:30:00Z').toISOString(),
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
      votes: [
        {
          id: 'v2',
          userId: '1',
          voteType: 'UP' as const,
          commentId: '2',
          createdAt: new Date('2024-01-16T15:00:00Z').toISOString(),
          updatedAt: new Date('2024-01-16T15:00:00Z').toISOString(),
          user: {
            id: '1',
            firstName: 'Alex',
            lastName: 'Morgan',
          },
        },
        {
          id: 'v3',
          userId: '3',
          voteType: 'DOWN' as const,
          commentId: '2',
          createdAt: new Date('2024-01-16T16:00:00Z').toISOString(),
          updatedAt: new Date('2024-01-16T16:00:00Z').toISOString(),
          user: {
            id: '3',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
  ],
};

const meta: Meta<typeof CaseComments> = {
  title: 'Components/CaseDetails/CaseComments',
  component: CaseComments,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('/trpc/user.list', () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
        }),
        http.post('/trpc/user.list', () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter>
          <div className="max-w-2xl">
            <Story />
          </div>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseData: mockCaseData,
  },
};

export const NoComments: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      comments: [],
    },
  },
};

export const ManyComments: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      comments: [
        ...mockCaseData.comments,
        {
          id: '3',
          content: 'Adding another update to this case.',
          createdAt: new Date('2024-01-17T09:15:00Z').toISOString(),
          author: {
            id: '1',
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex@example.com',
          },
          votes: [],
        },
        {
          id: '4',
          content: 'This is getting resolved now.',
          createdAt: new Date('2024-01-17T15:45:00Z').toISOString(),
          author: {
            id: '3',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          votes: [
            {
              id: 'v4',
              userId: '1',
              voteType: 'UP' as const,
              commentId: '4',
              createdAt: new Date('2024-01-17T16:00:00Z').toISOString(),
              updatedAt: new Date('2024-01-17T16:00:00Z').toISOString(),
              user: {
                id: '1',
                firstName: 'Alex',
                lastName: 'Morgan',
              },
            },
          ],
        },
        {
          id: '5',
          content: 'Final comment before closing.',
          createdAt: new Date('2024-01-18T11:20:00Z').toISOString(),
          author: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
          },
          votes: [],
        },
      ],
    },
  },
};
