import type { Meta, StoryObj } from '@storybook/react';
import type { ReactRenderer } from '@storybook/react';
import type { DecoratorFunction } from '@storybook/csf';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseInformation } from './CaseInformation';
import type { CaseInformationProps } from './types';

const mockCaseData: CaseInformationProps['caseData'] = {
  id: 'case-001',
  title: 'Customer Login Issue',
  status: 'IN_PROGRESS' as const,
  description:
    'Customer reports being unable to log in to their account. Error message: "Invalid credentials" appears even with correct password.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
};

const mswHandlers = [
  http.get('/trpc/case.update', () => {
    return HttpResponse.json({ result: { data: { success: true } } });
  }),
  http.post('/trpc/case.update', () => {
    return HttpResponse.json({ result: { data: { success: true } } });
  }),
  http.get('/trpc/case.delete', () => {
    return HttpResponse.json({ result: { data: { success: true } } });
  }),
  http.post('/trpc/case.delete', () => {
    return HttpResponse.json({ result: { data: { success: true } } });
  }),
];

const baseDecorators: DecoratorFunction<ReactRenderer>[] = [
  (Story) => (
    <TrpcProvider>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </TrpcProvider>
  ),
];

const mobileDecorators: DecoratorFunction<ReactRenderer>[] = [
  (Story) => (
    <TrpcProvider>
      <MemoryRouter>
        <div className="mobile-force" style={{ maxWidth: '375px' }}>
          <style>
            {'.mobile-force [class*="lg:hidden"] { display: flex !important; } .mobile-force [class*="lg:flex"] { display: none !important; }'}
          </style>
          <Story />
        </div>
      </MemoryRouter>
    </TrpcProvider>
  ),
];

const meta = {
  title: 'Figma Variants/CaseInformation',
  component: CaseInformation,
  decorators: baseDecorators,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    msw: { handlers: mswHandlers },
  },
} as Meta<typeof CaseInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  caseId: '1',
  caseData: mockCaseData,
};

export const LayoutDesktopStatusInProgress: Story = {
  args: { ...baseArgs },
};

export const LayoutDesktopStatusToDo: Story = {
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'TO_DO' as const },
  },
};

export const LayoutDesktopStatusCompleted: Story = {
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'COMPLETED' as const },
  },
};

export const LayoutDesktopStatusClosed: Story = {
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'CLOSED' as const },
  },
};

export const LayoutMobileStatusInProgress: Story = {
  decorators: mobileDecorators,
  args: { ...baseArgs },
};

export const LayoutMobileStatusToDo: Story = {
  decorators: mobileDecorators,
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'TO_DO' as const },
  },
};

export const LayoutMobileStatusCompleted: Story = {
  decorators: mobileDecorators,
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'COMPLETED' as const },
  },
};

export const LayoutMobileStatusClosed: Story = {
  decorators: mobileDecorators,
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, status: 'CLOSED' as const },
  },
};

export const PendingTrue: Story = {
  args: {
    ...baseArgs,
    __storyPending: true,
  } as any,
};

export const DescriptionEmpty: Story = {
  args: {
    ...baseArgs,
    caseData: { ...mockCaseData, description: '' },
  },
};

export const DescriptionLong: Story = {
  args: {
    ...baseArgs,
    caseData: {
      ...mockCaseData,
      description:
        "Customer reports being unable to log in to their account. Error message: Invalid credentials appears even with correct password. This has been happening since yesterday afternoon. We have verified that the user's account is active and not locked. The password reset functionality was tested and is working correctly. Investigation into server logs shows no unusual activity. Customer has tried multiple browsers with the same result. We suspect this might be related to a recent update to the authentication system. Further investigation is needed to determine the root cause.",
    },
  },
};

export const DeleteDialogOpen: Story = {
  args: {
    ...baseArgs,
    __storyDeleteDialogOpen: true,
  } as any,
};
