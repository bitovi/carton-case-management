import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CasePage } from './CasePage';

const mockCases = [
  {
    id: '1',
    title: 'Customer Login Issue',
    caseNumber: 'CASE-001',
    status: 'IN_PROGRESS',
    description: 'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password.',
    customerName: 'Acme Corp',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    comments: [
      {
        id: '1',
        content: 'Started investigating the issue. Checked login logs.',
        caseId: '1',
        authorId: '2',
        author: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        createdAt: new Date('2024-01-15T11:00:00Z'),
        updatedAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: '2',
        content: 'Found the issue - password reset token had expired. Sending new reset link to customer.',
        caseId: '1',
        authorId: '2',
        author: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        createdAt: new Date('2024-01-16T09:15:00Z'),
        updatedAt: new Date('2024-01-16T09:15:00Z'),
      },
    ],
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    caseNumber: 'CASE-002',
    status: 'TO_DO',
    description: 'Payment fails at checkout step. Customer receives generic error message.',
    customerName: 'Tech Solutions Inc',
    creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
    assignee: null,
    createdAt: new Date('2024-01-16T08:00:00Z'),
    updatedAt: new Date('2024-01-16T08:00:00Z'),
    comments: [],
  },
  {
    id: '3',
    title: 'Feature Request: Dark Mode',
    caseNumber: 'CASE-003',
    status: 'COMPLETED',
    description: 'User requesting dark mode option for better night-time viewing experience.',
    customerName: 'Global Systems',
    creator: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    assignee: { id: '1', name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-20T16:00:00Z'),
    comments: [
      {
        id: '3',
        content: 'Implemented dark mode toggle in settings.',
        caseId: '3',
        authorId: '1',
        author: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
        createdAt: new Date('2024-01-20T15:00:00Z'),
        updatedAt: new Date('2024-01-20T15:00:00Z'),
      },
    ],
  },
];

const meta: Meta<typeof CasePage> = {
  title: 'Pages/CasePage',
  component: CasePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases[0],
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithSecondCase: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases[1],
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/2']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithCompletedCase: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases[2],
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/3']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const WithoutCaseId: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases[0],
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/']}>
        <Routes>
          <Route path="/cases/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({
            result: {
              data: mockCases[0],
            },
          });
        }),
      ],
    },
  },
};

export const NoCases: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/']}>
        <Routes>
          <Route path="/cases/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: [],
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
      ],
    },
  },
};

export const CaseNotFound: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/999']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: null,
            },
          });
        }),
      ],
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    msw: {
      handlers: [
        http.get('*/trpc/case.list*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases,
            },
          });
        }),
        http.get('*/trpc/case.getById*', () => {
          return HttpResponse.json({
            result: {
              data: mockCases[0],
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Routes>
          <Route path="/cases/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
