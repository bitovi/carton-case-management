import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/obra/Button';
import { EditableDate } from '@/components/inline-edit/EditableDate/EditableDate';
import { EditableSelect } from '@/components/inline-edit';

const mockCases = [
  { value: 'case-1', label: 'Policy Coverage Inquiry' },
  { value: 'case-2', label: 'Claims Processing Delay' },
  { value: 'case-3', label: 'Billing Dispute Resolution' },
];

const mockUsers = [
  { value: '__unassigned__', label: 'Unassigned' },
  { value: 'user-1', label: 'Jane Smith' },
  { value: 'user-2', label: 'John Doe' },
  { value: 'user-3', label: 'Alex Johnson' },
];

function TaskEssentialDetailsStory({
  isExpanded = true,
  isPending = false,
}: {
  isExpanded?: boolean;
  isPending?: boolean;
}) {
  const noop = async () => {};

  return (
    <div className="w-full lg:w-[200px] flex flex-col gap-3">
      <Button
        onClick={() => {}}
        variant="secondary"
        className="flex items-center justify-between py-2 w-full h-auto"
      >
        <h3 className="text-sm font-semibold">Essential Details</h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform text-gray-600 ${!isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      {isExpanded && (
        <>
          <EditableSelect
            label="Assigned Case"
            value="case-1"
            displayValue="Policy Coverage Inquiry"
            options={mockCases}
            onSave={noop}
            readonly={isPending}
            placeholder="Select case"
          />
          <EditableSelect
            label="Assigned To"
            value="user-1"
            displayValue="Jane Smith"
            options={mockUsers}
            onSave={noop}
            readonly={isPending}
            placeholder="Unassigned"
          />
          <EditableDate
            label="Due Date"
            value={new Date('2024-01-20').toISOString()}
            onSave={noop}
            readonly={isPending}
            placeholder="No due date"
          />
          <div className="flex flex-col">
            <span
              className="text-[11px] text-gray-800 tracking-[0.24px] leading-4 px-1"
              style={{ fontFamily: '"Source Sans 3", sans-serif' }}
            >
              Created By
            </span>
            <p
              className="text-[13px] font-semibold px-1.5 py-1.5"
              style={{ fontFamily: '"Source Sans 3", sans-serif' }}
            >
              Alex Johnson
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const meta = {
  title: 'Figma Variants/TaskEssentialDetails',
  component: TaskEssentialDetailsStory,
  decorators: [],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof TaskEssentialDetailsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandedPendingFalse: Story = {
  args: {
    isExpanded: true,
    isPending: false,
  },
};

export const ExpandedPendingTrue: Story = {
  args: {
    isExpanded: true,
    isPending: true,
  },
};

export const CollapsedPendingFalse: Story = {
  args: {
    isExpanded: false,
    isPending: false,
  },
};
