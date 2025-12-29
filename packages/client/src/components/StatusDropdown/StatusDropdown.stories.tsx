import type { Meta, StoryObj } from '@storybook/react';
import { StatusDropdown } from './StatusDropdown';

const meta = {
  title: 'Components/StatusDropdown',
  component: StatusDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatusDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToDo: Story = {
  args: {
    caseId: '1',
    currentStatus: 'TO_DO',
  },
};

export const InProgress: Story = {
  args: {
    caseId: '1',
    currentStatus: 'IN_PROGRESS',
  },
};

export const Completed: Story = {
  args: {
    caseId: '1',
    currentStatus: 'COMPLETED',
  },
};

export const Closed: Story = {
  args: {
    caseId: '1',
    currentStatus: 'CLOSED',
  },
};
