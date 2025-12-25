import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Claim/CommentItem',
  component: CommentItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    content: 'Verified income documentation. Customer qualifies for assistance program.',
    authorName: 'Alex Morgan',
    createdAt: new Date('2025-12-01T14:20:00Z'),
  },
};

export const LongComment: Story = {
  args: {
    content: `This is a longer comment that spans multiple lines and contains detailed information about the case.

The customer has provided all necessary documentation and we have verified their eligibility for the program. Next steps include scheduling an initial consultation and preparing the application paperwork.

Expected timeline is 2-3 weeks for completion.`,
    authorName: 'Jane Smith',
    createdAt: new Date('2025-12-15T10:30:00Z'),
  },
};

export const RecentComment: Story = {
  args: {
    content: 'Just added this comment a few minutes ago.',
    authorName: 'Bob Wilson',
    createdAt: new Date(),
  },
};

export const DifferentAuthors: Story = {
  render: () => (
    <div className="space-y-4">
      <CommentItem
        content="Initial assessment completed."
        authorName="Alex Morgan"
        createdAt={new Date('2025-11-29T11:55:00Z')}
      />
      <CommentItem
        content="Documentation verified."
        authorName="Bob Wilson"
        createdAt={new Date('2025-12-01T14:20:00Z')}
      />
      <CommentItem
        content="Ready for approval."
        authorName="Jane Smith"
        createdAt={new Date('2025-12-10T09:30:00Z')}
      />
    </div>
  ),
};
