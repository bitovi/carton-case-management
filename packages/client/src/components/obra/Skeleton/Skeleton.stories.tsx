import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'Obra/Skeleton',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246698&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: 'h-24 w-full',
  },
};

export const Avatar: Story = {
  args: {
    variant: 'avatar',
  },
};

export const Line: Story = {
  args: {
    variant: 'line',
  },
};

export const UserProfileCard: Story = {
  render: () => (
    <div className="space-y-4 p-4 border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" className="w-1/4" />
          <Skeleton variant="line" className="w-3/4" />
        </div>
      </div>
      <Skeleton variant="object" className="h-32 w-full" />
    </div>
  ),
};
