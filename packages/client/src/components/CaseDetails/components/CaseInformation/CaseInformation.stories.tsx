import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseInformation } from './CaseInformation';
import type { CaseInformationProps } from './types';

const mockCaseData: CaseInformationProps['caseData'] = {
  id: 'case-123',
  title: 'Customer Login Issue',
  status: 'IN_PROGRESS' as const,
  description:
    'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password. This has been happening since yesterday afternoon.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
};

const meta: Meta<typeof CaseInformation> = {
  title: 'Components/CaseDetails/CaseInformation',
  component: CaseInformation,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('/trpc/case.update', () => {
          return HttpResponse.json({
            result: { data: { success: true } },
          });
        }),
        http.post('/trpc/case.update', () => {
          return HttpResponse.json({
            result: { data: { success: true } },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseId: '1',
    caseData: mockCaseData,
  },
};

export const TodoStatus: Story = {
  args: {
    caseId: '1',
    caseData: {
      ...mockCaseData,
      status: 'TO_DO',
    },
  },
};

export const CompletedStatus: Story = {
  args: {
    caseId: '1',
    caseData: {
      ...mockCaseData,
      status: 'COMPLETED',
      description:
        'This issue has been resolved. Customer can now successfully log in to their account.',
    },
  },
};

export const LongDescription: Story = {
  args: {
    caseId: '1',
    caseData: {
      ...mockCaseData,
      description:
        'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password. This has been happening since yesterday afternoon. We have verified that the user\'s account is active and not locked. The password reset functionality was tested and is working correctly. Investigation into server logs shows no unusual activity. Customer has tried multiple browsers with the same result. We suspect this might be related to a recent update to the authentication system.',
    },
  },
};
