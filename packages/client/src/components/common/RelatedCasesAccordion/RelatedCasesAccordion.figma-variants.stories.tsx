import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RelatedCasesAccordion } from './RelatedCasesAccordion';

const mockCases = [
  {
    id: 'a1b2c3d4',
    title: 'Policy Coverage Inquiry',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2025-03-15T10:30:00Z',
  },
  {
    id: 'e5f6g7h8',
    title: 'Billing Dispute Resolution',
    status: 'Open',
    priority: 'Medium',
    createdAt: '2025-04-02T14:00:00Z',
  },
  {
    id: 'i9j0k1l2',
    title: 'Claims Processing Delay',
    status: 'Completed',
    priority: 'Low',
    createdAt: '2025-01-20T08:45:00Z',
  },
];

const meta = {
  title: 'Figma Variants/RelatedCasesAccordion',
  component: RelatedCasesAccordion,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/cases/1']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RelatedCasesAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateClosedItemCount0: Story = {
  args: {
    cases: [],
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button[data-state="open"]') as HTMLElement;
    if (trigger) {
      trigger.click();
      await new Promise((resolve) => globalThis.setTimeout(resolve, 350));
    }
  },
};

export const StateOpenItemCount0: Story = {
  args: {
    cases: [],
  },
};

export const StateOpenItemCount1: Story = {
  args: {
    cases: [mockCases[0]],
  },
};

export const StateOpenItemCount3: Story = {
  args: {
    cases: mockCases,
  },
};
