import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const meta = {
  title: 'Case Details/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Initial claim review completed. Requesting additional documentation from customer.',
    authorName: 'Alex Morgan',
    authorEmail: 'alex.morgan@example.com',
    createdAt: new Date('2025-11-29T14:23:00Z'),
  },
};

export const RecentComment: Story = {
  args: {
    ...Default.args,
    content: 'Customer has provided the requested documents. Proceeding with claim reassessment.',
    createdAt: new Date(),
  },
};

export const LongComment: Story = {
  args: {
    ...Default.args,
    content: `After thorough review of the submitted documentation, I have identified several key points:

1. The police report confirms the incident date and location
2. All witness statements are consistent with the customer's account
3. Photographic evidence clearly shows the extent of the damage

Based on this information, I recommend approving the claim and proceeding with the payout process. The customer has been very cooperative throughout this investigation.`,
    createdAt: new Date('2025-12-01T09:45:00Z'),
  },
};

export const ShortName: Story = {
  args: {
    ...Default.args,
    authorName: 'Jo Lee',
  },
};
